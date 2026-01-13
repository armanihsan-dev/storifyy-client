import React, { useState } from 'react';
import FileActionsDropdown from './DropDown';
import RenameDialog from './RenameDialog';
import { Eye, CloudDownload } from 'lucide-react';
import SharePopup from './SharePopup';
import { formatFileSize } from '../utility/functions';

export function shortenName(text, max = 22) {
  return text.length <= max ? text : text.slice(0, max) + '...';
}

const FileCard = ({
  id,
  title,
  sizeLabel,
  updatedAt,
  refetch,
  path,
  extension,
}) => {
  const baseName = title.replace(/\.[^/.]+$/, '');
  const iconPath = `/fileicons/${extension.split('.')[1]}.svg`;
  const fileSize = formatFileSize(sizeLabel || 0);
  const BASE_URL = 'https://storifyy-backend.onrender.com';
  const [isRenaming, setIsRenaming] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const date_modified = updatedAt.split(',')[0];

  async function handleDelete(fileId) {
    await fetch(`${BASE_URL}/file/${fileId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    refetch();
  }

  async function saveFilename(id, value) {
    await fetch(`${BASE_URL}/file/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newFilename: value }),
    });

    setIsRenaming(false);
    refetch();
  }

  return (
    <div className="flex flex-col justify-between cursor-pointer w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      {/* Top section */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <img
            src={iconPath}
            onError={(e) => (e.currentTarget.src = '/fileicons/file.svg')}
            className="w-10 h-10 flex-shrink-0"
            alt={`${extension} icon`}
          />

          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate max-w-[160px]">
              {shortenName(baseName, 22)}
            </p>

            <p className="text-xs text-slate-500 mt-0.5">
              {extension.toUpperCase()} •{' '}
              <span className="font-semibold">{fileSize}</span>
            </p>
          </div>
        </div>

        {/* Dropdown */}
        <FileActionsDropdown
          id={id}
          BASE_URL={BASE_URL}
          onDelete={handleDelete}
          onRename={() => setIsRenaming(true)}
          onShare={() => setShareOpen(true)}
          details={{
            title,
            extension,
            size: fileSize,
            createdAt: updatedAt, // use real createdAt if available
            updatedAt,
            path, // or your actual backend path
          }}
        />
      </div>

      {/* Updated Time */}
      <div className="mt-3">
        <p className="text-xs text-slate-500">
          Updated:{' '}
          <span className="text-slate-700 font-semibold">{date_modified}</span>
        </p>
      </div>

      {/* NEW BADGES SECTION */}
      <div className="flex items-center justify-between mt-3 ">
        {/* Preview Badge */}
        <button
          className="text-xs bg-blue-50 flex gap-1.5 items-center text-blue-700 px-2 py-1 rounded-lg font-medium hover:bg-blue-100 transition"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `${BASE_URL}/file/${id}`;
          }}
        >
          <Eye size={16} />
          Preview
        </button>

        {/* Download Badge */}
        <button
          className="text-xs bg-emerald-50 flex gap-1.5 items-center text-emerald-700 px-2 py-1 rounded-lg font-medium hover:bg-emerald-100 transition"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `${BASE_URL}/file/${id}/?action=download`;
          }}
        >
          <CloudDownload size={16} />
          Download
        </button>
      </div>

      {/* Modals */}
      <RenameDialog
        open={isRenaming}
        initialName={title}
        onClose={() => setIsRenaming(false)}
        onSave={(value) => saveFilename(id, value)}
      />

      <SharePopup
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        fileId={id}
        BASE_URL={BASE_URL}
      />
    </div>
  );
};

export default FileCard;
