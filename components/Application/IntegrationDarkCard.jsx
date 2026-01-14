import React from 'react';
import {
  Cloud,
  Check,
  HardDrive,
  RefreshCcw,
  ExternalLink,
} from 'lucide-react';

const IntegrationDarkCard = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Container - Dark Card with Rounded Corners */}
        <div className="bg-[#111827] rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
          {/* Background Gradient Blurs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Left: Typography */}
          <div className="lg:w-1/2 relative z-10">
            <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-6">
              Works where <br />
              <span className="text-blue-400">you work.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-md">
              Stop manually downloading and re-uploading. Connect your Drive
              account and let our engine handle the heavy lifting.
            </p>

            {/* Horizontal Stats/Features */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg">
                <span className="block text-2xl font-bold text-white">
                  0.2s
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Sync Time
                </span>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg">
                <span className="block text-2xl font-bold text-white">
                  100%
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Secure
                </span>
              </div>
            </div>

            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 group">
              Connect Google Drive
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right: Abstract Floating Cards (The "Stack") */}
          <div className="lg:w-1/2 w-full relative h-[400px] flex items-center justify-center perspective-1000">
            {/* Back Card (Drive) */}
            <div className="absolute top-0 right-10 w-64 h-72 bg-white rounded-2xl shadow-xl transform rotate-12 opacity-80 scale-90 p-6 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <HardDrive className="text-gray-600 w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>

            {/* Middle Card (Syncing) */}
            <div className="absolute top-8 right-24 w-64 h-72 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-900/50 transform rotate-6 p-6 flex flex-col justify-between text-white z-10">
              <div className="flex justify-between items-start">
                <RefreshCcw className="w-8 h-8 animate-spin-slow" />
                <span className="text-xs font-mono bg-blue-500 px-2 py-1 rounded">
                  SYNCING
                </span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Importing...</h4>
                <p className="text-blue-200 text-sm">
                  Transferring 2 files from Drive
                </p>
              </div>
            </div>

            {/* Front Card (Success Notification) */}
            <div className="absolute bottom-10 left-10 md:left-20 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-lg z-20 flex items-center gap-4 animate-bounce-slow">
              <div className="bg-white/20 p-2 rounded-full">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Import Successful</p>
                <p className="text-xs text-emerald-100">
                  Project_Specs.doc added
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationDarkCard;
