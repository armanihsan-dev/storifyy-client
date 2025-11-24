import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import {
  FiMoreVertical,
  FiDownload,
  FiEye,
  FiTrash2,
  FiEdit3,
  FiShare2,
} from 'react-icons/fi';

import { BASE_URL } from '../../utility/Server';

const SharedFileDropDown = ({ id, role, onDelete, onRename, onShare }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditor = role === 'editor';

  const itemClass =
    'cursor-pointer py-2.5 px-3 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-gray-600 font-medium transition flex items-center gap-3 group';

  const iconClass = 'text-gray-400 group-hover:text-rose-500 transition';

  return (
    <>
      {/* DELETE CONFIRM POPUP */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this file.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(id)}
              className="bg-red-600 rounded-xl text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* RENAME POPUP */}
      {/* RENAME POPUP */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>

          <input
            type="text"
            className="mt-3 w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            placeholder="Enter new file name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                if (!newName.trim()) return;
                onRename(id, newName); // ✔ correct args
                setRenameOpen(false);
              }}
              disabled={loading}
              className="bg-rose-600 text-white hover:bg-rose-700 rounded-xl"
            >
              {loading ? 'Renaming...' : 'Rename'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DROPDOWN */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition"
          >
            <FiMoreVertical size={20} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 p-2 rounded-2xl border border-rose-100 shadow-lg bg-white"
          align="end"
          sideOffset={5}
        >
          <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase px-3 py-2">
            File Actions
          </DropdownMenuLabel>

          {/* PREVIEW */}
          <DropdownMenuItem asChild className={itemClass}>
            <a href={`${BASE_URL}/share/preview/${id}`}>
              <FiEye size={16} className={iconClass} />
              <span>Preview</span>
            </a>
          </DropdownMenuItem>

          {/* SHARE */}
          {/* {isEditor && (
            <DropdownMenuItem onClick={onShare} className={itemClass}>
              <FiShare2 size={16} className={iconClass} />
              <span>Share Access</span>
            </DropdownMenuItem>
          )} */}

          {/* RENAME */}
          {isEditor && (
            <DropdownMenuItem
              onClick={() => setRenameOpen(true)}
              className={itemClass}
            >
              <FiEdit3 size={16} className={iconClass} />
              <span>Rename</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* DOWNLOAD */}
          <DropdownMenuItem asChild className={itemClass}>
            <a href={`${BASE_URL}/share/preview/${id}?action=download`}>
              <FiDownload size={16} className={iconClass} />
              <span>Download</span>
            </a>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* DELETE */}
          {isEditor && (
            <DropdownMenuItem
              onClick={() => setDeleteOpen(true)}
              className={`${itemClass} text-red-600`}
            >
              <FiTrash2 size={16} />
              <span>Delete</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default SharedFileDropDown;
