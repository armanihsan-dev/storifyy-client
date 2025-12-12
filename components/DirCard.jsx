import { useState } from 'react';
import DirDropdown from './DirDropdown';
import RenameDialog from './RenameDialog';
import { FiFolder, FiStar } from 'react-icons/fi';
import { Folder } from 'lucide-react';
import { formatFileSize } from '../utility/functions';

import { useToggleStar } from './../src/hooks/otherHooks';

const DirCard = ({ id, name, onOpen, refetch, details, isStarred }) => {
  const BASE_URL = 'http://localhost:3000';
  const [openRename, setOpenRename] = useState(false);
  const { createdAt, updatedAt, size } = details;
  const { mutate: toggleStar } = useToggleStar();
  // DELETE
  async function handleDelete(dirId) {
    try {
      await fetch(`${BASE_URL}/directory/${dirId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      refetch();
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
      refetch();
    } catch (error) {
      console.error('Failed to rename directory', error);
    }
  }

  return (
    <>
      <div
        className="group relative w-full flex items-center justify-between p-3.5 rounded-xl border border-transparent bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:border-slate-200 transition-all duration-200 cursor-pointer"
        // onClick={() => onOpen(id)}
        onDoubleClick={() => onOpen(id)}
      >
        <FiStar
          className={`absolute top-4 right-4 cursor-pointer ${
            isStarred ? 'text-pink-400 fill-pink-400' : 'text-gray-400'
          }`}
          onClick={() => toggleStar(id)}
          size={18}
        />
        {/* Left Side */}
        <div className="flex flex-col gap-3 overflow-hidden min-w-0 relative">
          {/* Icon + Name + Size */}
          <div className="flex items-start gap-3 min-w-0">
            {/* Icon */}
            <div className="bg-pink-50 p-2 rounded-full">
              <Folder className="text-pink-400" size={24} />
            </div>

            {/* Text Content */}
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-medium text-slate-700 truncate select-none group-hover:text-slate-900">
                {name}
              </span>

              <span className="text-xs text-slate-500 mt-0.5 font-semibold">
                {formatFileSize(size)}
              </span>
            </div>
          </div>

          {/* Date Modified */}
          <p className="text-xs bg-pink-50 rounded-3xl px-3 py-1 text-pink-700 font-semibold">
            {new Date(updatedAt).toLocaleString()}
          </p>
        </div>

        {/* Right Side (Dropdown) */}
        <div
          className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <DirDropdown
            id={id}
            details={{ ...details, name }}
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
