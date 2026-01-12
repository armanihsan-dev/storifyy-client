import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchShareableUsers } from '../API/userAPI';
import toast from 'react-hot-toast';
import {
  FiX,
  FiCheck,
  FiSearch,
  FiEye,
  FiEdit3,
  FiShare2,
  FiUsers,
  FiMail,
} from 'react-icons/fi';

// --- Helper Components ---

const AccessCard = ({ active, icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className={`
      relative w-full flex flex-col items-center md:items-start text-center md:text-left gap-2 md:gap-3 p-3 rounded-xl border transition-all duration-200 outline-none
      ${
        active
          ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 bg-white'
      }
    `}
  >
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-full shrink-0 ${
          active ? 'bg-rose-200 text-rose-700' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {icon}
      </div>
      <p className="text-sm font-bold leading-none mb-1">{title}</p>
    </div>
    <div className="min-w-0">
      <p
        className={`text-[11px] truncate ${
          active ? 'text-rose-700/80' : 'text-slate-400'
        }`}
      >
        {desc}
      </p>
    </div>
    {active && (
      <div className="absolute top-3 right-3 text-rose-500 md:block hidden">
        <FiCheck size={14} />
      </div>
    )}
  </button>
);

const SharePopup = ({ isOpen, onClose, fileId, BASE_URL }) => {
  const [email, setEmail] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]); // Array of objects
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('viewer');
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['shareable-users', email],
    queryFn: fetchShareableUsers,
    enabled: isOpen,
    keepPreviousData: true,
  });

  // --- Logic ---

  const handleAddEmail = () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error('Invalid email address');
      return;
    }
    if (selectedUsers.some((u) => u.email === trimmed)) {
      toast.error('User already added');
      return;
    }
    // Add guest
    const newUser = {
      _id: `guest-${Date.now()}`,
      email: trimmed,
      name: trimmed.split('@')[0],
      type: 'email',
    };
    setSelectedUsers([...selectedUsers, newUser]);
    setEmail('');
  };

  const toggleUser = (user) => {
    const exists = selectedUsers.find((u) => u.email === user.email);
    if (exists) {
      setSelectedUsers(selectedUsers.filter((u) => u.email !== user.email));
    } else {
      setSelectedUsers([...selectedUsers, { ...user, type: 'user' }]);
    }
  };

  const handleShare = async () => {
    if (selectedUsers.length === 0) return;
    setLoading(true);

    try {
      const promises = selectedUsers.map((user) =>
        fetch(`${BASE_URL}/share/${user.email}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileid: fileId, role }),
          credentials: 'include',
        }).then(async (res) => {
          if (!res.ok) throw new Error(await res.text());
          return res;
        })
      );

      await Promise.all(promises);
      toast.success(`Shared with ${selectedUsers.length} people`);
      onClose();
      setSelectedUsers([]);
      setRole('viewer');
    } catch (err) {
      console.error(err);
      toast.error('Some invitations failed to send');
    } finally {
      setLoading(false);
    }
  };

  // Determine what list to show:
  // 1. If searching -> Show API results
  // 2. If NOT searching -> Show Selected Users (Staging)
  // 3. Merge them if needed, but for simplicity:
  //    - If `email` has text, we show `users` (filtered by API).
  //    - If `email` is empty, we show `selectedUsers`.
  const isSearching = email.trim().length > 0;
  const displayList = isSearching ? users : selectedUsers;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 md:p-2 m-3">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!loading ? onClose : undefined}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-all"
          />

          {/* Dialog Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="
              relative w-full md:w-[95vw] sm:max-w-[750px] 
              h-[100vh] md:h-auto md:max-h-[85vh] 
              bg-white md:rounded-2xl shadow-2xl overflow-hidden z-10 
              flex flex-col
            "
          >
            {/* ───────── HEADER ───────── */}
            <div className="p-4 md:p-6 border-b bg-white shrink-0 flex items-center justify-between">
              <div className="flex flex-row items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
                  <FiUsers size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold truncate text-slate-800">
                    Share File
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 truncate">
                    Invite users and set permissions
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-slate-100 rounded-full text-slate-500"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* ───────── BODY (Responsive Flex) ───────── */}
            <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
              {/* LEFT — Search & User List */}
              <div className="w-full md:w-[65%] border-b md:border-b-0 md:border-r px-4 md:px-6 py-4 md:py-5 flex flex-col bg-white h-full relative">
                {/* Search Input */}
                <div className="relative mb-4 shrink-0">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={inputRef}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' ? handleAddEmail() : null
                    }
                    placeholder="Search users or type email..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                </div>

                {/* List Header */}
                <div className="flex items-center justify-between mb-2 shrink-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isSearching
                      ? 'Search Results'
                      : `Selected (${selectedUsers.length})`}
                  </span>
                  {!isSearching && selectedUsers.length > 0 && (
                    <button
                      onClick={() => setSelectedUsers([])}
                      className="text-xs text-rose-500 flex items-center gap-1 hover:underline"
                    >
                      Clear all <FiX size={12} />
                    </button>
                  )}
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                  {usersLoading && isSearching ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                      <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-sm">Finding users...</p>
                    </div>
                  ) : displayList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400 opacity-80 text-center">
                      {isSearching ? (
                        <div
                          onClick={handleAddEmail}
                          className="cursor-pointer group"
                        >
                          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                            <FiMail size={20} />
                          </div>
                          <p className="text-sm font-medium text-slate-600">
                            Invite{' '}
                            <span className="text-rose-600">{email}</span>
                          </p>
                          <p className="text-xs">Click to add via email</p>
                        </div>
                      ) : (
                        <>
                          <FiUsers size={32} className="mb-2 opacity-20" />
                          <p className="text-sm">No users selected yet.</p>
                          <p className="text-xs mt-1">
                            Search above to add people.
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    displayList.map((user) => {
                      const isSelected = selectedUsers.some(
                        (u) => u.email === user.email
                      );
                      return (
                        <div
                          key={user._id || user.email}
                          onClick={() => toggleUser(user)}
                          className={`
                            flex items-center justify-between p-2 rounded-2xl border cursor-pointer transition-all select-none
                            ${
                              isSelected
                                ? 'bg-rose-50 border-rose-400'
                                : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {user.picture ? (
                              <img
                                src={user.picture}
                                alt={user.name}
                                className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover shrink-0 bg-slate-200"
                              />
                            ) : (
                              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600 flex items-center justify-center font-bold shrink-0 text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate text-slate-700">
                                {user.name}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="bg-rose-500 text-white p-1 rounded-full ml-2 shrink-0 shadow-sm animate-in zoom-in duration-200">
                              <FiCheck size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT — Access Selection */}
              <div className="w-full md:w-[35%] px-4 md:px-6 py-4 md:py-5 flex flex-col bg-slate-50/50 md:bg-white shrink-0">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Permission
                  </span>

                  <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                    <AccessCard
                      active={role === 'viewer'}
                      icon={<FiEye size={18} />}
                      title="Viewer"
                      desc="Read-only access"
                      onClick={() => setRole('viewer')}
                    />

                    <AccessCard
                      active={role === 'editor'}
                      icon={<FiEdit3 size={18} />}
                      title="Editor"
                      desc="Can edit file"
                      onClick={() => setRole('editor')}
                    />
                  </div>

                  {/* Mobile Summary (only visible on small screens to fill space) */}
                  <div className="md:hidden mt-4 p-3 bg-white rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 text-center">
                      Sharing with{' '}
                      <strong className="text-rose-600">
                        {selectedUsers.length}
                      </strong>{' '}
                      users
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ───────── FOOTER ───────── */}
            <div className="p-4 md:p-6 pt-4 bg-slate-50 border-t flex  sm:justify-between gap-3 shrink-0">
              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-xl px-6 py-3 border border-slate-300 text-slate-600 font-semibold hover:bg-white transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={selectedUsers.length === 0 || loading}
                className={`
                  rounded-xl px-6 py-3 font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all w-full sm:w-auto
                  ${
                    selectedUsers.length === 0 || loading
                      ? 'bg-slate-300 shadow-none cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-700 active:scale-95'
                  }
                `}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiShare2 size={18} />
                    <span>Share File</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SharePopup;
