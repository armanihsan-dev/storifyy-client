import { useEffect, useState } from 'react';
import { getAllSharedDirectories, revokeSharedDirectory } from '../API/share'; // Keep your API import
import {
  FiFolder,
  FiUsers,
  FiMoreHorizontal,
  FiTrash2,
  FiEdit2,
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

// --- Helper: Generate Initials for Avatars ---
const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

// --- Helper: Color mapping for avatars based on name length (consistent randomish colors) ---
const getAvatarColor = (name) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
  ];
  return colors[name.length % colors.length];
};

export default function SharedDirectoriesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedDirectory, setSelectedDirectory] = useState(null);

  async function fetchData() {
    try {
      const res = await getAllSharedDirectories();
      setData(res.directories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-pulse">
        <div className="h-40 w-full bg-slate-100 rounded-2xl"></div>
        <div className="h-40 w-full bg-slate-100 rounded-2xl"></div>
      </div>
    );
  }

  // --- Empty State ---
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 mt-6">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <FiUsers className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">
          No Shared Directories
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">
          You haven't shared any folders yet. Start collaborating by sharing a
          directory!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8 ">
      {data.map((dir) => (
        <div
          key={dir.directoryId}
          className="group bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300 hover:border-indigo-100 hover:shadow-xl"
        >
          {/* --- Card Header --- */}
          <div className="bg-gradient-to-r from-slate-50 to-white p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Folder Icon Box */}
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl shadow-inner">
                <FiFolder className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                  {dir.name}
                </h2>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
                  <FiUsers className="w-3.5 h-3.5" />
                  <span>Shared with {dir.sharedWith.length} members</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Shared Users List --- */}
          <div className="p-2">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar px-2 py-2 space-y-1">
              {dir.sharedWith.map((userObj, index) => (
                <div
                  key={index}
                  className="group/row flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200"
                >
                  {/* Left: User Profile */}
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 ${getAvatarColor(
                        userObj.name
                      )} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0`}
                    >
                      {getInitials(userObj.name)}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">
                        {userObj.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {userObj.sharedWith}
                      </span>
                    </div>
                  </div>

                  {/* Right: Badge & Actions */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-12 sm:pl-0">
                    {/* Access Badge */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                        userObj.accessType === 'editor'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      <FiShield className="w-3 h-3" />
                      {userObj.accessType}
                    </div>

                    {/* Action Buttons (Visible on Hover) */}
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/row:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => {
                          setSelectedDirectory(dir);
                          setDeletePopupOpen(true);
                          setSelectedUser(userObj);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Revoke Directory"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Visual (Optional) */}
          <div className="bg-slate-50 h-2 w-full border-t border-slate-100"></div>
        </div>
      ))}
      <Dialog open={deletePopupOpen} onOpenChange={setDeletePopupOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-800">
              Revoke Shared Directory?
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-slate-600 mt-2">
            Are you sure you want to revoke access for directory:
            <span className="font-semibold text-slate-800">
              {selectedDirectory?.name}
            </span>
            ?
          </p>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setDeletePopupOpen(false)}
              className="px-4 py-2 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                console.log('Revoke directory:', selectedDirectory);
                console.log('selected user', selectedUser);
                // TODO: Add your revoke API call here
                await revokeSharedDirectory(
                  selectedDirectory.directoryId,
                  selectedUser.sharedWith
                );
                toast.success('Directory revocked');
                await fetchData();
                setDeletePopupOpen(false);
              }}
              className="px-4 py-2 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
            >
              Revoke
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
