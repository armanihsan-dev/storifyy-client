import { useEffect, useState } from 'react';
import {
  getAllSharedDirectories,
  getFilesSharedByMe,
  revokeSharedDirectory,
  revokeSharedFile,
} from '../API/share';

import { Users, MoreHorizontal, X } from 'lucide-react';
import { useSectionStore } from '@/store/sectionStore';
import {
  FiFolder,
  FiTrash2,
  FiActivity,
  FiFileText,
  FiShield,
} from 'react-icons/fi';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { shortenName } from '../components/FileCard';

export const truncateText = (text = '', max = 20) => {
  return text.length > max ? text.slice(0, max) + '…' : text;
};

/* ------------------ Helpers ------------------ */
const getInitials = (name = 'U') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// Helper to assign colors based on type
const getTypeStyles = (type) => {
  if (type === 'directory')
    return {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      icon: <FiFolder className="w-6 h-6 text-orange-500" />,
      border: 'group-hover:border-orange-200',
    };
  return {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    icon: <FiFileText className="w-6 h-6 text-indigo-500" />,
    border: 'group-hover:border-indigo-200',
  };
};

/* ------------------ Main Component ------------------ */
export default function SharedDirectoriesList() {
  const setSection = useSectionStore((s) => s.setSection);
  const queryClient = useQueryClient();

  // State for the "Manage Access" list modal
  const [manageItem, setManageItem] = useState(null); // The item currently being viewed
  const [manageType, setManageType] = useState(null); // 'directory' or 'file'

  // State for the "Confirm Revoke" confirmation modal
  const [confirmRevokeItem, setConfirmRevokeItem] = useState(null);

  useEffect(() => setSection('shared'), []);

  /* ------------------ Queries ------------------ */
  const { data: directoriesData, isLoading: directoriesLoading } = useQuery({
    queryKey: ['shared-directories'],
    queryFn: getAllSharedDirectories,
  });

  const { data: filesData, isLoading: filesLoading } = useQuery({
    queryKey: ['get-files-shared-by-me'],
    queryFn: getFilesSharedByMe,
  });

  const directories = directoriesData?.directories || [];
  const files = filesData?.files || [];
  const isLoading = directoriesLoading || filesLoading;
  const isEmpty = directories.length === 0 && files.length === 0;

  /* ------------------ Handlers ------------------ */
  const openManageModal = (item, type) => {
    setManageItem(item);
    setManageType(type);
  };

  const initiateRevoke = (user) => {
    setConfirmRevokeItem(user);
  };

  const handleRevokeConfirm = async () => {
    if (!confirmRevokeItem || !manageItem) return;

    try {
      if (manageType === 'directory') {
        await revokeSharedDirectory(
          manageItem.directoryId,
          confirmRevokeItem.sharedWith
        );
      } else if (manageType === 'file') {
        await revokeSharedFile(
          manageItem.fileId, // 👈 fileId
          confirmRevokeItem.sharedWith // 👈 email
        );
      }

      // ✅ Optimistic UI update (remove user immediately)
      setManageItem((prev) => ({
        ...prev,
        sharedWith: prev.sharedWith.filter(
          (u) => u.sharedWith !== confirmRevokeItem.sharedWith
        ),
      }));

      // ✅ Keep data in sync
      queryClient.invalidateQueries(['shared-directories']);
      queryClient.invalidateQueries(['get-files-shared-by-me']);

      toast.success('Access revoked successfully');
      setConfirmRevokeItem(null);
    } catch (err) {
      console.error(err);
      toast.error('Could not revoke access');
    }
  };

  /* ------------------ Loading State ------------------ */
  if (isLoading) {
    return (
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 rounded-2xl bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ------------------ Empty State ------------------ */
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="bg-slate-50 p-6 rounded-full mb-6 ring-8 ring-slate-50/50">
          <Users className="w-12 h-12 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Shared Items</h3>
        <p className="text-slate-400 mt-2">Items you share will appear here.</p>
      </div>
    );
  }

  /* ------------------ Render Card Helper ------------------ */
  const SharedCard = ({ item, type }) => {
    const styles = getTypeStyles(type);

    return (
      <div
        className={`group relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-lg transition-all ${styles.border}`}
      >
        {/* Card Header */}
        <div className="flex items-center  gap-2 ">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${styles.bg}`}
          >
            {styles.icon}
          </div>
          <div className="self-center  w-fit h-fit">
            <h3
              className="font-bold text-slate-800 text-sm truncate  pr-4"
              title={item.name}
            >
              {shortenName(item.name, 10)}
            </h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              {type === 'file' && item.size
                ? `${(item.size / 1024).toFixed(1)} KB`
                : 'Folder'}
            </p>
          </div>
        </div>

        {/* Card
         Content */}

        {/* Footer / Avatar Stack */}
        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
          <button
            onClick={() => openManageModal(item, type)}
            className={`
    inline-flex items-center gap-1.5
    px-3 py-1.5
    rounded-full
    text-xs font-semibold
    border
    transition-all
    ${
      type === 'directory'
        ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100'
        : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'
    }
    hover:shadow-sm
    focus:outline-none focus:ring-2 focus:ring-offset-1
    ${type === 'directory' ? 'focus:ring-orange-300' : 'focus:ring-indigo-300'}
  `}
          >
            <MoreHorizontal size={14} />
            Manage Access
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex items-center gap-3">
        <div className="p-2 bg-indigo-500 rounded-full shadow-lg shadow-indigo-200">
          <FiShield className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Shared Center</h1>
          <p className="text-slate-500 text-sm">
            Manage who has access to your content
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Directories */}
        {directories.map((dir) => (
          <SharedCard key={dir.directoryId} item={dir} type="directory" />
        ))}

        {/* Files */}
        {files.map((file) => (
          <SharedCard key={file.fileId} item={file} type="file" />
        ))}
      </div>

      {/* ------------------ Manage Access Dialog (List View) ------------------ */}
      <Dialog
        open={!!manageItem}
        onOpenChange={(open) => !open && setManageItem(null)}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-full ${
                  manageType === 'directory'
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-indigo-100 text-indigo-600'
                }`}
              >
                {manageType === 'directory' ? <FiFolder /> : <FiFileText />}
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {truncateText(manageItem?.name, 20)}
                </DialogTitle>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  {manageItem?.sharedWith.length} people have access
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto -mx-6 px-6 pt-2">
            <div className="space-y-4">
              {manageItem?.sharedWith.map((user, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center group p-2 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        {user.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {user.email || user.sharedWith}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => initiateRevoke(user)}
                    className="opacity-0 group-hover:opacity-100 transition-all p-2 bg-white border border-slate-200 text-rose-500 rounded-full hover:bg-rose-50 hover:border-rose-100 shadow-sm"
                    title="Revoke Access"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <button
              onClick={() => setManageItem(null)}
              className="text-sm text-slate-500 hover:text-slate-800 w-full text-center mt-2"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ------------------ Confirmation Dialog ------------------ */}
      <Dialog
        open={!!confirmRevokeItem}
        onOpenChange={(open) => !open && setConfirmRevokeItem(null)}
      >
        <DialogContent className="max-w-xs rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-rose-600">
              Revoke Access?
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-2">
            <p className="text-slate-600 text-sm">
              Are you sure you want to revoke access from
              <br />
              <span className="font-bold text-slate-800">
                {confirmRevokeItem?.name}
              </span>
              ?
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setConfirmRevokeItem(null)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleRevokeConfirm}
              className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 shadow-lg shadow-rose-200 transition"
            >
              Yes, Revoke
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
