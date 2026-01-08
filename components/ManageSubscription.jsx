import React, { useState, useMemo, useEffect } from 'react';
import {
  Check,
  Crown,
  Sparkles,
  Download,
  PauseCircle,
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
  MapPin,
  Building2,
  Globe,
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
          <div className="bg-slate-900 p-6 text-white relative shrink-0">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-5 right-5 text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Billing Details</h3>
                <p className="text-slate-400 text-xs mt-0.5">
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
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10"
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

  const colors = {
    danger: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    success: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    },
    neutral: {
      bg: 'bg-slate-50',
      icon: 'text-slate-600',
      button: 'bg-slate-800 hover:bg-slate-900',
    },
  };

  const theme = colors[type] || colors.danger;

  let IconToRender = AlertTriangle;
  if (IconOverride) {
    IconToRender = IconOverride;
  } else if (type === 'success' || type === 'neutral') {
    IconToRender = RotateCcw;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? null : onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
        <div
          className={`w-12 h-12 rounded-full ${theme.bg} flex items-center justify-center mb-4`}
        >
          <IconToRender className={`w-6 h-6 ${theme.icon}`} />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-slate-600 text-sm font-semibold hover:bg-slate-50 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-md transition-all flex items-center gap-2 ${theme.button}`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageSubscription = () => {
  const queryClient = useQueryClient();

  // 1️⃣ OPTIMISTIC STATE: Track what action is currently waiting for the webhook
  const [pendingAction, setPendingAction] = useState(null);
  // pendingAction = 'cancel' | 'pause' | 'unpause' | 'revoke' | null

  // 2️⃣ SMART POLLING: Refetch every 1s ONLY if we are waiting for an update
  const { data: subscription, isLoading: isSubLoading } = useMySubscription({
    refetchInterval: pendingAction ? 1000 : false, // 👈 Polling Magic
  });

  const [modalType, setModalType] = useState(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const invoiceMutation = useGenerateInvoice({
    onSuccess: (data) => {
      if (data?.invoiceUrl) {
        window.open(data.invoiceUrl, '_blank');
        toast.success('Invoice generated successfully');
      } else {
        toast.error('Invoice generated but no URL returned');
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Failed to generate invoice');
    },
  });

  // Helper to invalidate
  const invalidateSubscription = () => {
    queryClient.invalidateQueries({ queryKey: ['my-current-subscription'] });
  };

  // --- 3️⃣ WATCHER EFFECT ---
  // Automatically clear the "Pending" banner when the DB actually updates
  useEffect(() => {
    if (!subscription || !pendingAction) return;

    const status = subscription.status;

    // Logic: If the DB status matches our desired state, stop the spinner
    if (pendingAction === 'pause' && status === 'paused') {
      setPendingAction(null);
      toast.success('System updated: Subscription is now paused.');
    }
    if (pendingAction === 'unpause' && status === 'active') {
      setPendingAction(null);
      toast.success('System updated: Subscription is active.');
    }
    // Cancel is tricky because it might go to 'active' (grace period) or 'cancelled'
    // We check if cancelAtPeriodEnd flag became true OR status is cancelled
    if (
      pendingAction === 'cancel' &&
      (status === 'cancelled' || subscription.renewsAt === null)
    ) {
      setPendingAction(null);
      toast.success('System updated: Cancellation confirmed.');
    }
    if (
      pendingAction === 'revoke' &&
      status === 'active' &&
      subscription.renewsAt
    ) {
      setPendingAction(null);
      toast.success('System updated: Plan renewed.');
    }
  }, [subscription, pendingAction]);

  // --- REACT QUERY MUTATIONS ---

  // 1. Cancel
  const cancelMut = useMutation({
    mutationFn: cancelSubscription,
    onMutate: () => setPendingAction('cancel'), // Set flag immediately
    onSuccess: () => {
      setModalType(null);
      invalidateSubscription();
    },
    onError: () => {
      setPendingAction(null); // Reset on API failure
      toast.error('Failed to cancel subscription.');
    },
  });

  // 2. Pause
  const pauseMut = useMutation({
    mutationFn: pauseSubscription,
    onMutate: () => setPendingAction('pause'),
    onSuccess: () => {
      setModalType(null);
      invalidateSubscription();
    },
    onError: (error) => {
      setPendingAction(null);
      toast.error(
        error?.response?.data?.error || 'Failed to pause subscription'
      );
    },
  });

  // 3. Unpause
  const unpauseMut = useMutation({
    mutationFn: unpauseSubscription,
    onMutate: () => setPendingAction('unpause'),
    onSuccess: () => {
      setModalType(null);
      invalidateSubscription();
    },
    onError: () => {
      setPendingAction(null);
      toast.error('Failed to unpause subscription');
    },
  });

  // 4. Revoke
  const revokeMut = useMutation({
    mutationFn: resumeSubscription,
    onMutate: () => setPendingAction('revoke'),
    onSuccess: () => {
      setModalType(null);
      invalidateSubscription();
    },
    onError: () => {
      setPendingAction(null);
      toast.error('Failed to revoke cancellation.');
    },
  });

  // Check if API call is in flight (for button loaders)
  const isApiLoading =
    cancelMut.isPending ||
    pauseMut.isPending ||
    unpauseMut.isPending ||
    revokeMut.isPending;

  // --- STATE DERIVATION LOGIC ---
  const currentPlanDetails = useMemo(() => {
    if (!subscription) return null;
    const allPlans = [...monthlyPlans, ...yearlyPlans];
    return (
      allPlans.find((p) => p.lsId === subscription.variantId) || monthlyPlans[0]
    );
  }, [subscription]);

  const isGracePeriod = useMemo(() => {
    if (!subscription) return false;
    if (subscription.isGracePeriod) return true;
    return (
      subscription.status === 'cancelled' &&
      subscription.renewsAt &&
      new Date(subscription.renewsAt) > new Date()
    );
  }, [subscription]);

  const isExpired = subscription?.status === 'expired';

  const isFree =
    (!subscription ||
      (isExpired && !isGracePeriod) ||
      currentPlanDetails?.price === 0) &&
    !isGracePeriod;

  const isActive = subscription?.status === 'active';
  const isPaused = subscription?.status === 'paused';

  // --- HANDLERS ---
  const handleDownloadInvoice = () => {
    console.log('handling download invoice');
    setInvoiceOpen(true);
  };
  const submitInvoice = (form) => {
    invoiceMutation.mutate({
      variantId: subscription.variantId,
      ...form,
    });
    setInvoiceOpen(false);
  };

  const handlePortalRedirect = () => {
    if (isPaused) {
      toast.error('Portal unavailable while paused.');
      return;
    }
    if (subscription?.customerPortalUrl) {
      window.location.href = subscription.customerPortalUrl;
    } else {
      toast.error('Customer portal is not available.');
    }
  };

  // Handlers
  const handleCancelSubscription = () => cancelMut.mutate();
  const handlePauseSubscription = () => pauseMut.mutate();
  const handleUnpauseSubscription = () => unpauseMut.mutate();
  const handleRevokeCancellation = () => revokeMut.mutate();

  // --- UI HELPERS ---
  if (isSubLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const PlanIcon = currentPlanDetails?.icon || Sparkles;

  // Status Badge Logic
  let statusBadgeClass = 'text-slate-600 bg-slate-100 border-slate-200';
  let statusText = 'Free';
  let cardBorderClass = 'border-slate-200';
  let cardShadowClass = 'shadow-xl';

  if (isActive) {
    statusBadgeClass = 'text-emerald-600 bg-emerald-50 border-emerald-200';
    statusText = 'Active';
  } else if (isPaused) {
    statusBadgeClass = 'text-amber-600 bg-amber-50 border-amber-200';
    statusText = 'Paused';
  } else if (isGracePeriod) {
    statusBadgeClass = 'text-orange-600 bg-orange-50 border-orange-200';
    statusText = `Ends ${new Date(subscription.renewsAt).toLocaleDateString()}`;
    cardBorderClass = 'border-orange-300';
    cardShadowClass = 'shadow-2xl shadow-orange-100';
  } else if (isExpired) {
    statusBadgeClass = 'text-red-600 bg-red-50 border-red-200';
    statusText = 'Expired';
  }

  return (
    <>
      <Header />

      {/* --- MODALS --- */}
      <ActionModal
        isOpen={modalType === 'cancel'}
        onClose={() => setModalType(null)}
        title="Cancel Subscription?"
        description="Are you sure you want to cancel? You will keep access until the end of your billing period, but it will not auto-renew."
        confirmText="Yes, Cancel Plan"
        onConfirm={handleCancelSubscription}
        type="danger"
        modalIcon={AlertTriangle}
        isLoading={isApiLoading}
      />
      <InvoiceModal
        isOpen={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        onSubmit={submitInvoice}
        isLoading={invoiceMutation.isPending}
      />

      <ActionModal
        isOpen={modalType === 'unpause'}
        onClose={() => setModalType(null)}
        title="Unpause Subscription"
        description="This will immediately restore your subscription and billing cycle."
        confirmText="Unpause Now"
        onConfirm={handleUnpauseSubscription}
        type="success"
        modalIcon={PlayCircle}
        isLoading={isApiLoading}
      />

      <ActionModal
        isOpen={modalType === 'pause'}
        onClose={() => setModalType(null)}
        title="Pause Subscription"
        description="Need a break? You can pause your subscription. Your data will be kept safe, and you won't be billed until you unpause."
        confirmText="Pause Subscription"
        onConfirm={handlePauseSubscription}
        type="warning"
        modalIcon={PauseCircle}
        isLoading={isApiLoading}
      />

      <ActionModal
        isOpen={modalType === 'revoke'}
        onClose={() => setModalType(null)}
        title="Revoke Cancellation?"
        description="This will remove the cancellation request. Your subscription will renew automatically at the end of the period."
        confirmText="Keep My Plan"
        onConfirm={handleRevokeCancellation}
        type="neutral"
        modalIcon={RotateCcw}
        isLoading={isApiLoading}
      />

      <div className="relative min-h-screen bg-slate-50 font-[Poppins] py-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Subscription
            </h1>
            <p className="text-slate-500 mt-2">
              View details and manage your billing preferences.
            </p>
          </div>

          {/* 🚀 OPTIMISTIC UI BANNER 🚀 */}
          {pendingAction && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-blue-800">
                  Updating Subscription...
                </h4>
                <p className="text-sm text-blue-600">
                  We are processing your request with the payment provider. This
                  may take a few seconds.
                </p>
              </div>
            </div>
          )}

          {/* MAIN CARD */}
          <div
            className={`bg-white rounded-[2rem] overflow-hidden border transition-all duration-300 ${cardBorderClass} ${cardShadowClass}`}
          >
            {/* Top Section */}
            <div
              className={`p-8 md:p-10 border-b border-slate-100 ${
                isGracePeriod
                  ? 'bg-orange-50/30'
                  : 'bg-gradient-to-br from-white to-slate-50/50'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div
                    className={`p-4 rounded-full shadow-sm ${
                      currentPlanDetails?.name === 'Premium'
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    <PlanIcon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h2 className="text-2xl font-bold text-slate-900">
                        {currentPlanDetails?.name} Plan
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeClass}`}
                      >
                        {statusText}
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium">
                      ${currentPlanDetails?.price}/
                      {currentPlanDetails?.billingCycle === 'Year'
                        ? 'year'
                        : 'month'}
                    </p>
                  </div>
                </div>

                {/* Date Display */}
                {!isFree && !isExpired && (
                  <div className="flex flex-col items-end">
                    <p className="text-sm text-slate-400 font-medium mb-1">
                      {isGracePeriod ? 'Access Ends On' : 'Next Billing Date'}
                    </p>
                    <div
                      className={`flex items-center gap-2 font-semibold bg-white px-4 py-2 rounded-xl border shadow-sm ${
                        isGracePeriod
                          ? 'border-orange-200 text-orange-700'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <Calendar
                        className={`w-4 h-4 ${
                          isGracePeriod ? 'text-orange-500' : 'text-pink-500'
                        }`}
                      />
                      {subscription?.renewsAt
                        ? new Date(subscription.renewsAt).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Section: Features */}
            {!isExpired && (
              <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{currentPlanDetails?.features[0]}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{currentPlanDetails?.features[1]}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Section: Actions */}
            <div className="p-8 md:p-10">
              {/* --- BRANCH 1: FREE PLAN --- */}
              {isFree ? (
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-pink-200">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Unlock Full Potential
                  </h3>
                  <Link
                    to="/plans"
                    className="group relative inline-flex items-center justify-center px-8 py-3.5 mt-4 text-base font-bold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-slate-800"
                  >
                    Upgrade Now
                  </Link>
                </div>
              ) : isExpired ? (
                /* --- BRANCH 2: EXPIRED --- */
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Subscription Expired
                  </h3>
                  <Link
                    to="/plans"
                    className="group relative inline-flex items-center justify-center px-8 py-3.5 mt-4 text-base font-bold text-white transition-all duration-200 bg-emerald-600 rounded-full hover:bg-emerald-700"
                  >
                    Renew Subscription
                  </Link>
                </div>
              ) : (
                /* --- BRANCH 3: SUBSCRIPTION MANAGEMENT --- */
                <>
                  {/* Grace Period Banner */}
                  {isGracePeriod && (
                    <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-orange-800 mb-1">
                          Subscription Cancelled
                        </h4>
                        <p className="text-sm text-orange-700 leading-relaxed">
                          You’ll keep access until{' '}
                          <strong>
                            {new Date(
                              subscription.renewsAt
                            ).toLocaleDateString()}
                          </strong>
                          . Revoke cancellation anytime to continue.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Paused Banner */}
                  {isPaused && (
                    <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                      <PauseCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-amber-800 mb-1">
                          Billing is Paused
                        </h4>
                        <p className="text-sm text-amber-700 leading-relaxed">
                          You won’t be charged until you unpause. Full access
                          will be restored immediately upon unpausing.
                        </p>
                      </div>
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
                    Subscription Actions
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. Download Invoice */}
                    <button
                      onClick={() => {
                        handleDownloadInvoice();
                      }}
                      // disabled={
                      //   invoiceMutation.isPending ||
                      //   !subscription?.order_id ||
                      //   pendingAction !== null
                      // }
                      className={`group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/30 transition-all duration-300 ${
                        pendingAction ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                          <Download className="w-5 h-5 text-slate-600 group-hover:text-pink-500" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-slate-900">
                            Invoices
                          </p>
                          <p className="text-xs text-slate-500">Download PDF</p>
                          <p className="text-xs text-slate-500">
                            {subscription?.order_id
                              ? 'Download PDF'
                              : 'Invoice not ready yet'}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* 2. Customer Portal */}
                    {subscription?.customerPortalUrl && !isPaused && (
                      <button
                        onClick={handlePortalRedirect}
                        disabled={pendingAction !== null}
                        className={`group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 ${
                          pendingAction ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                            <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-blue-500" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-slate-900">
                              Customer Portal
                            </p>
                            <p className="text-xs text-slate-500">
                              Update payment methods
                            </p>
                          </div>
                        </div>
                      </button>
                    )}

                    {/* --- DYNAMIC ACTION BUTTONS --- */}

                    {/* SCENARIO A: PAUSED -> UNPAUSE */}
                    {isPaused && (
                      <button
                        onClick={() => setModalType('unpause')}
                        disabled={pendingAction !== null}
                        className={`group flex items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 col-span-1 md:col-span-2 ${
                          pendingAction ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                            <PlayCircle className="w-5 h-5 text-emerald-700" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-emerald-900">
                              Unpause Subscription
                            </p>
                            <p className="text-xs text-emerald-600">
                              Resume billing and regain access
                            </p>
                          </div>
                        </div>
                      </button>
                    )}

                    {/* SCENARIO B: GRACE PERIOD -> REVOKE */}
                    {isGracePeriod && (
                      <button
                        onClick={() => setModalType('revoke')}
                        disabled={pendingAction !== null}
                        className={`group flex items-center justify-between p-4 cursor-pointer rounded-xl border border-slate-900 bg-slate-900 hover:bg-slate-800 hover:shadow-lg transition-all duration-300 col-span-1 md:col-span-2 ${
                          pendingAction ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-700 rounded-lg transition-colors">
                            <RotateCcw className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-white">
                              Revoke Cancellation
                            </p>
                            <p className="text-xs text-slate-300">
                              Continue subscription (Undo cancel)
                            </p>
                          </div>
                        </div>
                      </button>
                    )}

                    {/* SCENARIO C: ACTIVE -> PAUSE + CANCEL */}
                    {isActive && (
                      <>
                        <button
                          onClick={() => setModalType('pause')}
                          disabled={pendingAction !== null}
                          className={`group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all duration-300 ${
                            pendingAction ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                              <PauseCircle className="w-5 h-5 text-slate-600 group-hover:text-amber-500" />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-slate-900">
                                Pause Subscription
                              </p>
                              <p className="text-xs text-slate-500">
                                Temporarily stop billing
                              </p>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setModalType('cancel')}
                          disabled={pendingAction !== null}
                          className={`group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50/30 transition-all duration-300 ${
                            pendingAction ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                              <XCircle className="w-5 h-5 text-slate-600 group-hover:text-red-500" />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
                                Cancel Subscription
                              </p>
                              <p className="text-xs text-slate-500">
                                Stop billing & lose access
                              </p>
                            </div>
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* Footer Section */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {isGracePeriod && subscription?.renewsAt
                    ? `Access ends on ${new Date(
                        subscription.renewsAt
                      ).toLocaleDateString()}`
                    : isExpired
                    ? `Subscription expired`
                    : `Member since ${new Date(
                        subscription?.createdAt || Date.now()
                      ).getFullYear()}`}
                </p>
                <Link
                  to="/plans"
                  className="text-pink-500 hover:text-pink-600 font-semibold hover:underline"
                >
                  View other plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageSubscription;
