import React from 'react';
import SharedFileDropDown from './SharedFileDropDown';
import { FiEye, FiEdit2 } from 'react-icons/fi';
import { shortenName } from '../../components/FileCard';

const SharedFileCard = ({ file, onDelete, onRename }) => {
  const extension = file.extension || '.file';
  const ext = extension.replace('.', '');
  const iconPath = `/fileicons/${ext}.svg`;
  const fileName = file.name?.split('.')[0] || 'Untitled';

  const isEditor = file.sharedRole?.toLowerCase() === 'editor';
  const RoleIcon = isEditor ? FiEdit2 : FiEye;

  const roleBadgeStyle = isEditor
    ? 'bg-rose-50 text-rose-600 border border-rose-200'
    : 'bg-indigo-50 text-indigo-600 border border-indigo-200';

  return (
    <div className="w-full  p-5 bg-white shadow-md rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        {/* Icon + Name */}
        <div className="flex items-center gap-3">
          <img
            src={iconPath}
            onError={(e) => (e.currentTarget.src = '/fileicons/file.svg')}
            className="w-12 h-12 rounded-md"
          />

          <p className="font-semibold text-gray-800 text-sm leading-tight max-w-[140px]">
            {shortenName(fileName, 10)}
            <span className="block text-[11px] text-gray-400 font-medium mt-0.5">
              {extension}
            </span>
          </p>
        </div>
      </div>

      {/* DATE */}
      <p className="text-xs text-gray-400 mt-4">
        Shared on:{' '}
        <span className="text-gray-600 font-medium">
          {new Date(file.sharedAt).toLocaleDateString()}
        </span>
      </p>

      {/* ROLE BADGE */}
      <div className="flex justify-between items-center">
        {file.sharedRole && (
          <div
            className={`flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full w-fit text-xs font-semibold ${roleBadgeStyle}`}
          >
            <RoleIcon size={12} />
            <span className="capitalize">{file.sharedRole}</span>
          </div>
        )}
        {/* Dropdown */}
        <SharedFileDropDown
          id={file._id}
          role={file.sharedRole}
          onDelete={onDelete}
          onRename={onRename}
          onShare={() => console.log('share again')}
        />
      </div>
    </div>
  );
};

export default SharedFileCard;
