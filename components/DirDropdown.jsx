import { useState } from 'react';

import {
  CircleAlert,
  FileImage,
  Calendar,
  HardDrive,
  FolderOpen,
  Share2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  FiMoreVertical,
  FiEye,
  FiEdit3,
  FiTrash2,
  FiShare2,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { shareDirectoryByEmail } from '../API/share';
import ShareDirectoryDialog from './ShareDirectoryDialog';
import { formatFileSize } from '../utility/functions';
import { useDirectoryContent } from '@/hooks/useDirectory';

const DirDropdown = ({ id, onDelete, onRename, details }) => {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [dirDetails, setDirDetails] = useState(null);

  const [email, setEmail] = useState('');
  const [accessType, setAccessType] = useState('viewer');
  const BASE_URL = 'https://storifyy-backend.onrender.com';

  const { data, error, isPending } = useDirectoryContent(id);
  const itemClass =
    'cursor-pointer py-2.5 px-3 rounded-lg hover:bg-rose-50 hover:text-rose-600 focus:bg-rose-50 focus:text-rose-600 text-gray-600 font-medium transition-all duration-200 flex items-center gap-3 group';

  const iconClass =
    'text-gray-400 group-hover:text-rose-500 group-focus:text-rose-500 transition-colors duration-200';

  return (
    <>
      {/* Dropdown */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-gray-400 hover:text-slate-500 hover:bg-slate-50 transition-all duration-300 active:scale-95 focus:ring-2 focus:ring-rose-200"
          >
            <FiMoreVertical size={20} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 p-2 rounded-2xl border border-rose-100 bg-white/95 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          align="end"
          sideOffset={5}
        >
          <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
            Directory Actions
          </DropdownMenuLabel>

          {/* Open Directory */}
          <DropdownMenuItem
            onClick={() => setIsDetailsOpen(true)}
            className={itemClass}
          >
            <CircleAlert size={16} className={iconClass} />
            <span>Details</span>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className={itemClass}>
            <Link to={`/directory/${id}`} className="flex items-center gap-3">
              <FiEye size={16} className={iconClass} />
              <span>Open</span>
            </Link>
          </DropdownMenuItem>

          {/* Share Directory */}
          <DropdownMenuItem
            onSelect={() => setIsShareOpen(true)}
            className={itemClass}
          >
            <FiShare2 size={16} className={iconClass} />
            <span>Share Access</span>
          </DropdownMenuItem>

          {/* Rename */}
          <DropdownMenuItem onClick={() => onRename(id)} className={itemClass}>
            <FiEdit3 size={16} className={iconClass} />
            <span>Rename</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-rose-100/50 my-1" />

          {/* Delete */}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsDeleteAlertOpen(true);
            }}
            className={`${itemClass} text-red-600 focus:text-red-600 focus:bg-red-50 hover:bg-red-50`}
          >
            <FiTrash2 size={14} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              directory and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(id)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Delete Directory
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <AlertDialogContent className="p-8 rounded-3xl max-w-xl shadow-2xl bg-white dark:bg-zinc-950 ">
          {/* Close Button */}
          <AlertDialogCancel asChild>
            <button className="absolute right-5 top-5 h-9 w-9 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center rounded-xl transition">
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </AlertDialogCancel>

          {/* HEADER */}
          <div className="flex items-start gap-4 mt-2">
            <div className="w-14 h-14 bg-pink-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-pink-600 dark:text-pink-300" />
            </div>

            <div>
              <h2 className="text-[1.10rem] font-semibold text-gray-900 dark:text-gray-100">
                {details.name}
              </h2>

              <span className="inline-block mt-0.5 text-[0.70rem] font-medium bg-pink-50 text-pink-700 dark:bg-pink-900/40 dark:text-blue-300 px-3 py-1 rounded-full">
                Directory
              </span>
            </div>
          </div>

          {/* INFO GRID — extended */}
          <div className="flex flex-col gap-6 mt-6 text-sm">
            {/* Size */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 flex items-center gap-1">
                  <HardDrive className="w-4 h-4" /> Size
                </p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-gray-200">
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-200">
                    {formatFileSize(details.size)}
                  </p>
                </p>
              </div>

              {/* Files Count */}
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                  Files
                </p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-gray-200">
                  {data?.fileCount ?? 0}
                </p>
              </div>

              {/* Subdirectories */}
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                  Subdirectories
                </p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-gray-200">
                  {data?.dirCount ?? 0}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Created */}
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Created
                </p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-gray-200">
                  {new Date(details.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Modified */}
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Modified
                </p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-gray-200">
                  {new Date(details.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* PATH */}
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" /> Path
            </p>

            <div className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3">
              <code className="text-sm font-mono text-gray-800 dark:text-gray-300">
                {details.path}
              </code>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <ShareDirectoryDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        directoryId={id}
      />
    </>
  );
};

export default DirDropdown;
