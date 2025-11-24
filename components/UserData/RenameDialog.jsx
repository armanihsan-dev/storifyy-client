import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function RenameDialog({ open, onClose, dir, onConfirm }) {
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (dir) setNewName(dir.name);
  }, [dir]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
        </DialogHeader>

        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New folder name"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={() => onConfirm(newName)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
