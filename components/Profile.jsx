import { useEffect, useState } from 'react';
import { BASE_URL } from '../utility/Server';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShield,
  FiLock,
  FiEdit3,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
  FiKey,
  FiTrash2,
  FiEyeOff,
  FiLoader,
  FiActivity,
  FiUnlock,
  FiDatabase,
  FiPauseCircle,
  FiLogOut,
} from 'react-icons/fi';
import {
  useAccountDisable,
  useCurrentUser,
  useDeleteAccount,
  useMySubscription,
} from '@/hooks/otherHooks';
import { useQueryClient } from '@tanstack/react-query';
import StorageUsage from './StorageUsage';
import { Header } from './../pages/SubscriptionPage';
import { AccountHibernation } from './DisabledAccount';

// --- ANIMATION VARIANTS ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVar = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const Profile = () => {
  // Popup States: 'create', 'update', 'forgot', 'otp', 'delete', 'disable'
  const [activePopup, setActivePopup] = useState(null);

  // Form States
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailForOTP, setEmailForOTP] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- React Query User Data ---
  const { data: user, isPending, isError } = useCurrentUser();
  const { data: subscriptionData } = useMySubscription();

  // --- Mutation ---
  const { mutate: disableAccount, isPending: pendingAccountDisable } =
    useAccountDisable();

  // --- EXISTING HANDLERS ---
  async function handleCreatePassword() {
    if (!password.trim()) {
      setError(true);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/user/setPassword`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error);
      toast.success('Security enabled successfully!');
      setActivePopup(null);
      setPassword('');
      queryClient.invalidateQueries(['current-user']);
    } catch (err) {
      toast.error(err.message || 'Failed');
    }
  }

  async function handleUpdatePassword() {
    if (!oldPassword.trim() || !newPassword.trim()) {
      setError(true);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/user/updatePassword`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Wrong password');
      toast.success('Password updated! Please login.');
      setActivePopup(null);
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleSendOTP() {
    if (!emailForOTP.trim()) {
      setError(true);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/user/sendotp`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForOTP }),
      });
      if (!res.ok) throw new Error('Failed to send OTP');
      toast.success('Code sent to ' + emailForOTP);
      setOtp(['', '', '', '']);
      setActivePopup('otp');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleVerifyOTP() {
    const code = otp.join('');
    if (code.length !== 4) {
      toast.error('Enter 4 digits');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/user/verifyotp`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: code, email: emailForOTP }),
      });
      if (!res.ok) throw new Error('Invalid Code');
      toast.success('Verified!');
      setActivePopup('create');
      setPassword('');
      queryClient.invalidateQueries(['current-user']);
    } catch (err) {
      toast.error(err.message);
    }
  }

  // --- RE-ENABLE ACCOUNT HANDLER ---

  // --- DELETE HANDLER ---
  // --- DELETE HANDLER ---
  // Change this line:
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const handleDeleteAccount = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        toast.success('Account deleted successfully');
        setActivePopup(null);
        queryClient.invalidateQueries(['current-user']);
        navigate('/login');
      },
      onError: () => {
        toast.error('Failed to delete account');
      },
    });
  };

  // --- DISABLE HANDLER ---
  const handleDisableAccount = () => {
    disableAccount(undefined, {
      onSuccess: () => {
        toast.success('Account disabled successfully');
        setActivePopup(null);
        queryClient.invalidateQueries(['current-user']);
        navigate('/login');
      },
      onError: (err) => {
        toast.error(err?.message || 'Failed to disable account');
      },
    });
  };

  if (isPending || !user)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8F9FD]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );

  // =========================================================
  //  DISABLED ACCOUNT VIEW (Completely Changed UI/UX)
  // =========================================================
  if (user.isDisabled) {
    return (
      <AccountHibernation user={user} subscriptionData={subscriptionData} />
    );
  }

  // =========================================================
  //  STANDARD ACTIVE DASHBOARD
  // =========================================================

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#F8F9FD] p-6 md:p-12 mt-12 relative overflow-hidden flex items-center justify-center">
        <Toaster
          toastOptions={{
            style: { borderRadius: '10px', background: '#222', color: '#fff' },
          }}
        />

        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FF6B6B]/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <motion.div
          variants={containerVar}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 z-10"
        >
          {/* --- COL 1: USER IDENTITY CARD --- */}
          <motion.div
            variants={itemVar}
            className="md:col-span-1 md:sticky md:top-24  bg-white rounded-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-8 flex flex-col items-center text-center relative overflow-hidden border border-white/50"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FF6B6B]/10 to-transparent" />

            <div className="relative mb-4 group cursor-pointer">
              <div className="absolute -inset-1 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500" />
              <img
                src={user?.picture || '../src/assets/profile.png'}
                className="w-28 h-28 rounded-full object-cover border-4 border-white relative shadow-xl"
                alt="User"
              />
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-[3px] border-white bg-green-400" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mt-2">
              {user.name}
            </h1>
            <p className="text-gray-400 font-medium text-sm mb-6">
              {user.email}
            </p>

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Role
                </span>
                <span className="px-3 py-1 bg-white shadow-sm text-[#FF6B6B] font-bold text-xs rounded-xl border border-gray-100 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>

              {/* --- STATUS BADGE LOGIC --- */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-emerald-50 border-emerald-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide pl-2">
                  Status
                </span>
                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold pr-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </motion.div>

          {/* --- COL 2 & 3: DASHBOARD STATS & ACTIONS --- */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* ROW 1: Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                variants={itemVar}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow"
              >
                <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                  <FiCalendar size={60} />
                </div>
                <div className="flex items-center gap-2 text-[#FF6B6B] mb-2">
                  <FiCalendar />
                  <span className="text-xs font-bold uppercase">Joined</span>
                </div>
                <div>
                  <h3 className="text-[18px] lg:text-xl font-bold text-gray-800">
                    {user.formattedDate}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {user.accountAge} journey
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVar}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow"
              >
                <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                  <FiClock size={60} />
                </div>
                <div className="flex items-center gap-2 text-purple-500 mb-2">
                  <FiClock />
                  <span className="text-xs font-bold uppercase">
                    Last Update
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {user.formattedUpdate}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Profile details updated
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVar}>
              <StorageUsage
                usedStorage={user.usedStorage}
                maxStorage={user.maxStorage}
              />
            </motion.div>

            {/* ROW 2: Security Control Center */}
            <motion.div
              variants={itemVar}
              className="flex-1 bg-white rounded-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-8 border border-gray-100 relative overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none ${
                  user.hasPassword ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
              />
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h2 className="text-[16px] lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FiShield
                      className={
                        user.hasPassword ? 'text-emerald-500' : 'text-rose-500'
                      }
                    />
                    Security Center
                  </h2>
                  <p className="text-gray-400 text-[10px] lg:text-sm mt-1">
                    Manage your account access and protection.
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-[8px]  lg:text-sm font-bold flex items-center gap-2 ${
                    user.hasPassword
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {user.hasPassword ? <FiCheckCircle /> : <FiAlertTriangle />}
                  {user.hasPassword ? 'SECURE' : 'AT RISK'}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-2 flex items-center relative z-10">
                <div className="bg-white rounded-full p-4 shadow-sm border border-gray-100 h-24 w-24 flex items-center justify-center shrink-0">
                  <FiKey size={32} className="text-gray-300" />
                </div>
                <div className="px-6 flex-1">
                  <h3 className="font-bold text-gray-800 text-sm lg:text-lg">
                    Password Protection
                  </h3>
                  <p className="text-[10px] lg:text-xs text-gray-500 mt-1">
                    {user.hasPassword
                      ? 'Your account is currently password protected. Change it periodically for safety.'
                      : 'Your account has no password. Set one now to prevent unauthorized access.'}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end relative z-10">
                {!user.hasPassword ? (
                  <button
                    onClick={() => {
                      setError(false);
                      setActivePopup('create');
                    }}
                    className="group relative px-8 py-3 bg-[#FF6B6B] text-white rounded-lg font-semibold shadow-lg shadow-[#FF6B6B]/30 overflow-hidden transition hover:shadow-[#FF6B6B]/50"
                  >
                    <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative flex items-center gap-2">
                      <FiLock /> Enable Protection
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setError(false);
                      setActivePopup('update');
                    }}
                    className="px-8 py-3 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-semibold hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all flex items-center gap-2"
                  >
                    <FiEdit3 /> Change Password
                  </button>
                )}
              </div>
            </motion.div>

            {/* --- DISABLE ACCOUNT SECTION (Active View) --- */}
            <motion.div
              variants={itemVar}
              className="bg-amber-50 border-amber-100 rounded-lg border-2 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 text-amber-600 p-3 rounded-full mt-1 transition-colors">
                  <FiEyeOff size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-800">
                    Disable My Account
                  </h3>
                  <p className="text-xs text-amber-600 font-medium mt-1">
                    ⚠️ This action is temporary and can be reversed.
                  </p>
                  <p className="text-xs text-gray-600 mt-2 max-w-sm leading-relaxed">
                    Disabling your account will hide your profile and stop all
                    email or app notifications. Your data will be retained
                    securely.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActivePopup('disable')}
                className="px-6 py-3 rounded-xl font-bold shadow-sm flex items-center gap-2 shrink-0 transition-all bg-white border-2 border-amber-200 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500"
              >
                <FiEyeOff /> Disable Account
              </button>
            </motion.div>

            {/* --- DELETE ACCOUNT --- */}
            <motion.div
              variants={itemVar}
              className="bg-red-50 rounded-lg border-2 border-red-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600 mt-1">
                  <FiTrash2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-700">
                    Delete My Account
                  </h3>
                  <p className="text-xs text-red-500 font-medium mt-1">
                    ⚠️ This action cannot be undone
                  </p>
                  <p className="text-xs text-gray-600 mt-2 max-w-sm leading-relaxed">
                    Deleting your account will permanently remove all your data,
                    files, <strong>subscription</strong> and settings. You will
                    lose access to all connected services and this action cannot
                    be reversed.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActivePopup('delete')}
                className="px-6 py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm flex items-center gap-2 shrink-0"
              >
                <FiTrash2 /> Delete Account
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* --- MODERN FLOATING POPUPS --- */}
        <AnimatePresence>
          {activePopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                // Update this line to include !isDeleting
                onClick={() =>
                  !pendingAccountDisable && !isDeleting && setActivePopup(null)
                }
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden z-10"
              >
                {/* --- DISABLE ACCOUNT MODAL CONTENT --- */}
                {activePopup === 'disable' ? (
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiEyeOff size={40} className="text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Disable Account?
                    </h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                      This will temporarily hide your profile and turn off
                      notifications.
                      <br /> You can reactivate it at any time.
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setActivePopup(null)}
                        disabled={pendingAccountDisable}
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDisableAccount}
                        disabled={pendingAccountDisable}
                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {pendingAccountDisable ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: 'linear',
                              }}
                            >
                              <FiLoader size={18} />
                            </motion.div>
                            Processing...
                          </>
                        ) : (
                          'Yes, Disable'
                        )}
                      </button>
                    </div>
                  </div>
                ) : activePopup === 'delete' ? (
                  // --- DELETE ACCOUNT MODAL CONTENT ---
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <FiAlertTriangle size={40} className="text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Are you sure?
                    </h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                      Do you really want to delete your account? <br />
                      This process cannot be undone and you will lose all your
                      data permanently.
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setActivePopup(null)}
                        disabled={isDeleting}
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: 'linear',
                              }}
                            >
                              <FiLoader size={18} />
                            </motion.div>
                            Processing...
                          </>
                        ) : (
                          'Yes, I am sure'
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* --- STANDARD POPUP HEADER --- */}
                    <div className="h-20 bg-[#FF6B6B]/5 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                    </div>

                    <button
                      onClick={() => setActivePopup(null)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                    >
                      <FiX size={20} />
                    </button>

                    <div className="px-8 pb-8 pt-2">
                      <h3 className="text-center text-xl font-bold text-gray-800 mb-1">
                        {activePopup === 'create' && 'Create Password'}
                        {activePopup === 'update' && 'Update Password'}
                        {activePopup === 'forgot' && 'Forgot Password?'}
                        {activePopup === 'otp' && 'Verify Identity'}
                      </h3>
                      <p className="text-center text-gray-400 text-sm mb-6">
                        {activePopup === 'create' &&
                          'Secure your account with a strong key.'}
                        {activePopup === 'update' &&
                          'Enter your old and new credentials.'}
                        {activePopup === 'forgot' &&
                          'We will send a recovery code to your email.'}
                        {activePopup === 'otp' &&
                          'Enter the 4-digit code sent to your email.'}
                      </p>

                      {/* FORM CONTENT */}
                      <div className="space-y-4">
                        {activePopup === 'create' && (
                          <ModernInput
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        )}

                        {activePopup === 'update' && (
                          <>
                            <ModernInput
                              type="password"
                              placeholder="Old Password"
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <ModernInput
                              type="password"
                              placeholder="New Password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <div className="text-right">
                              <button
                                onClick={() => setActivePopup('forgot')}
                                className="text-xs font-bold cursor-pointer text-[#FF6B6B] hover:underline"
                              >
                                Forgot Password?
                              </button>
                            </div>
                          </>
                        )}

                        {activePopup === 'forgot' && (
                          <ModernInput
                            type="email"
                            placeholder="your@email.com"
                            value={emailForOTP}
                            onChange={(e) => setEmailForOTP(e.target.value)}
                          />
                        )}

                        {activePopup === 'otp' && (
                          <div className="flex justify-center gap-3 my-4">
                            {otp.map((digit, i) => (
                              <input
                                key={i}
                                id={`otp-${i}`}
                                maxLength="1"
                                className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-100 rounded-2xl focus:border-[#FF6B6B] focus:ring-4 focus:ring-[#FF6B6B]/10 outline-none transition-all caret-[#FF6B6B] text-gray-700"
                                value={digit}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (!/^[0-9]?$/.test(val)) return;
                                  const updated = [...otp];
                                  updated[i] = val;
                                  setOtp(updated);
                                  if (val && i < 3)
                                    document
                                      .getElementById(`otp-${i + 1}`)
                                      ?.focus();
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {/* Action Button */}
                        <button
                          onClick={() => {
                            if (activePopup === 'create')
                              handleCreatePassword();
                            if (activePopup === 'update')
                              handleUpdatePassword();
                            if (activePopup === 'forgot') handleSendOTP();
                            if (activePopup === 'otp') handleVerifyOTP();
                          }}
                          disabled={isPending}
                          className="w-full py-4 rounded-2xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold shadow-lg shadow-[#FF6B6B]/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
                        >
                          {isPending ? 'Processing...' : 'Confirm'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Styled Input Component
const ModernInput = (props) => (
  <div className="relative group">
    <input
      {...props}
      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-[#FF6B6B] transition-all font-medium"
    />
  </div>
);

export default Profile;
