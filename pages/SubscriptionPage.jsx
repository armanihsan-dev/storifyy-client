import {
  Check,
  Crown,
  Sparkles,
  Zap,
  Star,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { createSubscriptionCheckout } from '../API/lemonSqueezy';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMySubscription } from '@/hooks/otherHooks';
import { BASE_URL } from '../utility/Server';
import AuthDropDown from '../components/AuthDropDown';


// --- DATA CONSTANTS (Same as before) ---
export const monthlyPlans = [
  {
    lsId: 1193383,
    id: { test: 'free-monthly-001', live: 'free-monthly-001' },
    name: 'Free',
    tagline: 'Starter Plan',
    bestFor: 'Personal users to try the platform',
    billingCycle: 'Month',
    price: 0,
    icon: Sparkles,
    features: [
      '500 MB secure storage',
      'File upload limit: 100 MB',
      'Access from 1 device',
      'Standard download speed',
      'Basic email support',
    ],
  },
  {
    lsId: 1193389,
    id: { test: 'plan_Ra0GqWQ6p0ffYM', live: 'plan_RWtFksDzZOsg2V' },
    name: 'Pro',
    billingCycle: 'Month',
    tagline: 'For Students & Freelancers',
    bestFor: 'Freelancers & teams needing space',
    price: 4,
    icon: Zap,
    features: [
      '200 GB secure storage',
      'File upload limit: 50 GB',
      'Access from up to 3 devices',
      'Priority upload/download speed',
      'Email & chat support',
    ],
    popular: true,
  },
  {
    lsId: 1193390,
    id: { test: 'plan_Ra0Hyby0MmmZyU', live: 'plan_RWtGxMLUNKVu35' },
    name: 'Premium',
    billingCycle: 'Month',
    tagline: 'For Professionals & Creators',
    bestFor: 'Creators handling large media files',
    price: 9,
    icon: Crown,
    features: [
      '2 TB secure storage',
      'File upload limit: 100 GB',
      'Access from up to 3 devices',
      'Priority upload/download speed',
      'Priority customer support',
    ],
  },
];

export const yearlyPlans = [
  {
    lsId: 1193391,
    id: { test: 'free-yearly-001', live: 'free-yearly-001' },
    name: 'Free',
    billingCycle: 'Year',
    tagline: 'Starter Plan',
    bestFor: 'Personal users to try the platform',
    price: 0,
    icon: Sparkles,
    features: [
      '500 MB secure storage',
      'File upload limit: 100 MB',
      'Access from 1 device',
      'Standard download speed',
      'Basic email support',
    ],
  },
  {
    lsId: 1193392,
    id: { test: 'plan_Ra0HCHX7tNXrQl', live: 'plan_RWtGEM0EVl0gJE' },
    name: 'Pro',
    billingCycle: 'Year',
    tagline: 'For Students & Freelancers',
    bestFor: 'Freelancers & teams needing space',
    price: 39,
    monthlyEquivalent: 3.25,
    originalMonthly: 4,
    icon: Zap,
    features: [
      '200 GB secure storage',
      'File upload limit: 2 GB',
      'Access from up to 3 devices',
      'Priority upload/download speed',
      'Email & chat support',
    ],
    popular: true,
  },
  {
    lsId: 1193395,
    id: { test: 'plan_Ra0IGCFRabuW1y', live: 'plan_RWtGgZRP6VnyUc' },
    name: 'Premium',
    billingCycle: 'Year',
    tagline: 'For Professionals & Creators',
    bestFor: 'Creators handling large media files',
    price: 89,
    monthlyEquivalent: 7.41,
    originalMonthly: 9,
    icon: Crown,
    features: [
      '2 TB secure storage',
      'File upload limit: 10 GB',
      'Access from up to 3 devices',
      'Priority upload/download speed',
      'Priority customer support',
    ],
  },
];

export const Header = () => {
  return (
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
};

const Plans = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const { data: subscription, isLoading } = useMySubscription();
  console.log(subscription);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentPlans = billingCycle === 'monthly' ? monthlyPlans : yearlyPlans;
  const userVariantId = subscription?.variantId;

  // --- 1. DETERMINE GLOBAL SUBSCRIPTION STATE ---
  const isGracePeriod =
    subscription?.status === 'cancelled' &&
    subscription?.renewsAt &&
    new Date(subscription.renewsAt) > new Date();

  // "Has Valid Sub" means Active OR Paused OR Grace Period. Not Expired.
  const hasValidSubscription =
    subscription && subscription.status !== 'expired';

  const handleSubmit = async (variantId, isFreePlan) => {
    // If trying to get free plan but currently have a valid sub (even if cancelled/grace)
    if (isFreePlan && hasValidSubscription) {
      if (isGracePeriod) {
        toast.success('Your plan is cancelled and will expire soon.');
      } else {
        toast.error('Please cancel your current subscription first.');
      }
      return;
    }

    // Already on free, clicking free
    if (isFreePlan && !hasValidSubscription) {
      toast.success('You are already on the Free plan.');
      return;
    }

    try {
      setLoadingPlanId(variantId);
      const checkoutUrl = await createSubscriptionCheckout(variantId);
      window.location.href = checkoutUrl;
    } catch (error) {
      toast.error('Failed to start checkout.');
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-slate-50 font-[Poppins] py-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="text-center mb-20">
            <h2 className="text-pink-600 font-bold tracking-wider uppercase text-sm mb-3">
              Flexible Pricing
            </h2>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Plans that grow with you
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Simple, transparent pricing. No hidden fees.
              <br className="hidden md:block" /> Start for free and upgrade when
              you need more power.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4">
              <div className="relative bg-white p-1.5 rounded-full inline-flex border border-slate-200 shadow-sm">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                    billingCycle === 'monthly'
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                    billingCycle === 'yearly'
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Yearly
                </button>
                <div
                  className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-slate-900 rounded-full shadow-md transition-all duration-300 ease-spring ${
                    billingCycle === 'monthly'
                      ? 'left-1.5'
                      : 'left-[calc(50%+3px)]'
                  }`}
                />
              </div>
              <div
                className={`transition-all duration-500 ${
                  billingCycle === 'yearly'
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-2'
                }`}
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <Sparkles className="w-3 h-3 fill-emerald-600" />
                  Save ~18% with yearly billing
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto items-center">
            {currentPlans.map((plan) => {
              const Icon = plan.icon;
              const isYearly = billingCycle === 'yearly';
              const isPopular = plan.popular;
              const isFreePlan = plan.price === 0;

              // --- 2. FIXED CURRENT PLAN LOGIC ---
              // It is the current plan if:
              // A) The user has a subscription AND the IDs match (Active, Paused, or Grace)
              // B) The user does NOT have a valid subscription AND it is the Free plan
              const isCurrentPlan = hasValidSubscription
                ? userVariantId === plan.lsId
                : isFreePlan;

              // --- 3. DYNAMIC CARD STYLING ---
              // Grace Period = Orange/Amber Theme
              // Active = Green/Emerald Theme
              let cardBorderClass = 'border-slate-200';
              let cardRingClass = '';
              let blobColorClass = '';
              let badgeColorClass = '';
              let badgeText = '';
              let badgeIcon = null;
              const endDate = new Date(
                subscription.renewsAt
              ).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              if (isCurrentPlan) {
                if (isFreePlan) {
                  // Free Plan Active
                  cardRingClass = 'ring-4 ring-green-100 border-green-500';
                  blobColorClass = 'bg-emerald-500';
                  badgeColorClass =
                    'bg-green-50 text-green-700 border-green-200';
                  badgeText = 'Current';
                  badgeIcon = <ShieldCheck className="w-3 h-3" />;
                } else if (isGracePeriod) {
                  // Paid Plan - Cancelled/Grace
                  cardRingClass = 'ring-4 ring-orange-100 border-orange-500';
                  blobColorClass = 'bg-orange-500'; // Orange blob
                  badgeColorClass =
                    'bg-orange-50 text-orange-700 border-orange-200';
                  badgeText = `Active until ${endDate}`;
                  badgeIcon = <AlertCircle className="w-3 h-3" />;
                } else {
                  // Paid Plan - Active
                  cardRingClass = 'ring-4 ring-green-100 border-green-500';
                  blobColorClass = 'bg-emerald-500';
                  badgeColorClass =
                    'bg-green-50 text-green-700 border-green-200';
                  badgeText = 'Current';
                  badgeIcon = <ShieldCheck className="w-3 h-3" />;
                }
              }

              return (
                <div
                  key={plan.name}
                  className={`relative group flex flex-col bg-white rounded-[2rem] transition-all duration-300 
                  ${
                    isPopular
                      ? 'lg:scale-110 z-10 shadow-2xl border-2 border-pink-400 shadow-pink-200/50'
                      : `border shadow-xl hover:shadow-2xl hover:-translate-y-1 ${cardBorderClass}`
                  }
                  ${cardRingClass}
                `}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
                    {isCurrentPlan && (
                      <div
                        className={`absolute top-11 w-64 h-64 rounded-full blur-[80px] opacity-20 translate-x-1/3 -translate-y-1/3 ${blobColorClass}`}
                      />
                    )}
                  </div>

                  {isPopular && (
                    <div className="absolute self-center -top-5 mx-auto w-fit z-20">
                      <span className="bg-pink-400 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg tracking-wide flex items-center gap-1.5">
                        <Star className="w-3 h-3 fill-current" />
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="p-8 xl:p-10 flex-1 flex flex-col relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div
                        className={`p-3 rounded-full ${
                          isPopular
                            ? 'bg-pink-100 text-pink-600'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="w-8 h-8" strokeWidth={1.5} />
                      </div>

                      {/* --- 4. BADGE DISPLAY --- */}
                      {isCurrentPlan && (
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${badgeColorClass}`}
                        >
                          {badgeIcon} {badgeText}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900">
                      {plan.name}
                    </h3>
                    <p className="text-slate-500 text-sm mt-2 mb-6 min-h-[40px] leading-relaxed">
                      {plan.bestFor}
                    </p>

                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                          $
                          {isYearly && !isFreePlan
                            ? plan.monthlyEquivalent
                            : plan.price}
                        </span>
                        <span className="text-slate-400 font-medium text-lg">
                          /mo
                        </span>
                      </div>
                      {isYearly && !isFreePlan && (
                        <p className="text-xs text-slate-400 mt-2 font-medium">
                          Billed ${plan.price} yearly (save $
                          {plan.originalMonthly * 12 - plan.price})
                        </p>
                      )}
                    </div>

                    <div className="w-full h-px bg-slate-100 mb-8" />

                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 min-w-[1.25rem] h-5 rounded-full flex items-center justify-center ${
                              isPopular
                                ? 'bg-pink-100 text-pink-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                          <span className="text-sm text-slate-600 font-medium leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubmit(plan.lsId, isFreePlan)}
                      disabled={isCurrentPlan || loadingPlanId === plan.lsId}
                      className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
                      ${
                        isCurrentPlan
                          ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200'
                          : isPopular
                          ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5'
                          : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5'
                      }
                    `}
                    >
                      {loadingPlanId === plan.lsId ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : isCurrentPlan ? (
                        isGracePeriod ? (
                          'Expires Soon'
                        ) : (
                          'Current Plan'
                        )
                      ) : isFreePlan ? (
                        'Get Started Free'
                      ) : (
                        'Upgrade Now'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center border-t border-slate-200 pt-10">
            <p className="text-slate-500 text-sm">
              Need help choosing?{' '}
              <a
                href="#"
                className="text-pink-600 font-semibold hover:underline"
              >
                Contact our sales team
              </a>
            </p>
            <p className="text-center text-slate-400 text-sm mt-12">
              All plans include 24/7 support and cancel anytime guarantee.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Plans;
