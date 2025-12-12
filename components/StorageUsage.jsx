import { FiHardDrive } from 'react-icons/fi';
import { formatFileSize } from '../utility/functions';

const StorageUsage = ({ usedStorage, maxStorage }) => {
  const usedFormatted = formatFileSize(usedStorage);
  const maxFormatted = formatFileSize(maxStorage);

  console.log({ usedStorage, maxStorage });
  const percentage = (usedStorage / maxStorage) * 100;
  const percentageText = percentage.toFixed(2);

  const remainingBytes = maxStorage - usedStorage;
  const remainingFormatted = formatFileSize(remainingBytes);

  // COLOR LOGIC
  let blobColor = '';
  let statusText = '';
  let statusColor = '';

  if (percentage >= 100) {
    blobColor = 'bg-rose-500';
    statusText = 'Storage full';
    statusColor = 'text-rose-600';
  } else if (percentage >= 75) {
    blobColor = 'bg-amber-500';
    statusText = 'Storage almost full';
    statusColor = 'text-amber-600';
  } else {
    blobColor = 'bg-emerald-400';
    statusText = 'Storage is healthy';
    statusColor = 'text-emerald-600';
  }

  return (
    <div className="relative bg-white p-6 rounded-xl border border-gray-100 overflow-hidden">
      {/* 🔥 EXACT Blob Glow You Wanted */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none ${blobColor}`}
      />

      <div className="flex items-center gap-2 relative z-10">
        <FiHardDrive size={20} />
        <h2 className="text-xl font-bold text-gray-800 mb-1">Storage Usage</h2>
      </div>

      <p className="text-gray-600 text-sm relative z-10">
        {usedFormatted} of {maxFormatted} used
      </p>

      {/* Status Row */}
      <div className="flex items-center justify-between relative z-10">
        <div className={`flex items-center gap-2 mt-1 ${statusColor}`}>
          <div className={`w-2 h-2 rounded-full ${blobColor}`} />
          {statusText}
        </div>

        {/* Badge */}
        <div className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-900 text-xs rounded-full font-bold">
          {percentageText}% used
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mt-3 overflow-hidden relative z-10">
        <div
          className={`h-3 rounded-full transition-all ${blobColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Bottom Stats */}
      <div className="flex justify-between mt-4 text-sm relative z-10">
        <div className="text-gray-700 font-semibold">
          Used Space <br />
          <span className="text-gray-900">{usedFormatted}</span>
        </div>
        <div className="text-gray-700 font-semibold">
          Available Space <br />
          <span className="text-gray-900">{remainingFormatted}</span>
        </div>
      </div>
    </div>
  );
};

export default StorageUsage;
