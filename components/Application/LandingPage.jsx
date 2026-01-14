import React, { useState } from 'react';
import {
  Check,
  Crown,
  Sparkles,
  Zap,
  Star,
  ShieldCheck,
  Menu,
  X,
  Shield,
  Search,
  Cloud,
  Share2,
  Settings,
  HardDrive,
  ArrowRight,
  FileText,
  FileSpreadsheet,
  File,
  Info,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSectionBento from './HeroSectionBento';
import HowItWorksLight from './HowItWorksLight';
import FeaturesLight from './FeaturesLight';
import IntegrationDarkCard from './IntegrationDarkCard';

/* --- DATA FOR PRICING (Adapted from your snippet) --- */
const monthlyPlans = [
  {
    id: 'free-monthly',
    name: 'Free',
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
    id: 'pro-monthly',
    name: 'Pro',
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
    id: 'premium-monthly',
    name: 'Premium',
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

const yearlyPlans = [
  {
    id: 'free-yearly',
    name: 'Free',
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
    id: 'pro-yearly',
    name: 'Pro',
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
    id: 'premium-yearly',
    name: 'Premium',
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

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const currentPlans = billingCycle === 'monthly' ? monthlyPlans : yearlyPlans;
  const navigate = useNavigate();
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-pink-100 selection:text-pink-600">
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 font-extrabold text-pink-500 text-xl tracking-tight cursor-pointer"
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="w-8 h-8  flex items-center justify-center ">
              <img
                src="https://res.cloudinary.com/dzezofvz3/image/upload/v1768412064/logo.png"
                alt="logo"
                className="w-14"
              />
            </div>
            <span className="text-pink-400">storifyy</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'How it works', 'Pricing'].map((item) => (
              <button
                key={item}
                onClick={() =>
                  scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))
                }
                className="text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4 [&>button]:cursor-pointer">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 absolute w-full px-4 py-4 flex flex-col gap-4 shadow-xl">
            {['Features', 'How it works', 'Pricing'].map((item) => (
              <button
                key={item}
                onClick={() =>
                  scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))
                }
                className="text-left font-medium text-slate-600"
              >
                {item}
              </button>
            ))}
            <hr className="border-slate-100" />
            <button className="text-left font-semibold text-slate-600">
              Sign in
            </button>
            <button className="w-full py-3 bg-pink-500 text-white font-bold rounded-lg">
              Get Started
            </button>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <HeroSectionBento />

      {/* --- FEATURES SECTION --- */}
      <section id="features">
        <FeaturesLight />
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works">
        <HowItWorksLight />
      </section>

      {/* --- GOOGLE DRIVE IMPORT SECTION --- */}
      <section className="py-24 bg-white overflow-hidden">
        <IntegrationDarkCard />
      </section>

      {/* --- PRICING SECTION (Logic Adapted) --- */}
      <section id="pricing" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-pink-600 font-bold tracking-wider uppercase text-sm mb-3">
              Flexible Pricing
            </h2>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Plans that grow with you
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Simple, transparent pricing. No hidden fees.{' '}
              <br className="hidden md:block" /> Start for free and upgrade when
              you need more power.
            </p>

            {/* Toggle Switch */}
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

              return (
                <div
                  key={plan.name}
                  className={`relative group flex flex-col bg-white rounded-[2rem] transition-all duration-300 
                  ${
                    isPopular
                      ? 'lg:scale-110 z-10 shadow-2xl border-2 border-pink-400 shadow-pink-200/50'
                      : 'border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1'
                  }`}
                >
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
                      className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
                      ${
                        isPopular
                          ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5'
                          : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5'
                      }`}
                    >
                      {isFreePlan ? 'Get Started Free' : 'Upgrade Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
            Ready to store your stuff?
          </h2>
          <p className="text-xl text-slate-500 mb-10">
            Join thousands of users who trust storifyy for their cloud storage
            needs. Start with 500MB free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-slate-900 text-white text-lg font-bold rounded-full hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl">
              Create Free Account
            </button>
          </div>
          <p className="mt-6 text-sm text-slate-400 font-medium">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 text-xl mb-4">
                <div className="w-8 h-8  rounded-lg flex items-center justify-center text-white">
                  <img
                    src="https://res.cloudinary.com/dzezofvz3/image/upload/v1768412064/logo.png"
                    alt="logo"
                    className="w-14"
                  />
                </div>
                <span className="text-pink-400">storifyy</span>
              </div>
              <p className="text-slate-500 max-w-xs leading-relaxed">
                Secure cloud storage for all your important files and memories.
                Built for privacy and speed.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-pink-600 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600 transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600 transition-colors">
                    Google Drive Import
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-of-service">Terms of Service</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Get Started</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <Link
                    to="/login"
                    className="hover:text-pink-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-pink-600 transition-colors"
                  >
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 text-center text-sm text-slate-400">
            <p>&copy; 2026 storifyy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Helper Components ---

const FeatureCard = ({ icon, color, title, desc }) => (
  <div className="group p-8 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-300">
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-md transition-transform group-hover:scale-110 ${color}`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-pink-600 transition-colors">
      {title}
    </h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const Step = ({ number, title, desc }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center justify-center text-2xl font-bold text-slate-900 mb-6 relative">
      {number}
      <div className="absolute -inset-1 bg-gradient-to-br from-pink-400 to-purple-600 opacity-20 blur-lg rounded-2xl -z-10"></div>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed max-w-xs">{desc}</p>
  </div>
);

export default LandingPage;
