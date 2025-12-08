import React, { useState } from 'react';
import FileActionsDropdown from './DropDown';
import RenameDialog from './RenameDialog';
import SharePopup from './SharePopup';

export function shortenName(text, max = 22) {
  return text.length <= max ? text : text.slice(0, max) + '...';
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
  const baseName = title.replace(/\.[^/.]+$/, '');
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
    <a href={`${BASE_URL}/file/${id}`} className="block">
      <div className="cursor-pointer w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
        {/* Top section */}
        <div className="flex items-start justify-between gap-3">
          {/* ICON + TEXT */}
          <div className="flex items-start gap-3 min-w-0">
            {/* ICON */}
            <img
              src={iconPath}
              onError={(e) => (e.currentTarget.src = '/fileicons/file.svg')}
              className="w-10 h-10 flex-shrink-0"
              alt={`${extension} icon`}
            />

            <div className="flex flex-col min-w-0">
              {/* FILENAME */}
              <p className="text-sm font-semibold text-slate-800 truncate max-w-[160px]">
                {shortenName(baseName, 22)}
              </p>

              {/* EXT + SIZE */}
              <p className="text-xs text-slate-500 mt-0.5">
                {extension.toUpperCase()} • {sizeLabel}
              </p>
            </div>
          </div>

          {/* DROPDOWN — stop click so file doesn’t open */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <FileActionsDropdown
              id={id}
              BASE_URL={BASE_URL}
              onDownload={onDownload}
              onPreview={onPreview}
              onDelete={handleDelete}
              onRename={() => setIsRenaming(true)}
              onShare={() => setShareOpen(true)}
            />
          </div>
        </div>

        {/* Bottom meta row */}
        <div className="mt-3">
          <p className="text-xs text-slate-500">
            Updated:{' '}
            <span className="text-slate-700 font-semibold">{updatedAt}</span>
          </p>
        </div>

        {/* Rename Dialog */}
        <RenameDialog
          open={isRenaming}
          initialName={title}
          onClose={() => setIsRenaming(false)}
          onSave={(value) => saveFilename(id, value)}
        />

        {/* Share Popup */}
        <SharePopup
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          fileId={id}
          BASE_URL={BASE_URL}
        />
      </div>
    </a>
  );
};

export default FileCard;
