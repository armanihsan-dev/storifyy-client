import React from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useMySubscription, useCurrentUser } from '@/hooks/otherHooks';
import { formatFileSize } from '../utility/functions';
import { uploadComplete, uploadInitiate } from '../API/FileAPI';

const FileUpload = ({ setShouldRefresh }) => {
  const { dirId: parentDirId } = useParams();

  const { data: subscription } = useMySubscription();
  const { data: user } = useCurrentUser();
  if (!user) return null;
  const remainingStorage = (user.maxStorage ?? 0) - (user.usedStorage ?? 0);

  // 🚨 Only PAUSED is a hard stop
  const isPaused = subscription?.status === 'paused';
  const iscancelled = subscription?.status === 'cancelled';
  const canUpload =
    !isPaused &&
    remainingStorage > 0 &&
    user.maxUploadBytes > 0 &&
    !iscancelled;

  async function handleFileChange(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isPaused) {
      toast.error('Your subscription is paused. Resume it to upload files.');
      return;
    }

    for (const file of files) {
      // 🔒 Max upload size check (plan-based)
      if (file.size > user.maxUploadBytes) {
        toast.error(
          `Max upload size is ${formatFileSize(user.maxUploadBytes)}`
        );
        continue;
      }

      // 🔒 Storage check
      if (file.size > remainingStorage) {
        toast.error(`Only ${formatFileSize(remainingStorage)} storage left`);
        continue;
      }

      try {
        const { uploadSignedURL, fileID } = await uploadInitiate({
          name: file.name,
          size: file.size,
          contentType: file.type,
          parentDirId,
        });

        await uploadSingleFile({ file, uploadSignedURL, fileID });
      } catch (err) {
        console.error(err);
        toast.error(`❌ Failed to upload ${file.name}`);
      }
    }

    setShouldRefresh(true);
  }

  function uploadSingleFile({ file, uploadSignedURL, fileID }) {
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

      xhr.upload.onprogress = (e) => {
        const percent = ((e.loaded / e.total) * 100).toFixed(0);

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
          await uploadComplete(fileID);
          toast.success(`${file.name} uploaded!`, { id: uploadToast });
        } else {
          toast.error(`❌ Upload failed`, { id: uploadToast });
        }
        resolve();
      };

      xhr.onerror = () => {
        toast.error(`❌ Upload failed`, { id: uploadToast });
        resolve();
      };

      xhr.send(file);
    });
  }

  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <label
            htmlFor="file-upload"
            className={`rounded-full py-3 px-4 flex items-center
              ${
                canUpload
                  ? 'cursor-pointer bg-pink-400 text-white'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
            onClick={() => {
              if (isPaused) {
                toast.error('Your subscription is paused. Resume to upload.');
              } else if (remainingStorage <= 0) {
                toast.error('You have used all your storage.');
              }
            }}
          >
            <FaCloudUploadAlt size={20} />
          </label>
        </TooltipTrigger>

        <TooltipContent>
          {isPaused
            ? 'Uploads paused — resume your subscription'
            : subscription?.status === 'expired'
            ? 'Free plan active — limited uploads'
            : subscription?.status === 'cancelled'
            ? 'Activate your plan to start uploading'
            : 'Upload files'}
        </TooltipContent>
      </Tooltip>

      <input
        id="file-upload"
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
