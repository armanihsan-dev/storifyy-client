import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  CircleAlert,
  FileImage,
  Calendar,
  HardDrive,
  FolderOpen,
  Share2,
  X,
} from 'lucide-react';
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

import { FiMoreVertical, FiTrash2, FiEdit3, FiShare2 } from 'react-icons/fi';
import { shortenName } from './FileCard';

const FileActionsDropdown = ({
  id,
  BASE_URL,
  onDelete,
  onRename,
  onShare,
  details,
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
      {/* DETAILS MODAL */}
      <AlertDialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <AlertDialogContent className="p-8 rounded-3xl max-w-lg shadow-2xl bg-white dark:bg-zinc-950">
          {/* CANCEL BUTTON */}
          <AlertDialogCancel asChild>
            <button className="absolute right-4 top-4 h-9 w-9 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center transition">
              <X className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </button>
          </AlertDialogCancel>

          {/* BODY */}
          <div className="space-y-8 mt-6">
            {/* FILE PREVIEW + TITLE */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                <img
                  src={`/fileicons/${details.extension.split('.')[1]}.svg`}
                  className="w-12 h-12"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {shortenName(details.title, 30)}
                </h2>

                <p className="inline-block text-xs font-medium text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 mt-2 rounded-full">
                  {details.extension.toUpperCase()} File
                </p>
              </div>
            </div>

            {/* FILE METADATA */}
            <div className="flex justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5" /> Size
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {details.size}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Created
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {details.createdAt}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Modified
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {details.updatedAt}
                </p>
              </div>
            </div>

            {/* PATH */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1.5 mb-1">
                <FolderOpen className="w-3.5 h-3.5" /> Path
              </p>

              <div className="p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
                <code className="text-xs font-mono text-gray-700 dark:text-gray-300 block whitespace-normal break-all">
                  {details.path}
                </code>
              </div>
            </div>

            {/* SHARED STATUS */}
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 flex gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full text-green-600 dark:text-green-400">
                <Share2 className="w-4 h-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                  Shared via link
                </p>
                <p className="text-xs text-green-700 dark:text-green-400">
                  Publicly accessible
                </p>
              </div>
            </div>
          </div>
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

          <DropdownMenuItem
            onClick={() => setDetailsOpen(true)}
            className={itemClass}
          >
            <CircleAlert size={16} className={iconClass} />
            <span>Details</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onShare} className={itemClass}>
            <FiShare2 size={16} className={iconClass} />
            <span>Share access</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onRename} className={itemClass}>
            <FiEdit3 size={16} className={iconClass} />
            <span>Rename</span>
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
