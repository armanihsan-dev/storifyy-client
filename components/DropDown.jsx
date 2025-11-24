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
  FiMoreVertical,
  FiDownload,
  FiEye,
  FiTrash2,
  FiEdit3,
  FiShare2,
  FiLink,
} from 'react-icons/fi';

const FileActionsDropdown = ({
  id,
  BASE_URL,
  onDownload,
  onPreview,
  onDelete,
  onRename,
  onShare,
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const itemClass =
    'cursor-pointer py-2.5 px-3 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-gray-600 font-medium transition flex items-center gap-3 group';
  const iconClass = 'text-gray-400 group-hover:text-rose-500 transition';

  return (
    <>
      {/* DELETE CONFIRM MODAL */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this file and cannot be
              undone.
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

          <DropdownMenuItem asChild className={itemClass}>
            <a href={`${BASE_URL}/file/${id}`} onClick={onPreview}>
              <FiEye size={16} className={iconClass} />
              <span>Preview</span>
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onShare} className={itemClass}>
            <FiShare2 size={16} className={iconClass} />
            <span>Share access</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onRename} className={itemClass}>
            <FiEdit3 size={16} className={iconClass} />
            <span>Rename</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(`${BASE_URL}/file/${id}`)
            }
            className={itemClass}
          >
            <FiLink size={16} className={iconClass} />
            <span>Copy Link</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className={itemClass}>
            <a
              href={`${BASE_URL}/file/${id}/?action=download`}
              onClick={onDownload}
            >
              <FiDownload size={16} className={iconClass} />
              <span>Download</span>
            </a>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* DELETE – OPEN MODAL VIA STATE */}
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className={`${itemClass} text-red-600`}
          >
            <div className="rounded-md  transition">
              <FiTrash2 size={14} />
            </div>
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FileActionsDropdown;
