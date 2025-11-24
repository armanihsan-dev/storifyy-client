import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

import { changeRole } from '../API/userAPI';

import {
  LogOut,
  RotateCcw,
  Trash,
  UserRoundPen,
  Check,
  ShieldCheck,
  Crown,
  UserCog,
  CircleUserRound,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ---------------- ICONS FOR ROLES -----------------
const getRoleIcon = (role) => {
  switch (role) {
    case 'Owner':
      return <Crown size={16} />;
    case 'Admin':
      return <ShieldCheck size={16} />;
    case 'Manager':
      return <UserCog size={16} />;
    default:
      return <CircleUserRound size={16} />;
  }
};

const ALL_ROLES = ['Owner', 'Admin', 'Manager', 'User'];

const ActionsMenu = ({
  user,
  isOwner,
  isAdmin,
  isManager,
  canSoftDelete,
  setSelectedUser,
  openLogoutPopup,
  setShowRecoverPopup,
  setShowDeletePopup,
}) => {
  // ------------------------------------------------
  // PREVENT BUBBLING (SUPER IMPORTANT FOR DESKTOP)
  // ------------------------------------------------
  const stopRowClick = (e) => e.stopPropagation();

  return (
    <div onClick={stopRowClick}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full p-2 hover:bg-gray-200 transition">
            <UserRoundPen size={20} className="text-gray-700" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-60 p-1" align="end">
          {/* LOGOUT */}
          <DropdownMenuItem
            disabled={user.deleted || !(isOwner || isAdmin || isManager)}
            onSelect={(e) => {
              e.preventDefault(); // prevents auto-close
              setSelectedUser(user);
              openLogoutPopup(user);
            }}
            className="flex items-center gap-2"
          >
            <LogOut size={16} /> Logout
          </DropdownMenuItem>

          {/* RECOVER USER */}
          <DropdownMenuItem
            disabled={!user.deleted || !isOwner}
            onSelect={(e) => {
              e.preventDefault();
              setSelectedUser(user);
              setShowRecoverPopup(true);
            }}
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} /> Recover User
          </DropdownMenuItem>

          {/* DELETE USER */}
          <DropdownMenuItem
            disabled={user.deleted || !canSoftDelete(user.role)}
            onSelect={(e) => {
              e.preventDefault();
              setSelectedUser(user);
              setShowDeletePopup(true);
            }}
            className="flex items-center gap-2 text-red-500"
          >
            <Trash size={16} /> Delete
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* ROLE HEADER */}
          <DropdownMenuLabel className="text-xs text-gray-400">
            Change User Role
          </DropdownMenuLabel>

          {/* ROLE SELECTOR */}
          {ALL_ROLES.map((role) => {
            const isCurrent = user.role === role;

            return (
              <AlertDialog key={role}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    disabled={isCurrent}
                    onSelect={(e) => e.preventDefault()}
                    className={`flex items-center justify-between gap-2 ${
                      isCurrent ? 'opacity-60' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {getRoleIcon(role)}
                      {role}
                    </span>

                    {isCurrent && (
                      <Check size={16} className="text-green-500" />
                    )}
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Change Role to{' '}
                      <span className="text-rose-500">{role}</span>?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                      This will immediately update the user’s permissions.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      onClick={async () => {
                        try {
                          const res = await changeRole(
                            'http://localhost:3000',
                            user._id,
                            role
                          );

                          if (res?.error) return;

                          user.role = role;
                          setSelectedUser({ ...user });
                        } catch (err) {
                          console.error(err);
                          toast.error('Failed to update role. Try again.');
                        }
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionsMenu;
