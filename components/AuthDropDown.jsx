import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { logoutFromAllAccounts } from '../API/userAPI'; // Ensure this path is correct
import { useEffect, useState } from 'react';
import {
  FiUser,
  FiLogOut,
  FiSettings,
  FiShield,
  FiLogIn,
  FiChevronRight,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const AuthDropDown = ({ BASEURL }) => {
  const [userInfo, setUserInfo] = useState({
    id: '',
    userName: '',
    email: '',
    picture: '',
    isLogged: false,
    loading: true,
  });

  const navigate = useNavigate();

  // --- API CALLS ---
  async function userDetails() {
    try {
      const response = await fetch(`${BASEURL}/user`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        setUserInfo((prev) => ({ ...prev, isLogged: false, loading: false }));
        return;
      }

      const data = await response.json();
      setUserInfo({
        id: data._id,
        userName: data.name,
        email: data.email,
        picture: data.picture,
        isLogged: true,
        loading: false,
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      setUserInfo((prev) => ({ ...prev, isLogged: false, loading: false }));
    }
  }

  async function handleLogOut() {
    try {
      await fetch(`${BASEURL}/user/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUserInfo({ userName: '', email: '', isLogged: false });
      navigate('/login');
    } catch (error) {
      console.error('Error occurred while logout:', error);
    }
  }

  useEffect(() => {
    userDetails();
  }, []);

  // --- STYLES ---
  const menuItemClass =
    'cursor-pointer py-2.5 px-3 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 focus:bg-rose-50 focus:text-rose-600 transition-all duration-200 flex items-center gap-3 font-medium group';

  const iconClass =
    'text-slate-400 group-hover:text-rose-500 transition-colors';

  return (
    <DropdownMenu modal={false}>
      {/* --- TRIGGER --- */}
      <DropdownMenuTrigger className="outline-none rounded-full  focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 transition-all duration-300">
        <div className="relative w-12 h-12 cursor-pointer rounded-full overflow-hidden  border border-slate-200 hover:border-rose-300 shadow-sm transition-colors bg-pink-400 flex items-center justify-center">
          {userInfo.loading ? (
            <div className="w-full h-full animate-pulse" />
          ) : userInfo.isLogged && userInfo.picture ? (
            <img
              src={userInfo?.picture}
              alt="User"
              className="w-full h-full object-cover"
              onError={(e) =>
                (e.currentTarget.src =
                  'https://ui-avatars.com/api/?name=' + userInfo.userName)
              }
            />
          ) : (
            <FiUser className="text-white" size={25} />
          )}
        </div>
      </DropdownMenuTrigger>

      {/* --- CONTENT --- */}
      <DropdownMenuContent
        className="w-72 p-2 rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        align="end"
        sideOffset={8}
      >
        {userInfo.isLogged ? (
          <>
            {/* Header Section */}
            <div className="px-3 py-3 mb-1 bg-slate-50/50 rounded-xl border border-slate-100/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm shrink-0">
                <img
                  src={
                    userInfo.picture ||
                    `https://ui-avatars.com/api/?name=${userInfo.userName}`
                  }
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-bold text-slate-800 truncate">
                  {userInfo.userName}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {userInfo.email}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-slate-100 my-1" />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mt-2 mb-1">
                Account
              </DropdownMenuLabel>

              {/* Profile Link */}
              <DropdownMenuItem asChild className={menuItemClass}>
                <Link to={`/profile/${userInfo.id}`}>
                  <FiSettings size={16} className={iconClass} />
                  <span className="flex-1">My Profile</span>
                  <FiChevronRight size={14} className="text-slate-300" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-slate-100 my-1" />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mt-2 mb-1">
                Session
              </DropdownMenuLabel>

              {/* Logout */}
              <DropdownMenuItem
                onClick={handleLogOut}
                className={menuItemClass}
              >
                <FiLogOut size={16} className={iconClass} />
                <span>Log out</span>
              </DropdownMenuItem>

              {/* Logout All - Styled as destructive */}
              <DropdownMenuItem
                onClick={async (e) => {
                  e.preventDefault();
                  await logoutFromAllAccounts();
                  navigate('/login');
                }}
                className={`${menuItemClass} !text-red-600 hover:!bg-red-50 hover:!text-red-700 focus:!bg-red-50`}
              >
                <FiShield
                  size={16}
                  className="text-red-400 group-hover:text-red-600 transition-colors"
                />
                <div className="flex flex-col">
                  <span className="leading-none">Sign out all devices</span>
                  <span className="text-[10px] opacity-70 mt-1 font-normal">
                    For security purposes
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : (
          // Not Logged In State
          <div className="p-1">
            <div className="px-3 py-4 text-center">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUser size={24} />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">
                Guest User
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Log in to access your files.
              </p>

              <DropdownMenuItem
                asChild
                className={`${menuItemClass} justify-center bg-slate-900 text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white`}
              >
                <Link to="/login">
                  <FiLogIn size={16} />
                  <span>Sign In</span>
                </Link>
              </DropdownMenuItem>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthDropDown;
