import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  MdOutlineDelete,
  MdOutlineDriveFileRenameOutline,
} from 'react-icons/md';
const DirDropDown = ({ id, onDelete, onRename }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClickDelete = () => {
    // Delay popup so dropdown closes first (removes flicker)
    setTimeout(() => setShowConfirm(true), 20);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <BsThreeDotsVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={handleClickDelete}
            className="flex items-center gap-2 text-red-600"
          >
            <MdOutlineDelete size={16} /> Delete
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onRename}
            className="flex items-center gap-2"
          >
            <MdOutlineDriveFileRenameOutline size={16} /> Rename
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl w-80 shadow-lg space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Delete Folder?
            </h2>

            <p className="text-sm text-gray-600">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  onDelete(id);
                  setShowConfirm(false);
                }}
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

export default DirDropDown;
