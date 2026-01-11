import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import {
  FiPower,
  FiDatabase,
  FiActivity,
  FiLock,
  FiCreditCard,
  FiChevronRight,
  FiCloud,
  FiAlertCircle,
  FiX,
  FiShield,
} from 'react-icons/fi';
import { handleReactivateAccount } from '../API/account';

// --- FAST & SNAPPY VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } },
};

export const AccountHibernation = ({ user, subscriptionData }) => {
  const [isReactivating, setIsReactivating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onConfirmReactivation = async () => {
    setShowConfirm(false);
    await handleReactivateAccount(setIsReactivating);
  };

  if (user.isDisabled) {
    return (
      <>
        <Toaster
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />

        {/* --- MINIMALIST POPUP --- */}
        <AnimatePresence>
          {showConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirm(false)}
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
              />

              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-100 p-6"
              >
                <div className="flex flex-col items-start">
                  <div className="bg-orange-50 p-3 rounded-full mb-4">
                    <FiAlertCircle className="text-orange-600 text-xl" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Reactivate account
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Access will be restored immediately. Your billing cycle
                    resumes today.
                  </p>

                  <div className="flex w-full gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onConfirmReactivation}
                      className="flex-1 py-2.5 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowConfirm(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                  <FiX size={18} />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- MAIN PAGE --- */}
        <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[1200px] bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[70vh]"
          >
            {/* === LEFT: BRAND & IDENTITY (Grey Background) === */}
            <div className="w-full lg:w-[40%] bg-slate-100/50 p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
              {/* Header */}
              <div className="flex items-center gap-3">
                {/* Replace with your logo source */}
                <img
                  src="../public/logo.svg"
                  width={60}
                  height={60}
                  alt="storifyy"
                />
                <h1 className="text-xl font-bold text-pink-400 tracking-tight">
                  Storifyy
                </h1>
              </div>

              {/* Identity */}
              <div className="my-10">
                <div className="relative inline-block mb-6">
                  <img
                    src={user?.picture || '../src/assets/profile.png'}
                    className="w-24 h-24 rounded-2xl object-cover border border-slate-200"
                    alt="Profile"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-xs font-bold text-slate-600">
                      Hibernated
                    </span>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-900">
                  Welcome back, {user.name.split(' ')[0]}
                </h2>
                <p className="text-slate-500 font-medium">
                  <h2 className="text-sm">Your account is paused, not gone.</h2>
                  <p className="text-[12px]">
                    Nothing has been deleted — your files and settings are
                    secure. Reactivate anytime to regain full access.
                  </p>
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <FiShield />
                <span>Secure Connection</span>
              </div>
            </div>

            {/* === RIGHT: ACTIONS (White Background) === */}
            <div className="w-full lg:w-[60%] p-10 flex flex-col justify-center">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Security */}
                <div className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 transition-colors duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <FiLock className="text-slate-400" size={20} />
                    <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-md">
                      Safe
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-700 text-sm">
                    Data Status
                  </h3>
                  <p className="text-slate-500 text-sm">Encrypted & Locked</p>
                </div>

                {/* Subscription */}
                <div className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 transition-colors duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <FiCreditCard className="text-slate-400" size={20} />
                    <span className="text-slate-600 text-xs font-bold bg-slate-100 px-2 py-1 rounded-md">
                      Paused
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-700 text-sm">Plan</h3>
                  <p className="text-slate-500 text-sm">
                    {subscriptionData?.plan || 'Free Tier'}
                  </p>
                </div>

                {/* Cloud Status (Wide) */}
                <div className="col-span-1 md:col-span-2 p-5 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiCloud className="text-slate-500" />
                    <span className="text-slate-700 font-medium text-sm">
                      Cloud Sync Ready
                    </span>
                  </div>
                  <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                </div>
              </div>

              {/* Primary Action */}
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isReactivating}
                className="group w-full py-4 px-6 bg-slate-900 hover:bg-black text-white rounded-xl flex items-center justify-between transition-all duration-200 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  {isReactivating ? (
                    <FiActivity className="animate-spin text-slate-400" />
                  ) : (
                    <div className="bg-slate-800 p-1.5 rounded-md">
                      <FiPower className="text-white" size={18} />
                    </div>
                  )}
                  <div className="text-left">
                    <span className="block font-bold text-sm">
                      {isReactivating ? 'Waking up...' : 'Reactivate Account'}
                    </span>
                  </div>
                </div>
                <FiChevronRight className="text-slate-500 group-hover:text-white transition-colors" />
              </button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }
  return null;
};
