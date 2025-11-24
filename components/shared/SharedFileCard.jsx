import React from 'react';
import SharedFileDropDown from './SharedFileDropDown';
import { FiClock, FiShield, FiEye, FiEdit2 } from 'react-icons/fi';
import { shortenName } from '../../components/FileCard';

const SharedFileCard = ({ file, onDelete, onRename }) => {
  const extension = file.extension || '.file';
  const ext = extension.replace('.', '');
  const iconPath = `/fileicons/${ext}.svg`;
  const fileName = file.name.split('.')[0];
  console.log(file);
  const handleShareAgain = () => {
    console.log('open share modal again');
  };
  const isEditor = file.sharedRole?.toLowerCase() === 'editor';
  const roleBadgeStyle = isEditor
    ? 'bg-rose-50 text-rose-600 border-rose-100'
    : 'bg-indigo-50 text-indigo-600 border-indigo-100';
  const RoleIcon = isEditor ? FiEdit2 : FiEye;

  return (
    <div
      className={`w-full ${
        file.sharedRole ? 'h-48' : 'h-36'
      } p-5 bg-white shadow-sm rounded-2xl relative`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center justify-center gap-2">
          <img
            src={iconPath}
            onError={(e) => (e.currentTarget.src = '/fileicons/file.svg')}
            className="w-12 h-12"
          />
          <p className="mt-4 font-semibold text-gray-800 text-lg">
            {shortenName(fileName, 22)}
          </p>
        </div>

        <SharedFileDropDown
          id={file._id}
          role={file.sharedRole}
          onDelete={onDelete}
          onRename={onRename}
          onShare={handleShareAgain}
        />
      </div>

      <p className="text-sm text-gray-400 mt-2">
        Shared at:{' '}
        <span className="text-gray-600">
          {new Date(file.sharedAt).toLocaleString()}
        </span>
      </p>

      {file.sharedRole && (
        <div
          className={`flex items-center gap-1.5 mt-5 px-2.5 py-1 rounded-full w-fit border text-xs font-semibold ${roleBadgeStyle}`}
        >
          <RoleIcon size={10} />
          <span className="capitalize">{file.sharedRole || 'Viewer'}</span>
        </div>
      )}
    </div>
  );
};

export default SharedFileCard;
