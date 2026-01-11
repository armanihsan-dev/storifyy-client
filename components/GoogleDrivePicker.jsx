import { FaGoogleDrive } from 'react-icons/fa';
import useDrivePicker from 'react-google-drive-picker';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { useMySubscription, useCurrentUser } from '@/hooks/otherHooks';

// 👉 TEMP frontend API (you’ll replace implementation later)
import { formatFileSize } from '../utility/functions';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { uploadComplete, uploadInitiate } from '../API/FileAPI';

const GoogleDrivePicker = () => {
  const [openPicker, data] = useDrivePicker();
  const [ShouldRefresh, setShouldRefresh] = useState(false);
  const { dirId: parentDirId } = useParams();
  const { data: subscription } = useMySubscription();
  const { data: user } = useCurrentUser();

  const [googleAccessToken, setGoogleAccessToken] = useState(null);
  const requestGoogleToken = () => {
    return new Promise((resolve, reject) => {
      if (!window.google?.accounts?.oauth2) {
        toast.error('Google auth not loaded yet');
        reject();
        return;
      }

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        callback: (response) => {
          if (response.error) {
            toast.error('Google authentication failed');
            reject(response);
          } else {
            setGoogleAccessToken(response.access_token);
            resolve(response.access_token);
          }
        },
      });

      tokenClient.requestAccessToken();
    });
  };

  if (!user) return null;

  const remainingStorage = (user.maxStorage ?? 0) - (user.usedStorage ?? 0);

  const isPaused = subscription?.status === 'paused';
  const isCancelled = subscription?.status === 'cancelled';
  const scope = ['https://www.googleapis.com/auth/drive.readonly'];

  const canImport =
    !isPaused &&
    !isCancelled &&
    remainingStorage > 0 &&
    user.maxUploadBytes > 0;

  const handleOpenPicker = async () => {
    if (!canImport) {
      if (isPaused) return toast.error('Your subscription is paused.');
      if (isCancelled)
        return toast.error('Activate your plan to import files.');
      if (remainingStorage <= 0) return toast.error('No storage left.');
      return;
    }

    let token = googleAccessToken;

    if (!token) {
      try {
        token = await requestGoogleToken(); // 🔑 GET TOKEN FIRST
      } catch {
        return;
      }
    }

    openPicker({
      clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
      developerKey: import.meta.env.VITE_GOOGLE_PICKER_API_KEY,
      viewId: 'DOCS',
      multiselect: true,
      supportDrives: true,

      token, // 🔥 THIS IS THE KEY FIX

      callbackFunction: async (data) => {
        if (data.action !== 'picked') return;

        const files = data.docs;
        if (!files?.length) return;

        for (const file of files) {
          if (file.sizeBytes > user.maxUploadBytes) {
            toast.error(
              `Max upload size is ${formatFileSize(user.maxUploadBytes)}`
            );
            continue;
          }

          if (file.sizeBytes > remainingStorage) {
            toast.error(
              `Only ${formatFileSize(remainingStorage)} storage left`
            );
            continue;
          }

          try {
            const { uploadSignedURL, fileID } = await uploadInitiate({
              name: file.name,
              size: file.sizeBytes,
              contentType: file.mimeType,
              parentDirId,
            });

            await uploadSingleFile({
              file,
              uploadSignedURL,
              fileID,
              accessToken: token, // 🔑 SAME TOKEN
            });
          } catch (err) {
            console.error(err);
            toast.error(`❌ Failed to upload ${file.name}`);
          }
        }
      },
    });
  };

  // Note: Keeping the function async is good, but you can simplify the logic
  // to return a promise directly from the fetch/upload sequence.
  async function uploadSingleFile({
    file,
    uploadSignedURL,
    fileID,
    accessToken,
  }) {
    let fileBlob;
    // 2. Fetch the actual file content as a Blob
    try {
      // Must use 'await'
      fileBlob = await fetchGoogleFileBlob(file.id, accessToken, file.mimeType);
    } catch (error) {
      console.error('Error fetching file from Google Drive:', error);
      toast.error(`❌ Failed to fetch ${file.name} from Drive`);
      return;
    }

    // 3. Start the S3 Upload Promise
    return new Promise((resolve) => {
      const uploadToast = toast(
        <div className="flex items-center space-x-3">
          <ClipLoader size={18} />
          <span>Uploading {file.name}...</span>
        </div>,
        {
          style: { background: 'white', color: 'black' },
          position: 'top-center',
        }
      );

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadSignedURL, true);

      // 🛑 CRITICAL FIX 1: Set the Content-Type header to match the S3 signature
      xhr.setRequestHeader('Content-Type', file.mimeType);

      xhr.upload.onprogress = (e) => {
        const percent = ((e.loaded / e.total) * 100).toFixed(0);

        // Note: You can also use a library like react-hot-toast to update
        // a single toast's content more efficiently.
        toast(
          <div className="flex flex-col gap-2">
            <span>{percent}% uploaded</span>
            <div className="w-40 bg-gray-300 rounded-full h-2">
              <div
                className="bg-pink-400 h-2 rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>,
          { id: uploadToast }
        );
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          // ... rest of success logic
          await uploadComplete(fileID);
          toast.success(`${file.name} uploaded!`, { id: uploadToast });
        } else {
          // If S3 returns an error (like SignatureDoesNotMatch), it ends up here
          // You might want to log xhr.responseText for debugging S3 errors
          toast.error(
            `❌ Upload failed: Server returned status ${xhr.status}`,
            { id: uploadToast }
          );
          console.error('S3 Upload Failed Response:', xhr.responseText);
        }
        resolve();
      };

      xhr.onerror = () => {
        toast.error(`❌ Upload failed (Network/XHR error)`, {
          id: uploadToast,
        });
        resolve();
      };

      // 🛑 CRITICAL FIX 2: Send the downloaded Blob, NOT the metadata object
      xhr.send(fileBlob);
    });
  }

  return (
    <button
      onClick={handleOpenPicker}
      disabled={!canImport}
      className={`flex items-center gap-2 px-4 py-3 rounded-3xl border transition
        ${
          canImport
            ? 'bg-white border-slate-200 hover:shadow-sm'
            : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
        }`}
    >
      <FaGoogleDrive size={18} className="text-green-500" />
      <span className="text-sm font-medium">Import from Drive</span>
    </button>
  );
};

export default GoogleDrivePicker;

// Function to fetch the Google Drive file content as a Blob
const fetchGoogleFileBlob = (fileId, accessToken, mimeType) => {
  // The export=download parameter is crucial for getting the file content.
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Google Drive fetch failed: ${response.statusText}`);
        }
        // Resolve with the actual file Blob
        return response.blob();
      })
      .then((blob) => {
        // S3 requires the Content-Type header to match the signature.
        // Ensure the fetched Blob has the correct MIME type.
        const typedBlob = new Blob([blob], { type: mimeType });
        resolve(typedBlob);
      })
      .catch(reject);
  });
};
