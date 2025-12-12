import { useNavigate, useParams } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import CreateDirectory from '../components/CreateDirectory';
import { useContext, useEffect, useState } from 'react';
import {
  deleteDirectoryAPI,
  getSingleDirectory,
  getUserDirectories,
  renameDirectoryAPI,
} from '../API/RoleAPI';

import FileTile from '../components/UserData/FileTitle';
import FolderTile from '../components/UserData/FolderTitle';
import EmptyLottie from '../components/EmptyLottie';
import { getUserInfo } from '../API/userAPI';
import CurrentUserContext from '../Context/CurrentUserContent';

import { DeleteDialog } from '../components/UserData/DeleteDialog';
import { RenameDialog } from '../components/UserData/RenameDialog';
import toast from 'react-hot-toast';

const UserData = ({
  getDirectories,
  handleCreateDirectory,
  folderName,
  setfolderName,
}) => {
  const { userId } = useParams();

  const [directory, setDirectory] = useState(null);
  const [targetUser, setTargerUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const { currentUser } = useContext(CurrentUserContext);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedDir, setSelectedDir] = useState(null);

  const navigate = useNavigate();
  // directory navigation stack
  const [dirStack, setDirStack] = useState([]);

  // open rename dialog
  const askRenameFolder = (dir) => {
    setSelectedDir(dir);
    setRenameDialogOpen(true);
  };

  // open delete dialog
  const askDeleteFolder = (dir) => {
    setSelectedDir(dir);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    if (currentUser?.role === 'Owner') {
      setIsOwner(true);
    }
  }, [currentUser]);

  // load ROOT
  const fetchRoot = async () => {
    try {
      const data = await getUserDirectories(userId);
      if (!data) {
        return navigate('/users');
      } else if (data.isNormalUser || data.isLowerRank) {
        toast.error('Access denied !!');
        return navigate('/users');
      }
      setDirectory(data);
      setDirStack([]);
    } catch (err) {
      console.log('Error fetching root directory', err);
    }
  };

  const refreshCurrentDirectory = async () => {
    const refreshed = await getSingleDirectory(directory._id);
    setDirectory(refreshed);
  };

  // load subdirectory
  const fetchSingle = async (dirId) => {
    if (directory) {
      setDirStack((prev) => [...prev, directory._id]);
    }

    const data = await getSingleDirectory(dirId);
    if (data) setDirectory(data);
  };

  const goBack = async () => {
    if (dirStack.length === 0) return;

    const parentId = dirStack[dirStack.length - 1];
    setDirStack((prev) => prev.slice(0, -1));

    const data = await getSingleDirectory(parentId);
    if (data) setDirectory(data);
  };

  // DELETE folder confirm
  const confirmDelete = async () => {
    const dirId = selectedDir._id;

    const res = await deleteDirectoryAPI(dirId, targetUser._id);

    setDeleteDialogOpen(false);
    setSelectedDir(null);

    if (!res) return;

    if (dirStack.length > 0) {
      const parentId = dirStack[dirStack.length - 1];
      const parentDirectory = await getSingleDirectory(parentId);
      setDirectory(parentDirectory);

      setDirStack((prev) => prev.slice(0, -1));
    } else {
      fetchRoot();
    }
  };

  const confirmRename = async (newName) => {
    const res = await renameDirectoryAPI(selectedDir._id, newName);
    setRenameDialogOpen(false);
    setSelectedDir(null);

    if (directory._id) {
      const refreshed = await getSingleDirectory(directory._id);
      setDirectory(refreshed);
    } else {
      await fetchRoot();
    }
  };

  // load root + target user
  useEffect(() => {
    fetchRoot();
    (async () => {
      const targetUserData = await getUserInfo(userId);
      setTargerUser(targetUserData);
    })();
  }, [userId]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-2xl p-6 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-rose-400">
            User Storage Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Viewing storage for user ID:{' '}
            <span className="text-gray-800">{userId}</span>
          </p>
        </div>

        {isOwner && (
          <div className="flex items-center gap-4">
            <FileUpload getDirectories={getDirectories} />
            <CreateDirectory
              handleCreateDirectory={handleCreateDirectory}
              folderName={folderName}
              setfolderName={setfolderName}
            />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="bg-white shadow-sm rounded-2xl p-6 flex items-center gap-5 mb-6">
        <img
          src={
            targetUser?.picture ||
            'https://placehold.co/120x120/0EA5E9/FFFFFF?text=User'
          }
          className="w-20 h-20 rounded-full shadow"
          alt="User avatar"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-700">
            {targetUser?.name || 'UserName'}
          </h2>
          <p className="text-gray-500 text-sm">
            {targetUser?.email || 'useremail@gmail.com'}
          </p>

          <span className="mt-3 inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
            Role: {targetUser?.role || 'User'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Current Directory</p>
          <h3
            className={`text-xl font-semibold mt-1 ${
              directory?.name?.split('-')[0] === 'root' && 'text-rose-600'
            }`}
          >
            {directory?.name?.split('-')[0] || 'Root'}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Total Files</p>
          <h3 className="text-2xl font-semibold mt-1">
            {directory?.files?.length || 0}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Total Folders</p>
          <h3 className="text-2xl font-semibold mt-1">
            {directory?.directories?.length || 0}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Navigation</p>

          <button
            disabled={dirStack.length === 0}
            onClick={goBack}
            className="mt-2 bg-gray-200 px-4 cursor-pointer py-2 rounded-lg disabled:opacity-50"
          >
            ← Go Back
          </button>
        </div>
      </div>

      {/* Files + Folders */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">User Files</h3>

        <div className="rounded-xl">
          {!directory ? (
            <p className="text-gray-500">Loading...</p>
          ) : directory.directories?.length === 0 &&
            directory.files?.length === 0 ? (
            <EmptyLottie />
          ) : (
            <div className="flex flex-col sm:flex-row  gap-2 flex-wrap">
              {/* Folders */}
              {(directory.directories || []).map((dir) => (
                <FolderTile
                  key={dir._id}
                  directory={dir}
                  onOpen={() => fetchSingle(dir._id)}
                  onDelete={() => askDeleteFolder(dir)}
                  onRename={() => askRenameFolder(dir)}
                />
              ))}

              {/* Files */}
              {(directory.files || []).map((file) => (
                <FileTile
                  key={file._id}
                  file={file}
                  refreshFiles={refreshCurrentDirectory}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />

      <RenameDialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        dir={selectedDir}
        onConfirm={confirmRename}
      />
    </div>
  );
};

export default UserData;
