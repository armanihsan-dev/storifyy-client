import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import DirDropdown from './DirDropdown';
import RenameDialog from './RenameDialog';

const DirCard = ({ id, name, onOpen = () => {}, getDirectories }) => {
  const BASE_URL = 'http://localhost:3000';
  const [openRename, setOpenRename] = useState(false);
  

  // DELETE
  async function handleDelete(dirId) {
    await fetch(`${BASE_URL}/directory/${dirId || ''}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    getDirectories();
  }

  // SAVE (rename)
  async function saveDirName(newName) {
    await fetch(`${BASE_URL}/directory/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newDirName: newName }),
    });
    getDirectories();
  }

  return (
    <div className="relative isolate w-full lg:w-[240px] lg:h-[240px] rounded-xl shadow-sm bg-white">
      {/* Content container */}
      <div className="relative z-10 h-full p-6">
        {/* folder icon */}
        <img src="../public/fileicons/dir.svg" className="w-[40px] h-[40px]" />
        <div className="bg-pink-400 w-fit text-white px-3 rounded-full mt-1 text-sm">
          folder
        </div>

        {/* Directory name */}
        <div
          className="mt-6 text-lg font-semibold text-slate-800 cursor-pointer"
          onClick={() => onOpen(id)}
        >
          {name}
        </div>

        {/* Last update + dropdown */}
        <div className="mt-4 text-[13px] font-medium text-gray-500/60 flex justify-between items-center">
          <div>
            <p>Last update</p>
            <p className="text-gray-500">10/9/2024 10:15am</p>
          </div>
          <DirDropdown
            id={id}
            onDelete={handleDelete}
            onRename={() => setOpenRename(true)}
          />
        </div>
      </div>

      {/* Rename modal */}
      <RenameDialog
        open={openRename}
        onClose={() => setOpenRename(false)}
        onSave={saveDirName}
        initialName={name}
      />
    </div>
  );
};

export default DirCard;
