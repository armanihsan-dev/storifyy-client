import React, { useState } from 'react';
import { Share2, Mail, Eye, Edit3, Check, Users, X } from 'lucide-react';
// Assuming you are using Shadcn/Radix UI primitive components for Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'; // Adjust path as needed
import { Button } from '@/components/ui/button'; // Adjust path as needed

const ShareDirectoryDialog = ({
  isShareOpen,
  setIsShareOpen,
  id,
  shareDirectoryByEmail,
}) => {
  const [email, setEmail] = useState('');
  const [accessType, setAccessType] = useState('viewer'); // 'viewer' | 'editor'
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await shareDirectoryByEmail(email, id, accessType);
      setIsShareOpen(false);
      setEmail('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl">
        {/* --- Header Section with Gradient --- */}
        <div className="relative bg-slate-50 p-6 pb-8 border-b border-slate-100">
          <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-rose-500">
              <Users size={24} />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-slate-800 tracking-tight">
                Invite Collaborators
              </DialogTitle>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Securely share this folder via email
              </p>
            </div>
          </DialogHeader>
        </div>

        {/* --- Body Section --- */}
        <div className="p-6 space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="arman@company.com"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400 transition-all font-medium placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">
              Access Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Viewer Option */}
              <div
                onClick={() => setAccessType('viewer')}
                className={`relative cursor-pointer p-2 rounded-xl border-2 transition-all duration-200 flex flex-col gap-2 ${
                  accessType === 'viewer'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div
                    className={`p-2 rounded-lg ${
                      accessType === 'viewer'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Eye size={18} />
                  </div>
                  {accessType === 'viewer' && (
                    <div className="text-emerald-500">
                      <Check size={18} />
                    </div>
                  )}
                </div>
                <div>
                  <h4
                    className={`font-bold text-sm ${
                      accessType === 'viewer'
                        ? 'text-emerald-700'
                        : 'text-slate-700'
                    }`}
                  >
                    Viewer
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Can view and download only.
                  </p>
                </div>
              </div>

              {/* Editor Option */}
              <div
                onClick={() => setAccessType('editor')}
                className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col gap-2 ${
                  accessType === 'editor'
                    ? 'border-pink-400 bg-rose-50/50'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div
                    className={`p-2 rounded-lg ${
                      accessType === 'editor'
                        ? 'bg-rose-100 text-pink-400'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Edit3 size={18} />
                  </div>
                  {accessType === 'editor' && (
                    <div className="text-pink-500">
                      <Check size={18} />
                    </div>
                  )}
                </div>
                <div>
                  <h4
                    className={`font-bold text-sm ${
                      accessType === 'editor'
                        ? 'text-rose-700'
                        : 'text-slate-700'
                    }`}
                  >
                    Editor
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Can edit, rename, and delete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Footer --- */}
        <DialogFooter className="p-6 pt-2 flex flex-col-reverse sm:flex-row gap-3 bg-white">
          <Button
            variant="ghost"
            onClick={() => setIsShareOpen(false)}
            className="h-12 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            Cancel
          </Button>

          <Button
            onClick={handleShare}
            disabled={loading || !email}
            className={`h-12 rounded-xl px-6 flex items-center gap-2 font-semibold shadow-lg transition-all ${
              !email
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Share2 size={18} /> Send Invite
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDirectoryDialog;
