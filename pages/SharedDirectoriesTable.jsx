import { useEffect, useState } from 'react';
import { getAllSharedDirectories, revokeSharedDirectory } from '../API/share';
import { Users, Share2, ArrowRight } from 'lucide-react';
import { useSectionStore } from '@/store/sectionStore';

import {
  FiFolder,
  FiTrash2,
  FiShield,
  FiChevronDown,
  FiActivity,
} from 'react-icons/fi';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';

// --- Helper: Generate Initials ---
const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

// --- Helper: Modern Gradient mapping for avatars ---
const getAvatarStyle = (name) => {
  const styles = [
    'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-200',
    'bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-200',
    'bg-gradient-to-br from-pink-400 to-pink-600 shadow-pink-200',
    'bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-indigo-200',
    'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-200',
    'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-200',
  ];
  return styles[name.length % styles.length];
};

export default function SharedDirectoriesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const setSection = useSectionStore((s) => s.setSection);

  useEffect(() => setSection('shared'), []);
  async function fetchData() {
    try {
      const res = await getAllSharedDirectories();
      setData(res.directories || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load directories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // --- Loading State (Skeleton) ---
  if (loading) {
    return (
      <div className="grid gap-6 py-8">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-32 w-full  rounded-3xl animate-pulse border border-slate-200"
          />
        ))}
      </div>
    );
  }

  // --- Empty State ---
  if (data.length === 0) {
    return (
      <div className="relative w-full overflow-hidden  p-1 mt-6 ">
        {/* Inner White Container */}
        <div className="relative flex flex-col items-center justify-center  h-full rounded-[20px] py-16 px-6 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-64 h-64  -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/2 translate-y-1/2"></div>

          {/* Icon Interaction */}
          <div className="relative mb-8">
            <div className="absolute inset-0  rounded-full blur opacity-20 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-full shadow-xl border border-indigo-50 flex items-center justify-center">
              <Users className="w-10 h-10 text-pink-400" />

              {/* Floating Badge */}
              <div className="absolute -right-1 -top-1 bg-pink-400 text-white p-2 rounded-full shadow-lg rotate-12">
                <Share2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Typography */}
          <h3 className="text-2xl font-extrabold text-gray-900 mb-3 text-center tracking-tight">
            No Shared Folders Yet
          </h3>
          <p className="text-gray-500 text-center max-w-sm mb-8 leading-relaxed text-lg">
            Collaboration starts here. Share your first directory to begin
            working together with your team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent p-8 ">
      <h2 className="text-2xl font-bold text-slate-800 px-1">Shared Access</h2>

      {data.map((dir) => (
        <div
          key={dir.directoryId}
          className="group relative mt-3   bg-white rounded-lg transition-all duration-500 overflow-hidden"
        >
          {/* --- Card Header (Visible Always) --- */}
          <div className="relative p-6 z-10 bg-white flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-5">
              {/* Animated Icon */}
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100 shadow-inner group-hover:from-indigo-50 group-hover:to-white transition-colors duration-500">
                <FiFolder className="w-7 h-7 text-yellow-400  transition-colors duration-500" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                  <FiActivity className="w-3 h-3 text-emerald-500" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-pink-400 tracking-tight  transition-colors duration-300">
                  {dir.name}
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                  <span>
                    Shared with{' '}
                    <span className="font-semibold text-gray-700">
                      {dir.sharedWith.length}
                    </span>{' '}
                    members
                  </span>
                </p>
              </div>
            </div>

            {/* Right Side: Face Pile Summary & Indicator */}
            <div className="flex items-center gap-6">
              {/* Expand Icon */}
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors duration-300">
                <FiChevronDown className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:rotate-180 transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* --- Expandable Section (The "Magic" CSS Transition) --- */}
          {/* We use grid-rows transition to animate height from 0 to auto smoothly */}
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
            <div className="overflow-hidden">
              <div className="p-6 pt-0 bg-white">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4 opacity-50" />

                <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                  {dir.sharedWith.map((userObj, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 group/row"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full  flex bg-rose-50 items-center justify-center text-rose-600 text-sm font-bold`}
                        >
                          {getInitials(userObj.name)}
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold text-slate-800">
                            {userObj.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {userObj.sharedWith}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Role Badge */}
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[8px]  uppercase tracking-wider border ${
                            userObj.accessType === 'editor'
                              ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100'
                              : 'bg-blue-50/50 text-blue-600 border-blue-100'
                          }`}
                        >
                          <FiShield className="w-3 h-3" />
                          {userObj.accessType}
                        </div>

                        {/* Revoke Button (Appears on Row Hover) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering other clicks
                            setSelectedDirectory(dir);
                            setDeletePopupOpen(true);
                            setSelectedUser(userObj);
                          }}
                          className="opacity-100  p-2 bg-rose-50 text-rose-600 rounded-full hover:bg-rose-100 transition-all duration-200"
                          title="Revoke Access"
                        >
                          <FiTrash2 className=" w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* --- Revoke Dialog --- */}
      <Dialog open={deletePopupOpen} onOpenChange={setDeletePopupOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-2xl gap-0">
          <DialogHeader className="p-6 pb-2">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4">
              <FiTrash2 className="w-6 h-6 text-rose-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-800">
              Revoke Access
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-2">
            <p className="text-slate-500 text-sm leading-relaxed">
              Are you sure you want to remove{' '}
              <span className="font-bold text-slate-800">
                {selectedUser?.name}
              </span>{' '}
              from
              <span className="font-bold text-slate-800">
                {' '}
                {selectedDirectory?.name}
              </span>
              ? They will lose all access immediately.
            </p>
          </div>

          <DialogFooter className="bg-slate-50/50 p-6 gap-3 mt-4">
            <button
              onClick={() => setDeletePopupOpen(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await revokeSharedDirectory(
                    selectedDirectory.directoryId,
                    selectedUser.sharedWith
                  );
                  toast.success('Access revoked successfully');
                  await fetchData();
                  setDeletePopupOpen(false);
                } catch (e) {
                  toast.error('Could not revoke access');
                }
              }}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all"
            >
              Yes, Revoke
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
