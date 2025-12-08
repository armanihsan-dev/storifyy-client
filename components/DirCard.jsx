import { useState } from 'react';
import DirDropdown from './DirDropdown';
import RenameDialog from './RenameDialog';
import { FiFolder } from 'react-icons/fi';

const DirCard = ({ id, name, onOpen, getDirectories }) => {
  const BASE_URL = 'http://localhost:3000';
  const [openRename, setOpenRename] = useState(false);

  // DELETE
  async function handleDelete(dirId) {
    try {
      await fetch(`${BASE_URL}/directory/${dirId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      getDirectories();
    } catch (error) {
      console.error('Failed to delete directory', error);
    }
  }

  // SAVE (rename)
  async function saveDirName(newName) {
    try {
      await fetch(`${BASE_URL}/directory/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDirName: newName }),
      });
      getDirectories();
    } catch (error) {
      console.error('Failed to rename directory', error);
    }
  }

  return (
    <>
      <div
        className="group relative flex items-center justify-between w-full p-3.5 rounded-2xl border border-transparent bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:border-slate-200 transition-all duration-200 cursor-pointer"
        onClick={() => onOpen(id)}
        onDoubleClick={() => onOpen(id)}
      >
        {/* Left Side */}
        <div className="flex items-center gap-3 overflow-hidden min-w-0">
          <div className="flex text-slate-500 group-hover:text-slate-700 transition-colors">
            <img
              src="/fileicons/dir.svg"
              alt="folder"
              className="w-6 h-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <FiFolder className="w-5 h-5 hidden" />
          </div>

          <span className="text-[13px] font-medium text-slate-700 truncate select-none group-hover:text-slate-900">
            {name}
          </span>
        </div>

        {/* Right Side (Dropdown) */}
        <div
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <DirDropdown
            id={id}
            onDelete={handleDelete}
            onRename={() => setOpenRename(true)}
          />
        </div>
      </div>

      {/* Rename Dialog */}
      <RenameDialog
        open={openRename}
        onClose={() => setOpenRename(false)}
        onSave={saveDirName}
        initialName={name}
      />
    </>
  );
};

export default DirCard;
