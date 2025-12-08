import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiX,
  FiMail,
  FiSend,
  FiUsers,
  FiCheck,
  FiLink,
  FiChevronDown,
  FiShield,
} from 'react-icons/fi';

// --- Custom Styled Button ---
const CustomButton = ({
  children,
  onClick,
  variant = 'primary',
  disabled,
  className = '',
}) => {
  const baseStyle =
    'px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-95';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#FF8585] to-[#FF6B6B] hover:from-[#FF6B6B] hover:to-[#F54E4E] text-white shadow-[0_10px_20px_-10px_rgba(255,107,107,0.5)] disabled:opacity-50 disabled:shadow-none',
    outline:
      'border-2 border-gray-100 hover:border-[#FF6B6B] hover:text-[#FF6B6B] text-gray-500 bg-white',
    ghost: 'hover:bg-gray-100 text-gray-500 hover:text-gray-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${
        disabled ? 'cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};

const SharePopup = ({ isOpen, onClose, fileId, BASE_URL }) => {
  const [email, setEmail] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [loading, setLoading] = useState(false);
  // NEW: Role State (Default to viewer)
  const [role, setRole] = useState('viewer');

  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addEmail = () => {
    const trimmed = email.trim();
    if (!trimmed) return;

    if (!isValidEmail(trimmed)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (emailList.includes(trimmed)) {
      toast.error('Email already added');
      setEmail('');
      return;
    }

    setEmailList([...emailList, trimmed]);
    setEmail('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmailList(emailList.filter((e) => e !== emailToRemove));
  };

  const sendEmails = async () => {
    if (emailList.length === 0) return;
    setLoading(true);
    try {
      for (let em of emailList) {
        // --- UPDATED API CALL ---
        // Matches: router.post("/:email", ...)
        // Email goes in URL, fileid and role go in Body
        const res = await fetch(`${BASE_URL}/share/${em}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileid: fileId,
            role: role, // Sending the selected role
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to share');
        }
      }

      toast.custom(
        <div className="bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 font-medium">
          <div className="bg-white/20 p-1 rounded-full">
            <FiCheck />
          </div>
          <span>Shared successfully!</span>
        </div>,
        {
          position: 'top-right',
          duration: 2000,
          unmount: false,
        }
      );

      setTimeout(() => {
        setEmailList([]);
        onClose();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err.message || 'Error sharing!');
    } finally {
      setLoading(false);
    }
  };

  // --- DEFINE THE MODAL CONTENT ---
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!loading ? onClose : undefined}
          />

          {/* Card Container */}
          <motion.div
            className="relative w-full max-w-[480px] z-[999999] bg-white rounded-lg shadow-2xl overflow-hidden border border-white"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Decorative Blurs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FF6B6B]/20 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8585]/10 blur-[50px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="relative p-8 pb-4 flex justify-between items-start z-10">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  Share File
                </h2>
                <p className="text-sm text-gray-400">
                  Invite your team to collaborate.
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
                disabled={loading}
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 pt-2 space-y-6 z-10 relative">
              {/* Input Group */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#FF6B6B] transition-colors">
                      <FiMail size={18} />
                    </div>
                    <input
                      ref={inputRef}
                      type="email"
                      placeholder="arman@company.com"
                      className="w-full bg-gray-50 border-2 border-gray-100 hover:border-gray-200 rounded-xl py-3 pl-11 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FF6B6B] focus:bg-white transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={loading}
                    />
                  </div>
                  <CustomButton
                    variant="outline"
                    onClick={addEmail}
                    disabled={!email || loading}
                    className="aspect-square px-0 w-[50px] flex items-center justify-center rounded-xl border-2"
                  >
                    +
                  </CustomButton>
                </div>
              </div>

              {/* Chips Container */}
              <div className="bg-gray-50/50 rounded-2xl p-4 min-h-[120px] max-h-[200px] overflow-y-auto custom-scrollbar border border-gray-100">
                <div className="flex justify-between items-end mb-3">
                  <p className="text-xs font-semibold text-gray-400">
                    PEOPLE WITH ACCESS ({emailList.length})
                  </p>
                  {emailList.length > 0 && (
                    <button
                      onClick={() => setEmailList([])}
                      className="text-xs text-[#FF6B6B] font-medium hover:text-[#ff4747]"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {emailList.length === 0 ? (
                  <div className="h-20 flex flex-col items-center justify-center text-gray-400/80 gap-2">
                    <FiUsers size={24} className="opacity-50" />
                    <span className="text-sm">No one added yet</span>
                  </div>
                ) : (
                  <motion.div layout className="flex flex-wrap gap-2">
                    <AnimatePresence mode="popLayout">
                      {emailList.map((e) => (
                        <motion.div
                          layout
                          key={e}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="group flex items-center gap-2 pl-3 pr-1 py-1.5 bg-white border border-gray-200 shadow-sm text-gray-600 rounded-full text-sm"
                        >
                          <span className="font-medium text-gray-700">{e}</span>
                          <button
                            className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => removeEmail(e)}
                            disabled={loading}
                          >
                            <FiX size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="relative p-8 pt-0 flex flex-col md:flex-row justify-between items-center gap-4">
              {/* NEW: Role Selection Dropdown */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 self-start md:self-auto">
                <FiShield className="text-gray-400" />
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="appearance-none bg-transparent font-medium text-sm text-gray-700 pr-6 focus:outline-none cursor-pointer"
                    disabled={loading}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                  <FiChevronDown
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={14}
                  />
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto justify-end">
                <CustomButton
                  variant="ghost"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </CustomButton>

                <CustomButton
                  variant="primary"
                  onClick={sendEmails}
                  disabled={emailList.length === 0 || loading}
                  className="w-32 shadow-lg shadow-[#FF6B6B]/30"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <FiSend size={16} />
                    </>
                  )}
                </CustomButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default SharePopup;
