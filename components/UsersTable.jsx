import { useState, useMemo } from 'react';
import {
  logoutUser,
  deleteUser,
  hardDeleteUser,
  recoverUser,
} from '../API/userAPI';
import {
  LogOut,
  Trash,
  RotateCcw,
  Users as UsersIcon,
  ShieldAlert,
  CheckCircle,
  Search,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import ActionsMenu from './ActoinsMenu'; // Keeping your component
import UserRoleDropDown from './UserRoleDropDown'; // Keeping your component
import { useNavigate } from 'react-router-dom';

const FALLBACK_IMAGE = 'https://placehold.co/100x100/6366f1/FFFFFF?text=U';

/* ---------------------- MODERN MODALS ---------------------- */

const ModalOverlay = ({ children }) => (
  <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all p-4">
    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 transform transition-all scale-100">
      {children}
    </div>
  </div>
);

const ConfirmLogoutModal = ({ open, onCancel, onConfirm, user }) => {
  if (!open) return null;
  return (
    <ModalOverlay>
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <LogOut size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Sign Out User?</h3>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          Are you sure you want to end the session for <br />
          <span className="font-semibold text-gray-800">{user?.name}</span>?
        </p>

        <div className="grid grid-cols-2 gap-3 mt-6 w-full">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger">
            Yes, Logout
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

const ConfirmDeleteModal = ({
  open,
  onCancel,
  onSoftDelete,
  onHardDelete,
  user,
}) => {
  if (!open) return null;
  return (
    <ModalOverlay>
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Delete Account</h3>
        <p className="text-gray-500 mt-2 text-sm">
          Select an action for{' '}
          <span className="font-semibold text-gray-800">{user?.name}</span>.
        </p>

        <div className="flex flex-col gap-3 mt-6 w-full">
          <button
            onClick={onSoftDelete}
            className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition flex items-center justify-center gap-2 font-medium"
          >
            <Trash size={18} /> Soft Delete (Deactivate)
          </button>
          <button
            onClick={onHardDelete}
            className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition flex items-center justify-center gap-2 font-medium"
          >
            <ShieldAlert size={18} /> Hard Delete (Permanent)
          </button>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-sm mt-2 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

const ConfirmHardDeleteFinalModal = ({ open, onCancel, onConfirm, user }) => {
  if (!open) return null;
  return (
    <ModalOverlay>
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Permanently Delete?</h3>
        <p className="text-gray-500 mt-2 text-sm">
          This action <b>cannot</b> be undone. All data for <br />
          <span className="font-semibold text-gray-800">{user?.name}</span> will
          be wiped.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-6 w-full">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger">
            Delete Forever
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

const ConfirmRecoverModal = ({ open, onCancel, onConfirm, user }) => {
  if (!open) return null;
  return (
    <ModalOverlay>
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <RotateCcw size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Restore User?</h3>
        <p className="text-gray-500 mt-2 text-sm">
          This will reactivate the account for <br />
          <span className="font-semibold text-gray-800">{user?.name}</span>.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-6 w-full">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-primary">
            Confirm Restore
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

/* ---------------------- HELPER COMPONENTS ---------------------- */

const StatBadge = ({ label, count, icon: Icon, colorClass }) => (
  <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-xl border border-gray-100 shadow-sm flex-1">
    <div className={`p-3 rounded-full ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-800">{count}</p>
    </div>
  </div>
);

/* ---------------------- MAIN TABLE ---------------------- */

const UsersTable = ({
  users = [],
  isAdmin = false,
  isManager = false,
  isOwner = false,
  refreshUsers,
  currentUserRole,
  currentUserName,
}) => {
  const navigate = useNavigate();

  // Modal States
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showHardDeleteFinal, setShowHardDeleteFinal] = useState(false);
  const [showRecoverPopup, setShowRecoverPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');

  // Permissions
  const canSeeActions = isOwner || isAdmin || isManager;
  const canSoftDelete = (targetRole) =>
    (isOwner || isAdmin) && targetRole !== 'Owner';
  const canHardDelete = (targetRole) =>
    (isOwner || isAdmin) && targetRole !== 'Owner';

  // Derived Statistics (Auto-calculated)
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === 'Logged-In' && !u.deleted)
        .length,
      deleted: users.filter((u) => u.deleted).length,
      admins: users.filter((u) => u.role && u.role.includes('Admin')).length,
    };
  }, [users]);

  // Filtered Users
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  /* -------------------- Actions -------------------- */

  const handleAction = async (actionFn) => {
    if (!selectedUser) return;
    try {
      await actionFn(selectedUser._id);
      await refreshUsers();
      // Close all modals
      setShowLogoutPopup(false);
      setShowDeletePopup(false);
      setShowHardDeleteFinal(false);
      setShowRecoverPopup(false);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* 1. Header & Stats Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage access, roles, and sessions for your team.
          </p>
        </div>

        {/* Current User Badge */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 leading-none">
              {currentUserName}
            </p>
            <p className="text-xs text-gray-500 uppercase font-medium mt-1">
              {currentUserRole}
            </p>
          </div>
          <div className="h-8 w-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
            {currentUserName?.charAt(0)}
          </div>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBadge
          label="Total Users"
          count={stats.total}
          icon={UsersIcon}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatBadge
          label="Active Sessions"
          count={stats.active}
          icon={CheckCircle}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatBadge
          label="Admins"
          count={stats.admins}
          icon={ShieldAlert}
          colorClass="bg-purple-50 text-purple-600"
        />
        <StatBadge
          label="Deleted / Inactive"
          count={stats.deleted}
          icon={Trash}
          colorClass="bg-rose-50 text-rose-600"
        />
      </div>

      {/* 3. Toolbar (Search) */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm w-full md:w-fit">
        <div className="relative flex-1 md:w-64">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-transparent focus:outline-none"
          />
        </div>
        <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>
        <button className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 px-3">
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* 4. Desktop Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User Profile
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              {canSeeActions && (
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                onClick={() => navigate(`/userData/${user._id}`)}
                className={`group transition-colors cursor-pointer ${
                  user.deleted ? 'bg-gray-50' : 'hover:bg-gray-50/80'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.picture || FALLBACK_IMAGE}
                      onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                      className={`w-10 h-10 rounded-full object-cover border-2 ${
                        user.deleted
                          ? 'border-gray-200 grayscale'
                          : 'border-white shadow-sm'
                      }`}
                      alt={user.name}
                    />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          user.deleted ? 'text-gray-400' : 'text-gray-900'
                        }`}
                      >
                        {user.name}
                        {user.deleted && (
                          <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200">
                            DELETED
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                    {user.role || 'User'}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {user.status === 'Logged-In' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                      Offline
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-sm text-gray-500">
                  {/* Placeholder date if not in data */}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </td>

                {canSeeActions && (
                  <td
                    className="px-6 py-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ActionsMenu
                      user={user}
                      isOwner={isOwner}
                      isAdmin={isAdmin}
                      isManager={isManager}
                      canSoftDelete={canSoftDelete}
                      setSelectedUser={setSelectedUser}
                      openLogoutPopup={() => {
                        setSelectedUser(user);
                        setShowLogoutPopup(true);
                      }}
                      setShowRecoverPopup={() => {
                        setSelectedUser(user);
                        setShowRecoverPopup(true);
                      }}
                      setShowDeletePopup={() => {
                        setSelectedUser(user);
                        setShowDeletePopup(true);
                      }}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p>No users found matching "{search}"</p>
          </div>
        )}
      </div>

      {/* 5. Mobile Grid (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden"
          >
            {user.deleted && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-3 py-1 rounded-bl-xl font-bold">
                DELETED
              </div>
            )}

            <div className="flex items-start gap-4">
              <img
                src={user.picture || FALLBACK_IMAGE}
                className={`w-14 h-14 rounded-xl object-cover ${
                  user.deleted && 'grayscale opacity-50'
                }`}
                alt=""
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 truncate">
                  {user.name}
                </h4>
                <p className="text-xs text-gray-500 truncate mb-2">
                  {user.email}
                </p>
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-1 bg-gray-100 rounded text-gray-600 font-medium">
                    {user.role || 'User'}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-1 rounded font-medium ${
                      user.status === 'Logged-In'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    {user.status === 'Logged-In' ? '● Online' : '○ Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Actions Bar */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <div className="flex-1">
                <UserRoleDropDown
                  user={user}
                  setSelectedUser={setSelectedUser}
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Logout Button */}
                {user.status === 'Logged-In' && !user.deleted && (
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowLogoutPopup(true);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600"
                  >
                    <LogOut size={16} />
                  </button>
                )}

                {/* Recover Button */}
                {user.deleted && isOwner && (
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowRecoverPopup(true);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}

                {/* Delete Button */}
                {canHardDelete(user.role) && (
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeletePopup(true);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600"
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- MODALS (Logic Preserved) ---------------- */}

      <ConfirmLogoutModal
        open={showLogoutPopup}
        user={selectedUser}
        onCancel={() => setShowLogoutPopup(false)}
        onConfirm={() => handleAction(logoutUser)}
      />

      <ConfirmDeleteModal
        open={showDeletePopup}
        user={selectedUser}
        onCancel={() => setShowDeletePopup(false)}
        onSoftDelete={() => {
          if (canSoftDelete(selectedUser?.role)) handleAction(deleteUser);
        }}
        onHardDelete={() => {
          if (canHardDelete(selectedUser?.role)) {
            setShowDeletePopup(false);
            setShowHardDeleteFinal(true);
          }
        }}
      />

      <ConfirmHardDeleteFinalModal
        open={showHardDeleteFinal}
        user={selectedUser}
        onCancel={() => setShowHardDeleteFinal(false)}
        onConfirm={() => handleAction(hardDeleteUser)}
      />

      <ConfirmRecoverModal
        open={showRecoverPopup}
        user={selectedUser}
        onCancel={() => setShowRecoverPopup(false)}
        onConfirm={() => handleAction(recoverUser)}
      />

      {/* CSS Utility for buttons (add to your global CSS or rely on Tailwind utility below) */}
      <style>{`
        .btn-primary { @apply px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm hover:shadow; }
        .btn-secondary { @apply px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium; }
        .btn-danger { @apply px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium shadow-sm; }
      `}</style>
    </div>
  );
};

export default UsersTable;
