import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion'; // For animations
import {
  FolderOpen,
  File,
  ChevronRight,
  LayoutGrid,
  DownloadCloud,
  ArrowLeft,
} from 'lucide-react'; // Icons
import { getSharedDirectory } from '../API/share';
import SharedDirectoryCard from '../components/shared/SharedDirectoryCard';
import SharedFileCard from '../components/shared/SharedFileCard';

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const SharedDirectoryView = () => {
  const { id } = useParams();
  const [current, setCurrent] = useState(null);
  const [childDirs, setChildDirs] = useState([]);
  const [childFiles, setChildFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSharedDirectory(id);
      setCurrent(data.directory);
      setChildDirs(data.childDirs || []);
      setChildFiles(data.childFiles || []);
    } catch (error) {
      console.error('Failed to load directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // --- 1. Modern Skeleton Loader ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="h-8 w-1/3 bg-slate-200 rounded-lg animate-pulse" />
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = childDirs.length === 0 && childFiles.length === 0;

  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
      {/* Background Decoration (Subtle Gradients) */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent -z-10 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-10 sm:px-10">
        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4"
        >
          <div>
            <div className="flex items-center text-sm text-slate-500 font-medium mb-1">
              <span className="flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer">
                <DownloadCloud size={16} /> Shared Storage
              </span>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {current?.name || 'Unknown Folder'}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              {current?.name}
            </h2>
          </div>

          {/* Action / Stats Bar */}
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <FolderOpen size={16} className="text-indigo-500" />
                <span className="font-semibold text-slate-800">
                  {childDirs.length}
                </span>{' '}
                Folders
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <File size={16} className="text-blue-500" />
                <span className="font-semibold text-slate-800">
                  {childFiles.length}
                </span>{' '}
                Files
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Empty State --- */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FolderOpen size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">
              This folder is empty
            </h3>
            <p className="text-slate-500 max-w-xs mt-1">
              There are no shared files or directories currently available in
              this location.
            </p>
          </motion.div>
        )}

        {/* --- Content Grid --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {/* Directories */}
          {childDirs.map((dir) => (
            <motion.div key={dir._id} variants={itemVariants} layout>
              <div className="group relative h-full">
                {/* Hover Effect Layer */}
                <div className="absolute -inset-0.5  rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
                <div className="relative h-full transition-all duration-300 p-1">
                  <SharedDirectoryCard directory={dir} />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Files */}
          {childFiles.map((file) => (
            <motion.div key={file._id} variants={itemVariants} layout>
              <div className="group relative h-full">
                <div className="absolute -inset-0.5  opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
                <div className="relative h-full  transition-all duration-300 p-1">
                  <SharedFileCard file={file} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SharedDirectoryView;
