import { Folder } from 'lucide-react';
import DirDropDown from './DirDropDown';

const FolderTile = ({ directory, onOpen, onDelete, onRename }) => {
  return (
    <div className="w-full sm:w-52 group relative cursor-pointer p-4 border rounded-xl bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all">
      {/* CLICK TO OPEN DIRECTORY */}
      <div onClick={() => onOpen(directory._id)}>
        <Folder className="w-10 h-10 text-yellow-500 group-hover:text-yellow-600" />

        <p className="mt-2 text-sm font-medium text-gray-700 truncate">
          {directory.name}
        </p>
      </div>

      {/* 3-DOT DROPDOWN AT TOP RIGHT */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <DirDropDown
          id={directory._id}
          onDelete={onDelete}
          onRename={() => onRename(directory)}
        />
      </div>
    </div>
  );
};

export default FolderTile;
