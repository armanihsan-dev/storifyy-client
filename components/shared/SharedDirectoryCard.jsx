import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  Trash2,
  X,
  Clock,
  Shield,
  AlertTriangle,
  Edit2, // New Icon for Rename
  FileEdit, // New Icon for Modal
  Save, // New Icon for Save button
} from 'lucide-react';
import { deletesharedirectory, renameSharedDirectory } from '../../API/share'; // Assuming this exists
import toast from 'react-hot-toast';
// import { renameSharedDirectory } from '../../API/share'; // You would import your rename API here

const SharedDirectoryCard = ({ directory, onDelete }) => {
  const navigate = useNavigate();

  // State for Delete
  const [confirmOpen, setConfirmOpen] = useState(false);

  // State for Rename
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState(directory.name);
  const [isRenaming, setIsRenaming] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  // Map roles to colors
  const roleColors = {
    editor: 'bg-indigo-100 text-indigo-600',
    viewer: 'bg-emerald-100 text-emerald-600',
    admin: 'bg-purple-100 text-purple-600',
    default: 'bg-slate-100 text-slate-600',
  };

  const roleClass =
    roleColors[directory.sharedRole?.toLowerCase()] || roleColors.default;

  return (
    <>
      {/* --- MAIN CARD --- */}
      <motion.div
        layout
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/shared/directories/${directory._id}`)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="group relative w-full h-46 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
      >
        {/* Hover Actions (bottom Right) */}
        {directory.sharedRole === 'editor' && (
          <div className="absolute bottom-5 right-4 z-20 flex gap-2">
            {/* RENAME BUTTON */}
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
              transition={{ delay: 0.05 }} // Slight stagger
              onClick={(e) => {
                e.stopPropagation();
                setNewName(directory.name); // Reset name on open
                setRenameOpen(true);
              }}
              className="p-2 rounded-full cursor-pointer bg-white/90 backdrop-blur-sm text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 border border-slate-200 shadow-sm transition-colors"
              title="Rename Folder"
            >
              <Edit2 size={18} />
            </motion.button>

            {/* DELETE BUTTON */}
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              className="p-2 rounded-full cursor-pointer bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 shadow-sm transition-colors"
              title="Delete Folder"
            >
              <Trash2 size={18} />
            </motion.button>
          </div>
        )}

        {/* Card Content */}
        <div className="p-6 flex flex-col relative z-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="w-14 h-14 flex items-center bg-amber-50 rounded-full justify-center">
              <Folder className="text-amber-500 fill-amber-500/20" size={28} />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight truncate mb-1">
                {directory.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock size={12} />
                {new Date(directory.sharedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${roleClass}`}
            >
              <Shield size={10} />
              {directory.sharedRole || 'Viewer'}
            </span>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none transition-all group-hover:bg-rose-500/10" />
      </motion.div>

      {/* --- RENAME POPUP --- */}
      <AnimatePresence>
        {renameOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRenameOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileEdit className="text-indigo-500" size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Rename Directory
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Enter a new name for your shared folder.
                  </p>
                </div>

                {/* Input Field */}
                <div className="mb-6">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium  placeholder:text-slate-400"
                    placeholder="Folder Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setRenameOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      const isRenamed = await renameSharedDirectory(
                        directory._id,
                        newName
                      );
                      if (isRenamed) {
                        setRenameOpen(false);
                        window.location.reload();
                        toast.success('Directory Renamed.');
                      }
                    }}
                    disabled={isRenaming || !newName.trim()}
                    className="px-4 py-2.5 rounded-xl bg-pink-400 text-white font-medium  shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isRenaming ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save size={18} /> Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE POPUP (Existing) --- */}
      <AnimatePresence>
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-500" size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  Delete Directory?
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  You are about to permanently remove{' '}
                  <strong className="text-slate-800">{directory.name}</strong>.
                  This action cannot be undone.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConfirmOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await deletesharedirectory(directory._id);
                      setConfirmOpen(false);
                      window.location.reload();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
              <button
                onClick={() => setConfirmOpen(false)}
                className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SharedDirectoryCard;
