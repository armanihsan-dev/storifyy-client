import React from 'react';
import {
  Cloud,
  ArrowRight,
  CheckCircle2,
  Lock,
  Download,
  MousePointerClick,
} from 'lucide-react';

const IntegrationFlow = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. Header (Centered) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-600 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Integration Active
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Bridge the gap between <br className="hidden md:block" />
            <span className="text-blue-600">Drive</span> and{' '}
            <span className="text-indigo-600">Storifyy</span>
          </h2>
          <p className="text-lg text-slate-500">
            Don't switch contexts. Pull your assets directly into your workflow
            with our secure, one-click bridge.
          </p>
        </div>

        {/* 2. The Visual "Bridge" (The Diagram) */}
        <div className="relative max-w-4xl mx-auto mb-20">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Google Side */}
            <div className="text-center relative z-10 group">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                {/* Fake Google Logo */}
                <div className="w-12 h-12 rounded-full border-[6px] border-blue-500 border-t-red-500 border-r-yellow-400 border-l-green-500"></div>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Google Drive</h3>
              <p className="text-sm text-slate-400">Source</p>
            </div>

            {/* The Connector (Animated) */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 mb-4">
                <Lock className="w-3 h-3 text-slate-400" />
                <span className="text-xs font-mono text-slate-500">
                  TLS_ENCRYPTED_TUNNEL
                </span>
              </div>
              {/* Dashed Line */}
              <div className="w-full h-0.5 border-t-2 border-dashed border-slate-300 relative">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full animate-[moveRight_2s_linear_infinite]"></div>
              </div>
              <div className="mt-4">
                <div className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg shadow-blue-200 cursor-pointer transition-colors">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Storifyy Side */}
            <div className="text-center relative z-10 group">
              <div className="w-24 h-24 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-200 flex items-center justify-center mx-auto mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                <Cloud className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Storifyy</h3>
              <p className="text-sm text-slate-400">Destination</p>
            </div>

            {/* Decor BG */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent opacity-50"></div>
          </div>
        </div>

        {/* 3. The Features (Grid instead of List) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              icon: <MousePointerClick />,
              title: 'Selective Import',
              desc: 'Pick only what you need.',
            },
            {
              icon: <CheckCircle2 />,
              title: 'User Consent',
              desc: '100% permission based.',
            },
            {
              icon: <Download />,
              title: 'Auto-Download',
              desc: 'Saves directly to server.',
            },
            {
              icon: <Lock />,
              title: 'Private Access',
              desc: 'Tokens never shared.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all cursor-default"
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes moveRight {
          0% {
            left: 0;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default IntegrationFlow;
