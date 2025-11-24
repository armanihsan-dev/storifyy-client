import React, { useState } from 'react';
import FileActionsDropdown from './DropDown';
import RenameDialog from './RenameDialog';
import SharePopup from './SharePopup';

export function shortenName(name, max = 20) {
  if (name.length <= max) return name;
  return name.slice(0, max) + '...';
}

const FileCard = ({
  id,
  title,
  sizeLabel,
  updatedAt,
  onDownload = () => {},
  onPreview = () => {},
  getDirectories,
}) => {
  const extension = title.split('.').pop().toLowerCase();
  const iconPath = `/fileicons/${extension}.svg`;

  const BASE_URL = 'http://localhost:3000';
  const [isRenaming, setIsRenaming] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  async function handleDelete(fileid) {
    await fetch(`${BASE_URL}/file/${fileid}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    getDirectories();
  }

  function handleRename() {
    setIsRenaming(true);
  }

  async function saveFilename(id, value) {
    await fetch(`${BASE_URL}/file/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newFilename: value }),
    });
    setIsRenaming(false);
    getDirectories();
  }

  return (
    <div className="relative  isolate w-full lg:w-[240px] lg:h-[240px] rounded-2xl bg-white shadow-sm">
      <div className="relative z-10 h-full p-6">
        <div className="flex items-center justify-between">
          <img
            src={iconPath}
            onError={(e) => (e.currentTarget.src = '/fileicons/file.svg')}
            className="w-[40px] h-[40px]"
            alt={`${extension} icon`}
          />
          <div className="text-sm font-semibold text-slate-700">
            {sizeLabel}
          </div>
        </div>

        <div className="pt-6">
          <div className="mt-6 text-lg font-semibold text-slate-800">
            {shortenName(title.split('.')[0], 22)}
          </div>

          <div className="mt-4 text-[13px] font-medium text-gray-500/60 flex justify-between items-center">
            <div>
              <p>Last update</p>
              <p className="text-gray-500">{updatedAt}</p>
            </div>

            <FileActionsDropdown
              id={id}
              BASE_URL={BASE_URL}
              onDownload={onDownload}
              onPreview={onPreview}
              onDelete={handleDelete}
              onRename={handleRename}
              onShare={() => setShareOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Rename Dialog */}
      <RenameDialog
        open={isRenaming}
        initialName={title}
        onClose={() => setIsRenaming(false)}
        onSave={(value) => saveFilename(id, value)}
      />

      {/* Share Popup — OUTSIDE card layout */}
      <SharePopup
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        fileId={id} // FIXED
        BASE_URL={BASE_URL}
      />
    </div>
  );
};

export default FileCard;
