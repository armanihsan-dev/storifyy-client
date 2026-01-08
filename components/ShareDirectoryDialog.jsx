import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Check, Eye, Edit3, Share2, Search, X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { fetchShareableUsers } from '../API/userAPI';
import { shareDirectoryByEmail } from '../API/share';

const ShareDirectoryDialog = ({ open, onOpenChange, directoryId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');
  const [access, setAccess] = useState('viewer');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['shareable-users', search],
    queryFn: fetchShareableUsers,
    enabled: open,
    keepPreviousData: true,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-[720px]
          max-h-[80vh]
          p-0
          gap-0
          overflow-hidden
          rounded-2xl
          flex
          flex-col
        "
      >
        {/* ───────── HEADER ───────── */}
        <div className="p-6 border-b bg-white">
          <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <Users size={20} />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Share Directory
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Invite users and set access
              </p>
            </div>
          </DialogHeader>
        </div>

        {/* ───────── BODY (2-COLUMN) ───────── */}
        <div className="flex   lg:flex-1 min-h-0 ">
          {/* LEFT — USERS */}
          <div className="w-[70%]  border-r px-6 py-5 flex flex-col">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* Label */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                Users
              </span>
              {selectedUser && (
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-xs text-rose-600 flex items-center gap-1"
                >
                  Clear <X size={12} />
                </button>
              )}
            </div>

            {/* Users list */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-sm">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60">
                  <Users size={32} className="mb-2" />
                  <p className="text-sm">No users found</p>
                </div>
              ) : (
                users.map((user) => {
                  const isSelected = selectedUser?._id === user._id;

                  return (
                    <div
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className={`
                        flex items-center justify-between p-1 rounded-3xl border cursor-pointer transition-all
                        ${
                          isSelected
                            ? ' bg-rose-50 border-[1.5px] border-pink-400 '
                            : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {user.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                            {user.name.charAt(0)}
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="bg-rose-500 text-white p-1 rounded-full mr-3">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT — ACCESS */}
          <div className="px-6 py-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                Permission
              </span>

              <AccessCard
                active={access === 'viewer'}
                icon={<Eye size={18} />}
                title="Viewer"
                desc="Read-only access"
                onClick={() => setAccess('viewer')}
              />

              <AccessCard
                active={access === 'editor'}
                icon={<Edit3 size={18} />}
                title="Editor"
                desc="Can edit & organize"
                onClick={() => setAccess('editor')}
              />
            </div>
          </div>
        </div>

        {/* ───────── FOOTER ───────── */}
        <DialogFooter className="p-6 pt-4 bg-slate-50 border-t flex justify-between">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                console.log({ selectedUser });
                await shareDirectoryByEmail(
                  selectedUser.email,
                  directoryId,
                  access
                );
              }}
              disabled={!selectedUser}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white gap-2"
            >
              <Share2 size={16} />
              Share
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* --- Sub-Component for cleaner code --- */
const AccessCard = ({ active, icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className={`
      relative w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 outline-none
      ${
        active
          ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
      }
    `}
  >
    <div
      className={`p-2 rounded-lg ${
        active ? 'bg-rose-200 text-rose-700' : 'bg-slate-100 text-slate-500'
      }`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm font-bold leading-none mb-1">{title}</p>
      <p
        className={`text-[11px] ${
          active ? 'text-rose-700/80' : 'text-muted-foreground'
        }`}
      >
        {desc}
      </p>
    </div>
  </button>
);

export default ShareDirectoryDialog;
