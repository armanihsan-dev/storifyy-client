import { useState } from 'react';

import toast from 'react-hot-toast';

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

const DirDropdown = ({ id, onDelete, onRename }) => {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [accessType, setAccessType] = useState('viewer');
  const BASE_URL = 'http://localhost:3000';
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
            className="h-9 w-9 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 active:scale-95 focus:ring-2 focus:ring-rose-200"
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
      <ShareDirectoryDialog
        isShareOpen={isShareOpen}
        setIsShareOpen={setIsShareOpen}
        id={id}
        shareDirectoryByEmail={shareDirectoryByEmail}
      />
    </>
  );
};

export default DirDropdown;
