import { motion } from 'framer-motion';

const FullPageLoader = ({ label = 'Loading your workspace…' }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#F8F9FD] via-white to-[#F3F4F8] overflow-hidden">
      {/* Ambient Blobs */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-rose-400/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[120px]" />

      {/* Loader Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="relative w-24 h-24 flex items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full border-[4px] border-rose-200/50" />
          <div className="absolute inset-0 rounded-full border-[4px] border-transparent border-t-rose-500 border-r-rose-400" />

          {/* Inner Glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 shadow-[0_0_30px_rgba(244,63,94,0.6)]"
          />
        </motion.div>

        {/* Brand */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-2xl font-bold tracking-tight text-slate-800"
        >
          Storifyy
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-2 text-sm font-medium text-slate-500"
        >
          {label}
        </motion.p>
      </div>
    </div>
  );
};

export default FullPageLoader;
