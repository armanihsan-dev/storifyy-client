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
  UserRoundPen,
  Check,
  ShieldCheck,
  Crown,
  UserCog,
  CircleUserRound,
} from 'lucide-react';

import toast from 'react-hot-toast';

const getRoleIcon = (role) => {
  switch (role) {
    case 'Owner':
      return <Crown size={16} />;
    case 'Admin':
      return <ShieldCheck size={16} />;
    case 'Manager':
      return <UserCog size={16} />;
    default:
      return <CircleUserRound size={16} />; // User
  }
};

const ALL_ROLES = ['Owner', 'Admin', 'Manager', 'User'];

const UserRoleDropDown = ({ user, setSelectedUser }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition">
          <UserRoundPen size={20} className="text-gray-700" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 p-1" align="end">
        {/* ===================== ROLE SECTION ONLY ===================== */}
        <DropdownMenuLabel className="text-xs text-gray-400">
          Change User Role
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

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

                  {isCurrent && <Check size={16} className="text-green-500" />}
                </DropdownMenuItem>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Change Role to <span className="text-rose-500">{role}</span>
                    ?
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
                        const res = await changeRole(user._id, role);

                        if (res?.error) return;

                        user.role = role;
                        setSelectedUser({ ...user }); // Update UI
                      } catch (err) {
                        console.error(err);
                        toast.error('Failed to update role.');
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
  );
};

export default UserRoleDropDown;
