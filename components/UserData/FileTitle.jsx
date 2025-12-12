import { File } from 'lucide-react';
import FileDropDown from './FileDropDown';

const FileTile = ({ file, refreshFiles }) => {
  return (
    <div className="w-full sm:w-50 group relative cursor-pointer p-4 border rounded-xl bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all">
      <File className="w-10 h-10 text-blue-500 group-hover:text-blue-600" />

      <p className="mt-2 text-sm font-medium text-gray-700 truncate">
        {file.name}
      </p>

      <p className="text-xs text-gray-400">{file.extension}</p>

      <div className="absolute top-2 right-2">
        <FileDropDown id={file._id} refreshFiles={refreshFiles} />
      </div>
    </div>
  );
};

export default FileTile;
