import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiRefreshCw, FiInbox } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  deleteFile,
  getSharedDirectories,
  getSharedFiles,
  renameSharedFile,
} from '../API/share';

// Assuming you have your card component here.
// If not, make sure this component has a nice shadow and rounded corners!
import SharedFileCard from '../components/shared/SharedFileCard';
import SharedDirectoryCard from '../components/shared/SharedDirectoryCard';

const SharedWithMe = () => {
  const [files, setFiles] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  const fetchSharedData = async () => {
    setLoading(true);
    try {
      const [filesRes, DirRes] = await Promise.all([
        getSharedFiles(),
        getSharedDirectories(),
      ]);
      // Optional: artificial delay for smoother UI animations
      await new Promise((res) => setTimeout(res, 600));
      setFiles(filesRes || []);
      setDirectories(DirRes?.directories || []);
    } catch (err) {
      console.error('Error loading shared data:', err);
      toast.error("Couldn't load shared items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedData();
  }, []);

  // Handlers
  const handleDelete = async (id) => {
    const oldFiles = [...files];
    // Optimistic UI update: Remove immediately from screen
    setFiles((prev) => prev.filter((f) => f._id !== id));

    const toastId = toast.loading('Deleting...');

    try {
      const res = await deleteFile(id);
      if (!res.ok) {
        throw new Error(res.error || 'Failed to delete');
      }
      toast.success('File removed successfully', { id: toastId });
    } catch (error) {
      setFiles(oldFiles); // Rollback
      toast.error(error.message, { id: toastId });
    }
  };

  const handleRename = async (id, newName) => {
    const oldFiles = [...files];
    // Optimistic UI
    setFiles((prev) =>
      prev.map((f) => (f._id === id ? { ...f, name: newName } : f))
    );

    const toastId = toast.loading('Renaming...');

    try {
      const res = await renameSharedFile(id, newName);
      if (!res.ok) throw new Error(res.error || 'Rename failed');
      toast.success('Renamed successfully', { id: toastId });
    } catch (error) {
      setFiles(oldFiles); // Rollback
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className="relative h-screen w-full bg-[#F3F4F6] overflow-hidden text-slate-800">
      {/* --- BACKGROUND AMBIANCE (Glow Blobs) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-rose-200/40 rounded-full blur-[100px] opacity-70" />
        <div className="absolute  bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[100px] opacity-70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* --- HEADER SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-rose-500">
                <FiShare2 size={24} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                Shared With Me
              </h2>
            </div>
            <p className="text-slate-500 text-sm ml-1">
              Manage files that colleagues have shared with you.
            </p>
          </div>

          <button
            onClick={fetchSharedData}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl shadow-sm border border-slate-100 transition-all active:scale-95 font-medium text-sm group"
          >
            <FiRefreshCw
              className={`group-hover:rotate-180 transition-transform duration-500 ${
                loading ? 'animate-spin' : ''
              }`}
            />
            <span>Refresh</span>
          </button>
        </motion.div>

        {/* --- CONTENT AREA --- */}

        {loading ? (
          // 1. LOADING SKELETONS
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white/60 backdrop-blur-md h-[240px] rounded-2xl p-6 border border-white/50 shadow-sm animate-pulse"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 bg-slate-200/70 rounded-lg" />
                  <div className="w-12 h-4 bg-slate-200/70 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="w-3/4 h-6 bg-slate-200/70 rounded-md" />
                  <div className="w-1/2 h-4 bg-slate-200/70 rounded-md" />
                </div>
                <div className="mt-8 w-full h-8 bg-slate-200/70 rounded-lg" />
              </div>
            ))}
          </div>
        ) : files.length === 0 && directories.length === 0 ? (
          // 2. EMPTY STATE
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 text-rose-100">
              <FiInbox size={48} className="text-rose-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No shared files yet
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              When someone shares a file with you, it will appear here
              automatically.
            </p>
          </motion.div>
        ) : (
          // 3. FILE GRID
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {/* Directories first */}
              {directories.map((dir) => (
                <motion.div
                  key={dir._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <SharedDirectoryCard directory={dir} />
                </motion.div>
              ))}

              {/* Files after directories */}
              {files.map((file) => (
                <motion.div
                  key={file._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <SharedFileCard
                    file={file}
                    onDelete={handleDelete}
                    onRename={handleRename}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SharedWithMe;
