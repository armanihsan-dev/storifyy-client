import React from 'react';
import {
  UserPlus,
  HardDriveUpload,
  Share2,
  Info,
  CheckCircle2,
} from 'lucide-react';

const HowItWorksLight = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header with Integrated Cookie Note */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
              How Storifyy works
            </h2>
            <p className="text-lg text-slate-600">
              Three steps to secure, infinite storage.
            </p>
          </div>

          {/* Modern Status Pill for Cookies */}
          <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm text-slate-600">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </div>
            <span className="font-medium">
              Cookies required for session sync
            </span>
          </div>
        </div>

        {/* The Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* STEP 1: The Big Card (Left Side) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <UserPlus className="w-8 h-8" />
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-6xl font-black text-slate-100">01</span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Create Account
                </h3>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                Sign up in seconds. No credit card required. We instantly
                provision your personal encrypted container with 500MB free
                space.
              </p>

              {/* Fake UI Element to add depth */}
              <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 w-fit">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold text-slate-700">
                  Account verified instantly
                </span>
              </div>
            </div>

            {/* Decoration */}
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
          </div>

          {/* Right Column Container */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* STEP 2: Top Right */}
            <div className="flex-1 bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:rotate-6 transition-transform">
                  <HardDriveUpload className="w-6 h-6" />
                </div>
                <span className="text-4xl font-black text-slate-100">02</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Upload your files
              </h3>
              <p className="text-slate-500">
                Drag and drop support for all major file types. High-speed
                encryption happens in the browser.
              </p>
            </div>

            {/* STEP 3: Bottom Right */}
            <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl group hover:scale-[1.02] transition-transform duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                  <Share2 className="w-6 h-6" />
                </div>
                <span className="text-4xl font-black text-white/20">03</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Share & Access
              </h3>
              <p className="text-slate-300">
                Generate secure links with expiration dates. Access your vault
                from any device, anywhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksLight;
