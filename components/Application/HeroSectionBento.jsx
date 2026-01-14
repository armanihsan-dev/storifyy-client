import React from 'react';
import {
  ArrowRight,
  HardDrive,
  Share2,
  ShieldCheck,
  Globe,
  Smartphone,
  Zap,
  LayoutGrid,
} from 'lucide-react';

const HeroSectionBento = () => {
  return (
    <section className="min-h-screen bg-[#F8FAFC] text-slate-900 py-24 px-4 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-700">
      {/* Subtle Background Gradients - Light & Airy */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3 -z-10" />
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
              Live Preview
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Organize your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
              digital universe.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            A unified workspace that brings your cloud storage, team
            collaboration, and asset management into one stunning interface.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="group bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20">
              Get Started Free
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Bento Grid Layout - 12 Column */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:auto-rows-[180px]">
          {/* Card 1: Storage Viz - Large Square */}
          <div className="md:col-span-4 md:row-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                  <HardDrive size={24} />
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                  +24% Growth
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Smart Storage
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Automatically optimizes your files for speed and efficiency.
                </p>

                {/* Simulated Chart */}
                <div className="space-y-4">
                  <div className="flex items-end gap-2 h-24 justify-between px-2">
                    {[40, 70, 45, 90, 60, 80].map((h, i) => (
                      <div
                        key={i}
                        className="w-full bg-slate-100 rounded-t-md relative overflow-hidden group-hover:bg-indigo-50 transition-colors"
                      >
                        <div
                          className="absolute bottom-0 w-full bg-indigo-600 rounded-t-md transition-all duration-1000 ease-out"
                          style={{ height: `${h}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-medium pt-2 border-t border-slate-100">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Security - Tall Vertical (Contrast Card) */}
          <div className="md:col-span-3 md:row-span-2 bg-slate-900 rounded-3xl p-6 relative overflow-hidden text-white flex flex-col justify-between group shadow-xl shadow-slate-900/20">
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(#4f46e5 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            ></div>

            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-4 border border-slate-700">
                <ShieldCheck size={20} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Vault Security</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Enterprise-grade encryption by default. Your keys, your data.
              </p>
            </div>

            {/* Code Snippet Visual */}
            <div className="relative z-10 mt-4 bg-black/50 rounded-xl p-4 border border-slate-700/50 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <div className="space-y-2 font-mono text-[10px] text-slate-300">
                <div className="flex gap-2">
                  <span className="text-purple-400">auth</span>.
                  <span className="text-blue-400">verify</span>(token)
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-400">200 OK</span> - Access
                  Granted
                </div>
                <div className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div className="w-2/3 h-full bg-emerald-500 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Global/Map - Wide Rectangle */}
          <div className="md:col-span-5 md:row-span-1 bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden group hover:border-indigo-200 transition-colors">
            <div className="relative z-10 max-w-[60%]">
              <div className="flex items-center gap-2 mb-3 text-indigo-600">
                <Globe size={20} />
                <span className="text-xs font-bold tracking-wider uppercase bg-white px-2 py-0.5 rounded-md shadow-sm">
                  Global
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Edge Network</h3>
              <p className="text-sm text-slate-500 mt-1">
                Lightning fast access from anywhere on earth.
              </p>
            </div>

            {/* Visual Abstract Map */}
            <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-40 h-40 opacity-80">
              <div className="w-full h-full border-[20px] border-indigo-100/50 rounded-full animate-[spin_10s_linear_infinite] border-t-indigo-200"></div>
              <div className="absolute inset-0 m-auto w-24 h-24 border-[15px] border-indigo-200/50 rounded-full animate-[spin_8s_linear_infinite_reverse] border-b-indigo-300"></div>
            </div>
          </div>

          {/* Card 5: Mobile - Small Square */}
          <div className="md:col-span-5 md:row-span-1 w-full bg-indigo-600 rounded-3xl p-6 relative group overflow-hidden text-white shadow-lg shadow-indigo-500/30">
            <div className="relative z-10">
              <Smartphone size={28} className="mb-3 text-indigo-200" />
              <h3 className="font-bold text-lg">iOS & Android</h3>
              <p className="text-xs text-indigo-100">Sync on the go.</p>
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          </div>

          {/* Card 6: Dashboard Mockup - Full Width */}
          <div className="md:col-span-12 md:row-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group">
            {/* Mock Browser Header */}
            <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300 group-hover:bg-red-400 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300 group-hover:bg-yellow-400 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300 group-hover:bg-green-400 transition-colors"></div>
              </div>
              <div className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-400 flex-1 max-w-sm flex justify-between items-center shadow-sm">
                <span>storifyy.com/dashboard/files</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* UI Body */}
            <div className="flex-1 bg-slate-50/50">
              <img
                src="../../github/images/home.png"
                className="w-full h-full"
              />
              {/* Fade Overlay */}
              {/* <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionBento;
