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

const FileUpload = ({ getDirectories }) => {
  const BASE_URL = 'http://localhost:3000';
  const [progress, setProgress] = useState(0);
  const params = useParams();
  const parentDirId = params.dirId;

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

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
    xhr.withCredentials = true;
    // Track progress
    xhr.upload.addEventListener('progress', (e) => {
      const percentage = ((e.loaded / e.total) * 100).toFixed(0);
      setProgress(percentage);

      toast(
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center space-x-2">
            <ClipLoader size={18} color="#fff" />
            <span>{percentage}% uploaded</span>
          </div>
          <div className="w-40 bg-gray-300 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full"
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

    xhr.addEventListener('load', () => {
      toast.success('Upload complete!', {
        id: uploadToast,
        position: 'top-center',
      });

      setProgress(0);
      getDirectories();
    });

    xhr.addEventListener('error', () => {
      toast.error('❌ Upload failed!', { id: uploadToast });
      setProgress(0);
    });

    xhr.send(file);
  }

  return (
    <div className="flex flex-col items-start justify-center w-full">
      {/* Upload button */}
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
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
