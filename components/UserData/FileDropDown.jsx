import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaDownload, FaEye } from 'react-icons/fa';
import {
  MdOutlineDelete,
  MdOutlineDriveFileRenameOutline,
} from 'react-icons/md';
import { BASE_URL } from '../../utility/Server';
import { deleteUserFile, renameUserFile } from '../../API/RoleAPI';
import { toast } from 'react-hot-toast';

const FileDropDown = ({ id, refreshFiles }) => {
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newName, setNewName] = useState('');

  // HANDLE RENAME
  const handleRename = async () => {
    if (!newName.trim()) {
      toast.error('Please enter a valid file name');
      return;
    }
    try {
      await renameUserFile(id, newName);
      setShowRenameModal(false);
      refreshFiles();
    } catch (error) {
      console.log('Rename failed', error);
    }
  };

  // HANDLE DELETE
  const handleDelete = async () => {
    try {
      await deleteUserFile(id);
      setShowDeleteModal(false);
      refreshFiles();
    } catch (error) {
      console.log('Delete failed', error);
      toast.error('Could not delete file');
    }
  };

  return (
    <>
      {/* DROPDOWN */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <BsThreeDotsVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48" align="end">
          {/* DOWNLOAD */}
          <DropdownMenuItem asChild>
            <a
              href={`${BASE_URL}/file/userFile/${id}?action=download`}
              className="flex w-full items-center gap-2"
            >
              <FaDownload size={16} /> Download
            </a>
          </DropdownMenuItem>

          {/* PREVIEW */}
          <DropdownMenuItem asChild>
            <a
              href={`${BASE_URL}/file/userFile/${id}`}
              className="flex items-center gap-2"
            >
              <FaEye size={16} /> Preview
            </a>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* DELETE */}
          <DropdownMenuItem
            onClick={() => setShowDeleteModal(true)}
            className="text-red-600 cursor-pointer"
          >
            <MdOutlineDelete size={16} /> Delete
          </DropdownMenuItem>

          {/* RENAME */}
          <DropdownMenuItem
            onClick={() => setShowRenameModal(true)}
            className="cursor-pointer"
          >
            <MdOutlineDriveFileRenameOutline size={16} /> Rename
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* RENAME POPUP */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-5 rounded-xl w-80 space-y-3 shadow-xl animate-slideUp">
            <h2 className="text-lg font-semibold">Rename File</h2>
            <input
              type="text"
              placeholder="Enter new file name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRenameModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleRename}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION POPUP */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl w-80 shadow-xl animate-slideUp space-y-4">
            <h2 className="text-lg font-bold text-red-600">Delete File?</h2>
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete this file? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileDropDown;
