import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalPortal from '../../components/ModalPortal';
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
import { truncateText } from '../../pages/SharedDirectoriesList';
// import { renameSharedDirectory } from '../../API/share'; // You would import your rename API here

const SharedDirectoryCard = ({ directory, onDelete }) => {
  const navigate = useNavigate();
  console.log(directory);

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
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="group relative w-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {/* Hover Actions */}
        {directory.sharedRole === 'editor' && (
          <div className="absolute bottom-4 right-4 z-20 flex gap-2">
            {/* Rename */}
            <motion.button
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -6 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => {
                e.stopPropagation();
                setNewName(directory.name);
                setRenameOpen(true);
              }}
              className="p-2 rounded-full bg-white/80 backdrop-blur text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 shadow-sm transition-colors"
            >
              <Edit2 size={17} />
            </motion.button>

            {/* Delete */}
            <motion.button
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -6 }}
              transition={{ duration: 0.15, delay: 0.05 }}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              className="p-2 rounded-full bg-white/80 backdrop-blur text-slate-500 hover:text-red-500 hover:bg-red-50 border border-slate-200 shadow-sm transition-colors"
            >
              <Trash2 size={17} />
            </motion.button>
          </div>
        )}

        {/* Card Body */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            {/* Icon */}
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-amber-50 border border-amber-200/40">
              <Folder className="text-amber-500" size={28} />
            </div>

            {/* Title */}
            <div className="flex flex-col flex-grow">
              <h3 className="text-[1.05rem] font-semibold text-slate-800 truncate">
                {truncateText(directory.name, 9)}
              </h3>
              {directory.sharedAt ? (
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Clock size={12} />
                  {new Date(directory.sharedAt).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Clock size={12} />
                  {new Date(directory.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Role Badge */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${roleClass}`}
            >
              <Shield size={10} />
              {directory.sharedRole || 'Viewer'}
            </span>
          </div>
        </div>

        {/* Soft Background Glow */}
        <div className="absolute -right-12 -bottom-12 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-all duration-300" />
      </motion.div>

      {/* --- RENAME POPUP --- */}
      <AnimatePresence>
        {renameOpen && (
          <ModalPortal>
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
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* --- DELETE POPUP (Existing) --- */}
      <AnimatePresence>
        {confirmOpen && (
         <ModalPortal>
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
         </ModalPortal>
        )}
      </AnimatePresence>
    </>
  );
};

export default SharedDirectoryCard;
