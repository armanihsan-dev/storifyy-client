import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchShareableUsers } from '../API/userAPI';
import toast from 'react-hot-toast';
import {
  FiX,
  FiMail,
  FiSend,
  FiCheck,
  FiChevronDown,
  FiShield,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi';

// --- Components ---

const Avatar = ({ src, name, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover ring-2 ring-white shadow-sm`}
      />
    );
  }
  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600 flex items-center justify-center font-bold ring-2 ring-white shadow-sm`}
    >
      {name?.charAt(0).toUpperCase()}
    </div>
  );
};

const RoleSelector = ({ value, onChange, disabled }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-rose-500">
      <FiShield />
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="appearance-none bg-rose-50 hover:bg-rose-100/80 border border-rose-100 text-rose-700 font-semibold text-sm rounded-xl py-2.5 pl-9 pr-8 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer transition-colors"
    >
      <option value="viewer">Viewer</option>
      <option value="editor">Editor</option>
    </select>
    <FiChevronDown
      className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none"
      size={14}
    />
  </div>
);

const SharePopup = ({ isOpen, onClose, fileId, BASE_URL }) => {
  const [email, setEmail] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]); // Array of objects { email, name, picture }
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('viewer');
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current)
      setTimeout(() => inputRef.current.focus(), 100);
  }, [isOpen]);

  // Fetch users based on input
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['shareable-users', email],
    queryFn: fetchShareableUsers,
    enabled: isOpen && email.length > 0,
    keepPreviousData: true,
  });

  // --- Logic ---

  const handleAddEmail = () => {
    const trimmed = email.trim();
    if (!trimmed) return;

    // Basic validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error('Invalid email address');
      return;
    }

    if (selectedUsers.some((u) => u.email === trimmed)) {
      toast.error('User already added');
      setEmail('');
      return;
    }

    // Add as a "Guest" user object
    setSelectedUsers([
      ...selectedUsers,
      { email: trimmed, name: trimmed.split('@')[0], type: 'email' },
    ]);
    setEmail('');
  };

  const handleAddUser = (user) => {
    if (selectedUsers.some((u) => u.email === user.email)) return;
    setSelectedUsers([...selectedUsers, { ...user, type: 'user' }]);
    setEmail(''); // Clear search
    inputRef.current?.focus();
  };

  const removeUser = (emailToRemove) => {
    setSelectedUsers(selectedUsers.filter((u) => u.email !== emailToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleShare = async () => {
    if (selectedUsers.length === 0) return;
    setLoading(true);

    console.log({ selectedUsers });
    try {
      // Process all users
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

      toast.custom(
        <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 font-medium animate-in slide-in-from-top-5">
          <FiCheck size={18} /> Shared with {selectedUsers.length} people
        </div>
      );

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

  // --- Render Helpers ---

  // Is the search input showing results?
  const showResults = email.length > 0 && (users.length > 0 || usersLoading);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!loading ? onClose : undefined}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-all"
          />

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 pb-2 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Share File</h2>
                <p className="text-sm text-slate-500">
                  Invite team members to collaborate
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Input Section */}
              <div className="relative z-20">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-500 transition-colors">
                    {usersLoading ? (
                      <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiSearch size={18} />
                    )}
                  </div>
                  <input
                    ref={inputRef}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm"
                  />
                  {email && (
                    <button
                      onClick={() => setEmail('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                </div>

                {/* Dropdown Results (Absolute) */}
                <AnimatePresence>
                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden max-h-60 overflow-y-auto z-50 divide-y divide-slate-50"
                    >
                      {users.map((user) => {
                        const isSelected = selectedUsers.some(
                          (u) => u.email === user.email
                        );
                        return (
                          <button
                            key={user._id}
                            onClick={() => handleAddUser(user)}
                            disabled={isSelected}
                            className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                              isSelected
                                ? 'opacity-50 cursor-not-allowed bg-slate-50'
                                : 'hover:bg-rose-50'
                            }`}
                          >
                            <Avatar
                              src={user.picture}
                              name={user.name}
                              size="sm"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-700 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {user.email}
                              </p>
                            </div>
                            {isSelected && (
                              <FiCheck className="text-rose-500" />
                            )}
                          </button>
                        );
                      })}
                      {users.length === 0 && !usersLoading && (
                        <div
                          onClick={handleAddEmail}
                          className="p-3 text-center cursor-pointer hover:bg-slate-50"
                        >
                          <p className="text-sm text-slate-600">
                            Invite{' '}
                            <span className="font-semibold text-rose-500">
                              {email}
                            </span>{' '}
                            via email
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Staged Users List (Pending Invites) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Pending Invites ({selectedUsers.length})
                  </p>
                  {selectedUsers.length > 0 && (
                    <button
                      onClick={() => setSelectedUsers([])}
                      className="text-xs text-rose-500 font-medium hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-2 min-h-[100px]">
                  <AnimatePresence mode="popLayout">
                    {selectedUsers.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-8 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200"
                      >
                        <FiMail size={24} className="mb-2 opacity-20" />
                        <p className="text-sm">
                          Search or type emails to invite people
                        </p>
                      </motion.div>
                    ) : (
                      selectedUsers.map((user) => (
                        <motion.div
                          layout
                          key={user.email}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group flex items-center justify-between p-2 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-rose-100 transition-all"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <Avatar src={user.picture} name={user.name} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-700 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeUser(user.email)}
                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                <RoleSelector
                  value={role}
                  onChange={setRole}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-medium text-slate-500 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  disabled={selectedUsers.length === 0 || loading}
                  className={`
                    flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white shadow-lg shadow-rose-500/30 transition-all
                    ${
                      selectedUsers.length === 0 || loading
                        ? 'bg-slate-300 shadow-none cursor-not-allowed'
                        : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 active:scale-95'
                    }
                  `}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <FiSend size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SharePopup;
