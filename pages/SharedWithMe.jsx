import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShare2,
  FiRefreshCw,
  FiInbox,
  FiSearch,
  FiFolder,
  FiFileText,
  FiGrid,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useSectionStore } from '@/store/sectionStore';

import {
  deleteFile,
  getSharedDirectories,
  getSharedFiles,
  renameSharedFile,
} from '../API/share';

// Assuming these exist as per your previous code
import SharedFileCard from '../components/shared/SharedFileCard';
import SharedDirectoryCard from '../components/shared/SharedDirectoryCard';

/* --- Sub-Component: Stat Card --- */
const DashboardStat = ({ title, count, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
  >
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{count}</h3>
    </div>
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>{icon}</div>
  </motion.div>
);

/* --- Main Component --- */
const SharedWithMe = () => {
  const setSection = useSectionStore((s) => s.setSection);

  // Data State
  const [files, setFiles] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dashboard UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'folders', 'files'

  useEffect(() => setSection('inbox'), []);

  // Fetch Data
  const fetchSharedData = async () => {
    setLoading(true);
    try {
      const [filesRes, DirRes] = await Promise.all([
        getSharedFiles(),
        getSharedDirectories(),
      ]);
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
    setFiles((prev) => prev.filter((f) => f._id !== id));
    const toastId = toast.loading('Deleting...');
    try {
      const res = await deleteFile(id);
      if (!res.ok) throw new Error(res.error || 'Failed to delete');
      toast.success('File removed', { id: toastId });
    } catch (error) {
      setFiles(oldFiles);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleRename = async (id, newName) => {
    const oldFiles = [...files];
    setFiles((prev) =>
      prev.map((f) => (f._id === id ? { ...f, name: newName } : f))
    );
    const toastId = toast.loading('Renaming...');
    try {
      const res = await renameSharedFile(id, newName);
      if (!res.ok) throw new Error(res.error || 'Rename failed');
      toast.success('Renamed successfully', { id: toastId });
    } catch (error) {
      setFiles(oldFiles);
      toast.error(error.message, { id: toastId });
    }
  };

  // Filter Logic
  const filteredData = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();

    const filteredDirs = directories.filter((d) =>
      d.name.toLowerCase().includes(lowerQuery)
    );
    const filteredFiles = files.filter((f) =>
      f.name.toLowerCase().includes(lowerQuery)
    );

    return { filteredDirs, filteredFiles };
  }, [searchQuery, directories, files]);

  const isEmpty =
    filteredData.filteredDirs.length === 0 &&
    filteredData.filteredFiles.length === 0;

  return (
    <div className="min-h-screen bg-slate-50/50 w-full text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 text-white">
              <FiShare2 size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Shared With Me
              </h1>
              <p className="text-slate-500 text-sm">
                Review files and folders shared by your team.
              </p>
            </div>
          </div>

          <button
            onClick={fetchSharedData}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-all text-sm font-medium shadow-sm group"
          >
            <FiRefreshCw
              className={`transition-transform duration-700 ${
                loading ? 'animate-spin' : 'group-hover:rotate-180'
              }`}
            />
            Sync
          </button>
        </div>

        {/* --- STATS ROW --- */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <DashboardStat
              title="Total Items"
              count={files.length + directories.length}
              icon={<FiGrid className="w-6 h-6 text-purple-600" />}
              color="bg-purple-100"
            />
            <DashboardStat
              title="Shared Folders"
              count={directories.length}
              icon={<FiFolder className="w-6 h-6 text-amber-600" />}
              color="bg-amber-100"
            />
            <DashboardStat
              title="Shared Files"
              count={files.length}
              icon={<FiFileText className="w-6 h-6 text-blue-600" />}
              color="bg-blue-100"
            />
          </div>
        )}

        {/* --- TOOLBAR (Search & Tabs) --- */}
        <div className="sticky top-2 z-20 bg-white/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-2 justify-between items-center">
          {/* Tabs */}
          <div className="flex bg-slate-100/50 p-1 rounded-lg w-full sm:w-auto">
            {['all', 'folders', 'files'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 rounded-lg text-sm transition-all outline-none"
            />
          </div>
        </div>

        {/* --- CONTENT GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white h-56 rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col justify-between"
              >
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg" />
                  <div className="w-8 h-8 bg-slate-100 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="w-3/4 h-4 bg-slate-100 rounded" />
                  <div className="w-1/2 h-3 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FiInbox size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              No items found
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "You don't have any shared items in this category yet."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {/* Directories Section */}
              {['all', 'folders'].includes(activeTab) &&
                filteredData.filteredDirs.map((dir) => (
                  <motion.div
                    key={`dir-${dir._id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SharedDirectoryCard directory={dir} />
                  </motion.div>
                ))}

              {/* Files Section */}
              {['all', 'files'].includes(activeTab) &&
                filteredData.filteredFiles.map((file) => (
                  <motion.div
                    key={`file-${file._id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
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
