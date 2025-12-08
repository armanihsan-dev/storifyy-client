import { useState } from 'react';
import {
  logoutUser,
  deleteUser, // soft delete
  hardDeleteUser, // hard delete (permanent)
  recoverUser, // restore soft-deleted user (make sure exists in ../API/userAPI)
} from '../API/userAPI';
import { LogOut, Trash, RotateCcw } from 'lucide-react';
import ConfirmRecoverModal from './ConfirmRecoverModal';
import ActionsMenu from './ActoinsMenu';
import UserRoleDropDown from './UserRoleDropDown';
import { Link, useNavigate } from 'react-router-dom';

const FALLBACK_IMAGE = 'https://placehold.co/100x100/f43f5e/FFFFFF?text=U';

/* ---------------------- MODALS ---------------------- */

const ConfirmLogoutModal = ({ open, onCancel, onConfirm, user }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
        <h3 className="text-lg font-semibold text-gray-800">Logout User?</h3>
        <p className="text-gray-600 mt-2">
          Are you sure you want to logout{' '}
          <span className="font-medium">{user?.name}</span>?
        </p>

        <div className="flex justify-between mt-6 gap-3">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
        <h3 className="text-lg font-semibold text-gray-800">Delete User?</h3>

        <p className="text-gray-600 mt-2">
          Choose how you want to delete{' '}
          <span className="font-medium">{user?.name}</span>.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onSoftDelete}
            className="w-full px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
          >
            Soft Delete (Deactivate)
          </button>

          <button
            onClick={onHardDelete}
            className="w-full px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Hard Delete (Permanent)
          </button>

          <button
            onClick={onCancel}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmHardDeleteFinalModal = ({ open, onCancel, onConfirm, user }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
        <h3 className="text-lg font-semibold text-red-600">
          Permanent Delete?
        </h3>

        <p className="text-gray-600 mt-3">
          Everything related to{' '}
          <span className="font-medium">{user?.name}</span> will be deleted.
        </p>

        <p className="text-red-500 font-semibold text-sm mt-2">
          This includes all files, directories, sessions, and stored data.
          <br />
          This action is irreversible.
        </p>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Yes, Delete Everything
          </button>

          <button
            onClick={onCancel}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- MAIN USERS TABLE ---------------------- */

const UsersTable = ({
  users = [],
  isAdmin = false,
  isManager = false,
  isOwner = false,
  refreshUsers,
  currentUserRole,
  currentUserName,
}) => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [loggingOutUserId, setLoggingOutUserId] = useState(null);
  const [processingDeleteId, setProcessingDeleteId] = useState(null);
  const [processingHardDeleteId, setProcessingHardDeleteId] = useState(null);
  const [processingRecoverId, setProcessingRecoverId] = useState(null);
  const [showRecoverPopup, setShowRecoverPopup] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState(null); // stores user._id

  const [mobileRoleMenuFor, setMobileRoleMenuFor] = useState(null);
  const [roleToAssign, setRoleToAssign] = useState(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showHardDeleteFinal, setShowHardDeleteFinal] = useState(false);
  const navigate = useNavigate();
  // RULES:
  // Soft Delete: Owner + Admin (Managers NOT allowed)
  // Hard Delete: Owner + Admin
  // Recover: ONLY Owner

  const canSeeActions = isOwner || isAdmin || isManager; // who sees action column
  const canSoftDelete = (targetRole) =>
    (isOwner || isAdmin) && targetRole !== 'Owner';
  const canHardDelete = (targetRole) =>
    (isOwner || isAdmin) && targetRole !== 'Owner';
  const canRecover = () => isOwner; // recover only Owner

  /* -------------------- Popup openers -------------------- */
  const openLogoutPopup = (user) => {
    setSelectedUser(user);
    setShowLogoutPopup(true);
  };

  const openDeletePopup = (user) => {
    setSelectedUser(user);
    setShowDeletePopup(true);
  };

  const handleHardDeleteClick = () => {
    // close first modal and open final confirmation
    setShowDeletePopup(false);
    setShowHardDeleteFinal(true);
  };

  /* -------------------- Actions -------------------- */

  const confirmLogout = async () => {
    if (!selectedUser) return;
    setLoggingOutUserId(selectedUser._id);
    try {
      await logoutUser(selectedUser._id);
      setShowLogoutPopup(false);
      await refreshUsers();
      setSelectedUser(null);
    } catch (err) {
      // handle/log error if you need
      console.error('Logout error', err);
    } finally {
      setTimeout(() => setLoggingOutUserId(null), 500);
    }
  };

  const confirmSoftDelete = async () => {
    if (!selectedUser) return;
    setProcessingDeleteId(selectedUser._id);
    try {
      // soft delete
      await deleteUser(selectedUser._id);
      setShowDeletePopup(false);
      await refreshUsers();
      setSelectedUser(null);
    } catch (err) {
      console.error('Soft delete error', err);
    } finally {
      setTimeout(() => setProcessingDeleteId(null), 500);
    }
  };

  const confirmHardDelete = async () => {
    if (!selectedUser) return;
    setProcessingHardDeleteId(selectedUser._id);
    try {
      await hardDeleteUser(selectedUser._id);
      setShowHardDeleteFinal(false);
      await refreshUsers();
      setSelectedUser(null);
    } catch (err) {
      console.error('Hard delete error', err);
    } finally {
      setTimeout(() => setProcessingHardDeleteId(null), 500);
    }
  };

  const confirmRecover = async (user) => {
    if (!user) return;
    setProcessingRecoverId(user._id);
    try {
      await recoverUser(user._id);
      await refreshUsers();
    } catch (err) {
      console.error('Recover error', err);
    } finally {
      setTimeout(() => setProcessingRecoverId(null), 500);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="p-6 ">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50 p-5 rounded-2xl border border-rose-100 shadow-sm">
        <div>
          <h2 className="text-md lg:text-2xl font-bold text-rose-500 tracking-wide">
            Application Users
          </h2>

          <p className="text-gray-600 mt-1 text-[12px] lg:text-sm flex items-center gap-2">
            <span className="font-medium text-gray-800">{currentUserName}</span>
            <span className="text-rose-500 font-semibold">•</span>
            <span className="text-gray-700 capitalize">{currentUserRole}</span>
          </p>
        </div>

        {/* Profile Badge */}
        <div className="px-4 py-2 bg-white/80 backdrop-blur border border-rose-100 rounded-xl shadow-sm text-right">
          <p className="text-xs text-gray-500">Logged in as</p>
          <p className="text-sm font-semibold text-rose-600">
            {currentUserName}
          </p>
          <p className="text-xs text-gray-500 capitalize">{currentUserRole}</p>
        </div>
      </div>
      <div className="overflow-x-auto md:shadow-sm rounded-lg">
        {/* ---------------- DESKTOP TABLE ---------------- */}
        <table className="hidden md:table min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-gray-700 text-sm">
              <th className="py-2 px-4">User</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Status</th>
              {canSeeActions && (
                <th className="py-2 px-4 text-start  ">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {(users || []).map((user) => (
              <tr
                onClick={() => navigate(`/userData/${user._id}`)}
                key={user._id}
                className="bg-[#f9fafc] hover:bg-[#f1f3f7] transition-all rounded-2xl cursor-pointer"
              >
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={user.picture || FALLBACK_IMAGE}
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                    className="w-10 h-10 rounded-full shadow-md"
                    alt={`Avatar of ${user.name}`}
                  />
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">
                      {user.name}
                    </span>
                    {/* Deleted badge */}
                    {user.deleted && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-2">
                        Deleted
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4 text-gray-600">{user.email}</td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'Logged-In'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {user.status === 'Logged-In' ? 'Logged in' : 'Logged out'}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="py-2 px-4">
                  <ActionsMenu
                    user={user}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    isManager={isManager}
                    canSoftDelete={canSoftDelete}
                    setSelectedUser={setSelectedUser}
                    openLogoutPopup={openLogoutPopup}
                    setShowRecoverPopup={setShowRecoverPopup}
                    setShowDeletePopup={setShowDeletePopup}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ---------------- MOBILE LIST ---------------- */}
      <div className="md:hidden flex flex-col gap-4 mt-3">
        {(users || []).map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <img
                src={user.picture || FALLBACK_IMAGE}
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                className="w-12 h-12 rounded-full shadow"
                alt={user.name}
              />

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800 text-[14px]">
                    {user.name}
                  </p>

                  {user.deleted && (
                    <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                      Deleted
                    </span>
                  )}
                </div>

                <p className="text-[8px] text-gray-500">{user.email}</p>
              </div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-[8px] font-medium ${
                    user.status === 'Logged-In'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {user.status === 'Logged-In' ? 'Logged in' : 'Logged out'}
                </span>
              </div>
              {/* Status + Actions */}
            </div>
            <div className="flex justify-between mt-2  items-end gap-2 ">
              {/* Status */}

              <button
                disabled={
                  user.deleted ||
                  !(isOwner || isAdmin || isManager) ||
                  user.status !== 'Logged-In'
                }
                onClick={() => {
                  if (
                    !user.deleted &&
                    (isOwner || isAdmin || isManager) &&
                    user.status === 'Logged-In'
                  ) {
                    setSelectedUser(user);
                    openLogoutPopup(user);
                  }
                }}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow transition text-sm
                  ${
                    user.deleted ||
                    !(isOwner || isAdmin || isManager) ||
                    user.status !== 'Logged-In'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-rose-400 text-white hover:bg-rose-500'
                  }`}
              >
                <LogOut size={14} />
                Logout
              </button>
              {/* Actions (Mobile) */}
              <div className="flex items-center gap-2 mt-2">
                {/* ========================= CHNAGE ROLE ========================= */}
                <UserRoleDropDown
                  user={user}
                  setSelectedUser={setSelectedUser}
                />

                {/* ========================= RECOVER (Owner) ========================= */}
                <button
                  disabled={!user.deleted || !isOwner}
                  onClick={() => {
                    if (user.deleted && isOwner) {
                      setSelectedUser(user);
                      setShowRecoverPopup(true);
                    }
                  }}
                  className={`p-2 rounded-full transition
                  ${
                    !user.deleted || !isOwner
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  <RotateCcw size={16} />
                </button>

                {/* ========================= HARD DELETE ========================= */}
                <button
                  disabled={!canHardDelete(user.role)}
                  onClick={() => {
                    if (canHardDelete(user.role)) {
                      setSelectedUser(user);
                      setShowDeletePopup(true);
                    }
                  }}
                  className={`p-2 rounded-full transition
                  ${
                    !canHardDelete(user.role)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* ---------------- MODALS ---------------- */}
      <ConfirmLogoutModal
        open={showLogoutPopup}
        user={selectedUser}
        onCancel={() => setShowLogoutPopup(false)}
        onConfirm={confirmLogout}
      />
      {/* First delete popup: Soft or Hard choice.
            We reuse selectedUser for which user to act on. */}
      <ConfirmDeleteModal
        open={showDeletePopup}
        user={selectedUser}
        onCancel={() => {
          setShowDeletePopup(false);
          setSelectedUser(null);
        }}
        onSoftDelete={async () => {
          // Soft delete should only be allowed for Owner/Admin — guard just in case
          if (!selectedUser) return;
          if (!(isOwner || isAdmin)) {
            return setShowDeletePopup(false);
          }
          await confirmSoftDelete();
        }}
        onHardDelete={() => {
          // ensure role allows hard delete
          if (!selectedUser) return;
          if (!(isOwner || isAdmin)) {
            setShowDeletePopup(false);
            return;
          }
          handleHardDeleteClick();
        }}
      />
      <ConfirmRecoverModal
        open={showRecoverPopup}
        user={selectedUser}
        onCancel={() => setShowRecoverPopup(false)}
        onConfirm={async () => {
          await confirmRecover(selectedUser);
          setShowRecoverPopup(false);
          setSelectedUser(null);
        }}
      />
      {/* Final hard delete confirmation */}
      <ConfirmHardDeleteFinalModal
        open={showHardDeleteFinal}
        user={selectedUser}
        onCancel={() => {
          setShowHardDeleteFinal(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmHardDelete}
      />
    </div>
  );
};

export default UsersTable;
