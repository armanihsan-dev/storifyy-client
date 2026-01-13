import { useEffect, useState, useMemo } from 'react';
import {
  getAllSharedDirectories,
  getFilesSharedByMe,
  revokeSharedDirectory,
  revokeSharedFile,
} from '../API/share';

import {
  MoreHorizontal,
  Search,
  Share2,
  FolderOpen,
  FileText,
  Filter,
} from 'lucide-react';
import { useSectionStore } from '@/store/sectionStore';
import {
  FiFolder,
  FiTrash2,
  FiFileText,
  FiShield,
  FiPieChart,
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

/* ------------------ Helpers ------------------ */
export const truncateText = (text = '', max = 20) => {
  return text.length > max ? text.slice(0, max) + '…' : text;
};

const getInitials = (name = 'U') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// Dashboard Color Themes
const THEME = {
  directory: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: <FiFolder className="w-5 h-5 text-amber-500" />,
    border: 'border-amber-100',
    badge: 'bg-amber-100 text-amber-700',
  },
  file: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: <FiFileText className="w-5 h-5 text-blue-500" />,
    border: 'border-blue-100',
    badge: 'bg-blue-100 text-blue-700',
  },
};

/* ------------------ Sub-Components ------------------ */

// 1. Stats Card Component
const StatCard = ({ title, count, icon, colorClass }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
        {title}
      </p>
      <h4 className="text-2xl font-bold text-slate-800 mt-1">{count}</h4>
    </div>
    <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
  </div>
);

// 2. Avatar Stack Component
const AvatarStack = ({ users = [] }) => {
  const displayUsers = users.slice(0, 3);
  const remaining = users.length - 3;
  const classes = `h-8 w-8 rounded-full ring-2 ring-pink-200 bg-pink-400
      flex items-center justify-center
      text-[10px] leading-none font-bold text-white select-none`;
  return (
    <div className="flex -space-x-2 py-1">
      {displayUsers.map((u, i) => (
        <div key={i} title={u.name || u.email} className={classes}>
          {getInitials(u.name || 'User')}
        </div>
      ))}

      {remaining > 0 && <div className={classes}>+{remaining}</div>}
    </div>
  );
};

/* ------------------ Main Component ------------------ */
export default function SharedDirectoriesList() {
  const setSection = useSectionStore((s) => s.setSection);
  const queryClient = useQueryClient();

  const [manageItem, setManageItem] = useState(null);
  const [manageType, setManageType] = useState(null);
  const [confirmRevokeItem, setConfirmRevokeItem] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'directory', 'file'

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

  // Combine and Filter Data
  const filteredItems = useMemo(() => {
    const allDirs = directories.map((d) => ({ ...d, type: 'directory' }));
    const allFiles = files.map((f) => ({ ...f, type: 'file' }));
    const combined = [...allDirs, ...allFiles];

    if (filterType === 'all') return combined;
    return combined.filter((item) => item.type === filterType);
  }, [directories, files, filterType]);

  const isEmpty = filteredItems.length === 0;

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
        await revokeSharedFile(manageItem.fileId, confirmRevokeItem.sharedWith);
      }

      setManageItem((prev) => ({
        ...prev,
        sharedWith: prev.sharedWith.filter(
          (u) => u.sharedWith !== confirmRevokeItem.sharedWith
        ),
      }));

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
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  /* ------------------ Render ------------------ */
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-slate-50/50 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
            <Share2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Shared Dashboard
            </h1>
            <p className="text-slate-500 text-sm">
              Manage access and permissions
            </p>
          </div>
        </div>

        {/* Simple Filter Tabs */}
        <div className="bg-white p-1 rounded-lg border border-slate-200 flex shadow-sm">
          {['all', 'directory', 'file'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                filterType === tab
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() +
                tab.slice(1) +
                (tab === 'all' ? '' : 's')}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Shared"
          count={directories.length + files.length}
          icon={<FiPieChart className="w-6 h-6 text-indigo-600" />}
          colorClass="bg-indigo-100"
        />
        <StatCard
          title="Active Folders"
          count={directories.length}
          icon={<FolderOpen className="w-6 h-6 text-amber-600" />}
          colorClass="bg-amber-100"
        />
        <StatCard
          title="Shared Files"
          count={files.length}
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          colorClass="bg-blue-100"
        />
      </div>

      {/* Main Grid Content */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="bg-slate-50 p-4 rounded-full mb-4">
            <Filter className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            No items found
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Try changing the filter or share a new item.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const styles = THEME[item.type];
            return (
              <div
                key={item.type === 'directory' ? item.directoryId : item.fileId}
                className="group relative h-fit bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Card Top */}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-full ${styles.bg}`}>
                      {styles.icon}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${styles.badge}`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <h3
                    className="font-bold text-slate-800 text-base truncate mb-1"
                    title={item.name}
                  >
                    {shortenName(item.name, 15)}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    {item.type === 'file' && item.size
                      ? `${(item.size / 1024).toFixed(1)} KB`
                      : 'Folder Container'}
                  </p>
                </div>

                {/* Card Bottom: Avatars & Action */}
                <div className="pt-4 border-t border-slate-50 mt-auto">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-medium mb-1">
                        Access given to:
                      </span>
                      <AvatarStack users={item.sharedWith} />
                    </div>

                    <button
                      onClick={() => openManageModal(item, item.type)}
                      className="p-2 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Manage Access"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------ Manage Access Dialog ------------------ */}
      <Dialog
        open={!!manageItem}
        onOpenChange={(open) => !open && setManageItem(null)}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-xl">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  manageType === 'directory'
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {manageType === 'directory' ? <FiFolder /> : <FiFileText />}
              </div>
              <div>
                <DialogTitle className="text-lg text-slate-800">
                  {truncateText(manageItem?.name, 25)}
                </DialogTitle>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Manage permissions for this item
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[50vh] overflow-y-auto px-1 py-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              People with access
            </p>
            <div className="space-y-3">
              {manageItem?.sharedWith.map((user, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center group p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200 shadow-sm">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {user.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {user.email || user.sharedWith}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => initiateRevoke(user)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                    title="Revoke Access"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="border-t border-slate-100 pt-3">
            <button
              onClick={() => setManageItem(null)}
              className="text-sm font-medium text-slate-500 hover:text-slate-800 w-full text-center py-2 hover:bg-slate-50 rounded-lg transition"
            >
              Close Menu
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ------------------ Confirmation Dialog ------------------ */}
      <Dialog
        open={!!confirmRevokeItem}
        onOpenChange={(open) => !open && setConfirmRevokeItem(null)}
      >
        <DialogContent className="max-w-xs rounded-2xl bg-white">
          <div className="flex flex-col items-center text-center pt-4">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600">
              <FiShield size={24} />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-800">
              Revoke Access?
            </DialogTitle>
            <p className="text-slate-500 text-sm mt-2 mb-6 px-2">
              Are you sure you want to remove <br />
              <span className="font-bold text-slate-800">
                {confirmRevokeItem?.name}
              </span>{' '}
              from this item?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConfirmRevokeItem(null)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleRevokeConfirm}
              className="w-full px-4 py-2.5 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 shadow-lg shadow-rose-200 transition"
            >
              Revoke
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
