import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCurrentUser } from '@/hooks/otherHooks';
import { formatFileSize } from '../utility/functions';

const FileUpload = ({ setShouldRefresh }) => {
  const BASE_URL = 'http://localhost:3000';

  const params = useParams();

  const parentDirId = params.dirId;
  const { data } = useCurrentUser();

  async function handleFileChange(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

    // ⬅️ NEW: Calculate available storage
    const availableSpace = data?.maxStorage - data?.usedStorage;

    for (let file of files) {
      // ⬅️ NEW: 100MB limit check
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File size exceeds the 100MB limit.`);
        continue;
      }

      // ⬅️ NEW: Storage capacity check
      if (file.size > availableSpace) {
        toast.error(
          `Not enough space! Only ${formatFileSize(availableSpace)} left.`
        );
        continue; // skip this file
      }

      await uploadSingleFile(file);
    }

    setShouldRefresh(true);
  }

  function uploadSingleFile(file) {
    return new Promise((resolve) => {
      const uploadToast = toast(
        <div className="flex items-center space-x-3">
          <ClipLoader size={20} color="#fff" />
          <span>Uploading {file.name}...</span>
        </div>,
        {
          style: { background: 'white', color: 'black' },
          position: 'top-center',
        }
      );

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/file/${parentDirId || ''}`, true);
      xhr.setRequestHeader('filename', file.name);
      xhr.setRequestHeader('filesize', file.size);
      xhr.withCredentials = true;

      xhr.upload.addEventListener('progress', (e) => {
        const percentage = ((e.loaded / e.total) * 100).toFixed(0);

        toast(
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <ClipLoader size={18} color="#fff" />
              <span>{percentage}% uploaded</span>
            </div>
            <div className="w-40 bg-gray-300 rounded-full h-2">
              <div
                className="bg-pink-400 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>,
          {
            id: uploadToast,
            style: { background: 'white', color: 'black' },
            position: 'top-center',
          }
        );
      });

      xhr.onload = () => {
        toast.success(`${file.name} uploaded!`, { id: uploadToast });
        resolve();
      };

      xhr.onerror = () => {
        toast.error(`❌ Failed to upload ${file.name}`, { id: uploadToast });
        resolve();
      };

      xhr.send(file);
    });
  }

  return (
    <div className="flex flex-col items-start justify-center w-full">
      <Tooltip>
        <TooltipTrigger asChild>
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-pink-400 text-white rounded-full py-3 px-4 flex items-center space-x-2"
          >
            <FaCloudUploadAlt size={20} />
          </label>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <p>Upload Files</p>
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
