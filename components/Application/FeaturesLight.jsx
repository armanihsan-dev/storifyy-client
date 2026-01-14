import React from 'react';
import { Shield, Search, Cloud, Share2, Settings, Zap } from 'lucide-react';

const FeaturesLight = () => {
  const features = [
    {
      title: 'Enterprise Security',
      desc: 'OAuth, 2FA, and encrypted storage protected by industry standards.',
      icon: <Shield className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-green-400',
      text: 'text-emerald-600',
    },
    {
      title: 'Intelligent Management',
      desc: 'Upload any file type. Organize with grid views and instant previews.',
      icon: <Search className="w-6 h-6" />,
      gradient: 'from-blue-500 to-cyan-400',
      text: 'text-blue-600',
    },
    {
      title: 'Cloud Integration',
      desc: 'Import from Google Drive & enjoy lightning-fast CloudFront access.',
      icon: <Cloud className="w-6 h-6" />,
      gradient: 'from-purple-500 to-pink-400',
      text: 'text-purple-600',
    },
    {
      title: 'Sharing Controls',
      desc: 'Granular permissions. Control who views or edits with logs.',
      icon: <Share2 className="w-6 h-6" />,
      gradient: 'from-pink-500 to-rose-400',
      text: 'text-pink-600',
    },
    {
      title: 'Admin Dashboard',
      desc: 'Manage users and monitor storage usage from one central place.',
      icon: <Settings className="w-6 h-6" />,
      gradient: 'from-slate-600 to-slate-400',
      text: 'text-slate-700',
    },
    {
      title: 'Global Performance',
      desc: 'Zero latency with optimized content delivery networks.',
      icon: <Zap className="w-6 h-6" />,
      gradient: 'from-amber-500 to-orange-400',
      text: 'text-amber-600',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Effects (Subtle Grid & Blur) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:54px_54px]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-200/40 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold tracking-widest uppercase text-sm mb-4">
            Why Storifyy?
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
            Engineered for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">
              Scale
            </span>{' '}
            &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">
              Security
            </span>
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We stripped away the complexity and doubled down on the features
            that actually matter to developers and teams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative p-[1px] rounded-2xl 
      bg-gradient-to-b from-slate-200 to-slate-100 
      transition-all duration-500
      focus:outline-none focus:ring-0 active:ring-0"
            >
              {/* Inner Card */}
              <div
                className="relative h-full bg-white rounded-2xl p-8 overflow-hidden
        transition-all duration-500
        group-hover:-translate-y-1
        group-hover:shadow-xl
        focus:outline-none"
              >
                {/* Soft ambient glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} 
          opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`}
                />

                {/* Icon */}
                <div
                  className={`relative w-14 h-14 rounded-full 
          bg-gradient-to-br ${feature.gradient} 
          flex items-center justify-center mb-6 
          shadow-md`}
                >
                  <div className="text-white text-xl">{feature.icon}</div>
                </div>

                <h4
                  className="text-xl font-semibold text-slate-900 mb-3 
          transition-colors duration-300 group-hover:text-slate-900"
                >
                  {feature.title}
                </h4>

                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesLight;
