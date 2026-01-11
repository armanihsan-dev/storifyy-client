import React, { useState, useMemo, useEffect } from 'react';
import {
  Check,
  Crown,
  Sparkles,
  CheckCircle2,
  Download,
  PauseCircle,
  ShieldCheck,
  CreditCard,
  PlayCircle,
  XCircle,
  Calendar,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Clock,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  FileText,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGenerateInvoice, useMySubscription } from '@/hooks/otherHooks';
import { BASE_URL } from '../utility/Server';
import AuthDropDown from '../components/AuthDropDown';
import { monthlyPlans, yearlyPlans } from '../pages/SubscriptionPage';
import {
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
  unpauseSubscription,
} from '../API/lemonSqueezy';

// --- Header Component ---
const Header = () => (
  <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <Link
        to="/"
        className="flex items-center gap-2 font-extrabold text-pink-400 text-lg hover:opacity-90 transition"
      >
        <img src="/logo.svg" alt="Storifyy" className="w-8 h-8" />
        <span>Storifyy</span>
      </Link>
      <AuthDropDown BASEURL={BASE_URL} />
    </div>
  </header>
);

const InvoiceModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [form, setForm] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    notes: '',
  });

  // State to hold the error message
  const [error, setError] = useState('');

  // --- NEW: Auto-hide error after 3 seconds ---
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 2000); // Error disappears after 3000ms (3 seconds)

      // Cleanup: clears timer if component unmounts or error changes quickly
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    // Clear error immediately if user starts fixing it
    if (error) setError('');

    if (e.target.name === 'country') {
      setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = () => {
    // 1. Reset error state temporarily
    setError('');

    // 2. Strict Empty Field Check
    const requiredFields = ['address', 'city', 'state', 'zipCode', 'country'];
    const emptyField = requiredFields.find((field) => !form[field]?.trim());

    if (emptyField) {
      const fieldName =
        emptyField.charAt(0).toUpperCase() + emptyField.slice(1);
      setError(`Please complete all fields. ${fieldName} is missing.`);
      return;
    }

    // 3. Strict Country Code Logic
    const countryCodeRegex = /^[A-Z]{2}$/;
    if (!countryCodeRegex.test(form.country.trim())) {
      setError(
        'Invalid country code! Use 2-letter ISO code (e.g., PK, IN, US).'
      );
      return;
    }

    // 4. API Call
    onSubmit(form);
  };

  const inputStyle =
    'w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white outline-none transition-all duration-200';

  const labelStyle =
    'text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={isLoading ? null : onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Scrollable Content Area */}
        <div className="overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="bg-pink-100 p-6 text-white relative shrink-0">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-5 right-5 text-slate-400 hover:texts hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
                <FileText size={25} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-pink-400">
                  Billing Details
                </h3>
                <p className="text-pink-600 text-xs mt-0.5">
                  Enter details to generate your invoice.
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-4">
            {/* Address */}
            <div>
              <label className={labelStyle}>
                Street Address <span className="text-pink-500">*</span>
              </label>
              <input
                name="address"
                placeholder="House 21, Street 5, DHA"
                value={form.address}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            {/* City + State + Zip + Country (Grid of 4) */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className={labelStyle}>
                  City <span className="text-pink-500">*</span>
                </label>
                <input
                  name="city"
                  placeholder="Lahore"
                  value={form.city}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>
                  State <span className="text-pink-500">*</span>
                </label>
                <input
                  name="state"
                  placeholder="Punjab"
                  value={form.state}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>
                  Zip <span className="text-pink-500">*</span>
                </label>
                <input
                  name="zipCode"
                  placeholder="54000"
                  value={form.zipCode}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Code <span className="text-pink-500">*</span>
                </label>
                <input
                  name="country"
                  placeholder="PK"
                  maxLength={2}
                  value={form.country}
                  onChange={handleChange}
                  className={`${inputStyle} uppercase`}
                />
                <p className="text-[9px] text-slate-400 mt-1 truncate">
                  e.g. PK, US
                </p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={labelStyle}>Notes (Optional)</label>
              <textarea
                name="notes"
                placeholder="VAT / NTN number or special instructions..."
                rows="2"
                value={form.notes}
                onChange={handleChange}
                className={`${inputStyle} resize-none`}
              />
            </div>
          </div>

          {/* Footer / Action Button */}
          <div className="p-6 pt-2 bg-white sticky bottom-0 z-10">
            {/* Error Message Display (Fades in) */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-[12px] font-medium text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3.5 bg-pink-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              Generate Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Modal Component ---
const ActionModal = ({
  isOpen,
  onClose,
  title,
  description,
  confirmText,
  onConfirm,
  type = 'danger',
  modalIcon: IconOverride,
  isLoading,
}) => {
  if (!isOpen) return null;

  // Configuration for different modal types
  const themes = {
    danger: {
      ring: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      btn: 'bg-gradient-to-r from-red-500 to-rose-600 hover:to-rose-700 shadow-red-500/30',
      iconDefault: AlertTriangle,
    },
    warning: {
      ring: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      btn: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:to-orange-600 shadow-amber-500/30',
      iconDefault: AlertTriangle,
    },
    success: {
      ring: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      btn: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:to-teal-700 shadow-emerald-500/30',
      iconDefault: CheckCircle2,
    },
    neutral: {
      ring: 'bg-slate-50',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      btn: 'bg-gradient-to-r from-slate-700 to-slate-900 hover:to-black shadow-slate-500/30',
      iconDefault: RotateCcw,
    },
  };

  const theme = themes[type] || themes.danger;
  const IconToRender = IconOverride || theme.iconDefault;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur & Fade In */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={isLoading ? null : onClose}
      />

      {/* Modal Container with Zoom In Animation */}
      <div className="relative bg-white rounded-3xl shadow-xl max-w-md w-full p-6 md:p-8 transform transition-all animate-in zoom-in-95 duration-200 border border-slate-100">
        {/* Close "X" Button (Top Right) */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Centered Content */}
        <div className="flex flex-col items-center text-center">
          {/* Animated Icon Container */}
          <div
            className={`mb-6 p-3 rounded-full ${theme.ring} animate-in zoom-in duration-300 delay-100`}
          >
            <div
              className={`w-16 h-16 rounded-full ${theme.iconBg} flex items-center justify-center shadow-sm`}
            >
              <IconToRender
                className={`w-8 h-8 ${theme.iconColor}`}
                strokeWidth={2.5}
              />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">
            {title}
          </h3>

          <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-full">
            {description}
          </p>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-3.5 text-slate-600 text-sm font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`
                px-4 py-3.5 text-white text-sm font-bold rounded-xl shadow-lg 
                flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                disabled:opacity-70 disabled:cursor-not-allowed
                ${theme.btn}
              `}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageSubscription = () => {
  const queryClient = useQueryClient();

  // Optimistic UI State
  const [pendingAction, setPendingAction] = useState(null); // 'cancel' | 'pause' | 'unpause' | 'revoke'
  const [modalType, setModalType] = useState(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  // Poll aggressively if we have a pending action to catch the webhook update ASAP
  const { data: subscription, isLoading: isSubLoading } = useMySubscription({
    refetchInterval: pendingAction ? 1000 : false,
  });

  const invoiceMutation = useGenerateInvoice({
    onSuccess: (data) => {
      if (data?.invoiceUrl) {
        window.open(data.invoiceUrl, '_blank');
        toast.success('Invoice ready!');
      } else toast.error('Invoice generated but URL missing.');
    },
    onError: (err) =>
      toast.error(err?.response?.data?.error || 'Failed to generate invoice'),
  });

  // Watcher: Clear "Pending" state when data actually updates
  useEffect(() => {
    if (!subscription || !pendingAction) return;
    const { status } = subscription;

    if (pendingAction === 'pause' && status === 'paused')
      setPendingAction(null);
    if (pendingAction === 'unpause' && status === 'active')
      setPendingAction(null);
    if (pendingAction === 'revoke' && status === 'active')
      setPendingAction(null);
    if (
      pendingAction === 'cancel' &&
      (status === 'cancelled' || subscription.renewsAt === null)
    )
      setPendingAction(null);
  }, [subscription, pendingAction]);

  // 🐞 5. Defensive fix: Guard against state race conditions on clicks
  const safeSetModal = (type) => {
    if (pendingAction) return;
    setModalType(type);
  };

  // --- Helper to handle "Zero Wait" Logic ---
  const handleMutationStart = (actionName) => {
    setModalType(null); // 1. Close modal IMMEDIATELY
    setPendingAction(actionName); // 2. Show non-blocking loading banner

    // 🐞 8. Fix: Use a toast ID to prevent stacking multiple loading toasts
    toast.loading(`Processing ${actionName}...`, {
      duration: 2000,
      id: 'subscription-action',
    });
  };

  const handleError = () => {
    setPendingAction(null);
    toast.error('Something went wrong. Please try again.');
  };

  const cancelMut = useMutation({
    mutationFn: cancelSubscription,
    onMutate: () => handleMutationStart('cancel'),
    onSuccess: () => queryClient.invalidateQueries(['my-current-subscription']),
    onError: handleError,
  });

  const pauseMut = useMutation({
    mutationFn: pauseSubscription,
    onMutate: () => handleMutationStart('pause'),
    onSuccess: () => queryClient.invalidateQueries(['my-current-subscription']),
    onError: handleError,
  });

  const unpauseMut = useMutation({
    mutationFn: unpauseSubscription,
    onMutate: () => handleMutationStart('unpause'),
    onSuccess: () => queryClient.invalidateQueries(['my-current-subscription']),
    onError: handleError,
  });

  const revokeMut = useMutation({
    mutationFn: resumeSubscription,
    onMutate: () => handleMutationStart('revoke'),
    onSuccess: () => queryClient.invalidateQueries(['my-current-subscription']),
    onError: handleError,
  });

  // --- Derived State ---
  const currentPlanDetails = useMemo(() => {
    if (!subscription) return null;
    return (
      [...monthlyPlans, ...yearlyPlans].find(
        (p) => p.lsId === subscription.variantId
      ) || monthlyPlans[0]
    );
  }, [subscription]);

  // 🐞 1. Fix: Unified source of truth for cancellation state to prevent UI overlap
  const isCancelled =
    subscription?.status === 'cancelled' &&
    subscription?.renewsAt &&
    new Date(subscription.renewsAt) > new Date();

  // Grace period is now strictly synonymous with cancellation state
  const isGracePeriod = isCancelled;

  const isExpired = subscription?.status === 'expired';

  const isFree =
    (!subscription ||
      (isExpired && !isGracePeriod) ||
      currentPlanDetails?.price === 0) &&
    !isGracePeriod;

  const isActive = subscription?.status === 'active';
  const isPaused = subscription?.status === 'paused';

  const PlanIcon = currentPlanDetails?.icon || Sparkles;

  if (isSubLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
          <p className="text-slate-500 font-medium">Loading subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      {/* --- Action Modals --- */}
      <ActionModal
        isOpen={modalType === 'cancel'}
        onClose={() => setModalType(null)}
        title="Cancel Subscription?"
        description="Are you sure? You will retain access until the end of your current billing period, but your plan will not auto-renew. No further charges will be applied."
        confirmText="Yes, Cancel Plan"
        onConfirm={() => cancelMut.mutate()}
        type="danger"
        modalIcon={XCircle}
      />

      <ActionModal
        isOpen={modalType === 'pause'}
        onClose={() => setModalType(null)}
        title="Pause Subscription?"
        description="Need a break? This stops future payments while keeping your account data safe. You won't be charged again until you manually resume."
        confirmText="Pause Subscription"
        onConfirm={() => pauseMut.mutate()}
        type="warning"
        modalIcon={PauseCircle}
      />

      <ActionModal
        isOpen={modalType === 'unpause'}
        onClose={() => setModalType(null)}
        title="Resume Subscription?"
        description="Ready to continue? This will immediately reactivate your subscription and billing cycle. You will regain full access to all premium features instantly."
        confirmText="Resume Now"
        onConfirm={() => unpauseMut.mutate()}
        type="success"
        modalIcon={PlayCircle}
      />

      <ActionModal
        isOpen={modalType === 'revoke'}
        onClose={() => setModalType(null)}
        title="Keep Subscription?"
        description="Changed your mind? This removes the scheduled cancellation. Your plan will continue without interruption and auto-renew on the next billing date."
        confirmText="Keep My Plan"
        onConfirm={() => revokeMut.mutate()}
        type="neutral"
        modalIcon={RotateCcw}
      />

      <InvoiceModal
        isOpen={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        onSubmit={(f) => {
          setInvoiceOpen(false);
          invoiceMutation.mutate({ variantId: subscription.variantId, ...f });
        }}
        isLoading={invoiceMutation.isPending}
        // Note for Bug 6: Ensure InvoiceModal internals use 'hover:text-white' not 'hover:texts'
      />

      {/* 🐞 7. Fix: Use explicit padding to account for fixed header (pt-20) instead of magic py-28 */}
      <div className="relative min-h-screen bg-slate-50 font-[Poppins] pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[128px] animate-blob" />
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-5xl mx-auto z-10">
          {/* Header Text */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Your Subscription
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Manage your plan, billing details, and invoices.
            </p>
          </div>

          {/* PROCESSING BANNER (Optimistic UI) */}
          {pendingAction && (
            <div className="mb-8 p-4 bg-white/80 backdrop-blur-md border border-indigo-100 rounded-2xl shadow-lg shadow-indigo-500/10 flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Updating Subscription...
                  </h4>
                  <p className="text-xs text-slate-500">
                    Communicating with payment provider. Changes will reflect
                    shortly.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* --- LEFT COLUMN: MAIN CARD --- */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                {/* Card Header */}
                <div className="p-8 md:p-10 border-b border-slate-100/50 relative overflow-hidden">
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${
                      currentPlanDetails?.name === 'Premium'
                        ? 'from-pink-500/10 to-transparent'
                        : 'from-blue-500/10 to-transparent'
                    } rounded-bl-full`}
                  />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-slate-200 ${
                          currentPlanDetails?.name === 'Premium'
                            ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white'
                            : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                        }`}
                      >
                        <PlanIcon className="w-10 h-10" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-3xl font-bold text-slate-900">
                            {currentPlanDetails?.name}
                          </h2>
                          {isActive && (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                              Active
                            </span>
                          )}
                          {isPaused && (
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200">
                              Paused
                            </span>
                          )}
                          {isGracePeriod && (
                            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">
                              Cancelled
                            </span>
                          )}
                          {isExpired && (
                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                              Expired
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-lg font-medium">
                          ${currentPlanDetails?.price}/
                          {currentPlanDetails?.billingCycle === 'Year'
                            ? 'year'
                            : 'month'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-8 md:p-10 bg-slate-50/50">
                  {/* Grace Period / Paused Alert Banners */}
                  {isGracePeriod && (
                    <div className="mb-6 p-5 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-4">
                      <Clock className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-orange-900">
                          Access ending soon
                        </h4>
                        <p className="text-sm text-orange-700/80 mt-1">
                          Your access remains valid until{' '}
                          <strong>
                            {new Date(
                              subscription.renewsAt
                            ).toLocaleDateString()}
                          </strong>
                          .
                        </p>
                      </div>
                      <button
                        onClick={() => safeSetModal('revoke')}
                        disabled={pendingAction !== null}
                        className="ml-auto text-sm font-bold bg-orange-100 px-3 py-2 rounded-xl hover:bg-orange-200 transition hover:shadow-sm text-orange-600 hover:text-orange-800 disabled:opacity-50"
                      >
                        Activate Now
                      </button>
                    </div>
                  )}

                  {isPaused && (
                    <div className="mb-6 p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
                      <PauseCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-amber-900">
                          Subscription Paused
                        </h4>
                        <p className="text-sm text-amber-700/80 mt-1">
                          Payments are stopped. Resume anytime to regain full
                          access.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Feature List */}
                  {/* 🐞 4. Fix: Hide features when cancelled to align mental model */}
                  {!isExpired && !isCancelled && (
                    <div className="space-y-4 mb-8">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Plan Features
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentPlanDetails?.features
                          ?.slice(0, 4)
                          .map((feature, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
                            >
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <Check
                                  className="w-3.5 h-3.5 text-green-600"
                                  strokeWidth={3}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {feature}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Info Grid */}
                  {!isFree && !isExpired && (
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200/60">
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                          Billing Cycle
                        </p>
                        <div className="flex items-center gap-2 text-slate-700 font-semibold">
                          <RefreshCw className="w-4 h-4 text-slate-400" />
                          {currentPlanDetails?.billingCycle}ly
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                          {isGracePeriod ? 'Ends On' : 'Next Payment'}
                        </p>
                        <div className="flex items-center gap-2 text-slate-700 font-semibold">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {subscription?.renewsAt
                            ? new Date(
                                subscription.renewsAt
                              ).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: ACTIONS GRID --- */}
            <div className="flex flex-col gap-5">
              {/* Free Plan / Upgrade Banner */}
              {(isFree || isExpired) && (
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white text-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full transition-transform group-hover:scale-110" />
                  <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Upgrade to Pro</h3>
                  <p className="text-slate-300 mb-6 text-sm">
                    Unlock unlimited potential and features.
                  </p>
                  <Link
                    to="/plans"
                    className="block w-full py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition shadow-lg active:scale-95"
                  >
                    View Plans
                  </Link>
                </div>
              )}

              {/* Paid Plan Actions */}
              {!isFree && !isExpired && (
                <>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider px-2">
                    Quick Actions
                  </h3>

                  {/* Invoices Tile */}
                  {/* 🐞 2. Fix: Disable Invoice button while pendingAction is active */}
                  <button
                    disabled={pendingAction !== null}
                    onClick={() => setInvoiceOpen(true)}
                    className={`group relative bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-all duration-300 text-left overflow-hidden 
                      ${
                        pendingAction !== null
                          ? 'opacity-60 cursor-not-allowed grayscale'
                          : 'hover:shadow-xl hover:shadow-slate-200/50 hover:border-pink-200'
                      }`}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Download className="w-20 h-20 text-pink-500 -rotate-12" />
                    </div>
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-500 group-hover:text-white transition-colors text-pink-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      Invoice
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Download latest PDF
                    </p>
                  </button>

                  {/* Customer Portal Tile */}
                  {/* 🐞 3. Fix: Removed !isPaused check so users can access billing portal even when paused */}
                  {subscription?.customerPortalUrl && (
                    <button
                      onClick={() =>
                        (window.location.href = subscription.customerPortalUrl)
                      }
                      className="group relative bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 transition-all duration-300 text-left overflow-hidden"
                    >
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-600">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">
                        Billing Portal
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Update card details
                      </p>
                      <ExternalLink className="absolute top-6 right-6 w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                    </button>
                  )}

                  {/* Danger Zone: Pause/Cancel */}
                  {!isCancelled ? (
                    <div className="grid grid-cols-2 gap-4">
                      {isPaused ? (
                        <button
                          onClick={() => safeSetModal('unpause')}
                          disabled={pendingAction !== null}
                          className="col-span-2 bg-emerald-500 text-white p-4 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                        >
                          <PlayCircle className="w-5 h-5" /> Resume
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => safeSetModal('pause')}
                            disabled={pendingAction !== null}
                            className="bg-white border border-slate-200 p-4 rounded-3xl font-bold text-slate-600 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:pointer-events-none"
                          >
                            <PauseCircle className="w-6 h-6 text-amber-500" />
                            <span className="text-xs">Pause</span>
                          </button>
                          <button
                            onClick={() => safeSetModal('cancel')}
                            disabled={pendingAction !== null}
                            className="bg-white border border-slate-200 p-4 rounded-3xl font-bold text-slate-600 flex flex-col items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all disabled:opacity-50 disabled:pointer-events-none"
                          >
                            <XCircle className="w-6 h-6 text-red-500" />
                            <span className="text-xs">Cancel</span>
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className=" bg-pink-400 rounded-[2rem] p-6 text-white shadow-xl">
                      <h3 className="text-lg font-bold mb-2">
                        Subscription Cancelled
                      </h3>
                      <p className="text-sm text-orange-100 mb-4">
                        Your plan will end on{' '}
                        <strong>
                          {new Date(subscription.renewsAt).toLocaleDateString()}
                        </strong>
                        . Reactivate now to avoid losing access.
                      </p>

                      <button
                        onClick={() => safeSetModal('revoke')}
                        disabled={pendingAction !== null}
                        className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl hover:bg-orange-50 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Activate Now
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Secure Payment
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>
              All plans include automatic backups and can be cancelled anytime
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageSubscription;
