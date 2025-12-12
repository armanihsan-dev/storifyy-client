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

const ConfirmDialog = ({
  open,
  onOpenChange,

  // Icon props
  icon = null,
  iconBg = 'bg-gray-100',
  iconColor = 'text-gray-600',

  // Text
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',

  // Colors
  confirmColor = 'bg-red-600 hover:bg-red-700',

  // Handlers
  onConfirm = () => {},
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl p-6 max-w-md shadow-xl border border-gray-100">
        <AlertDialogHeader className="text-left space-y-4">
          {/* ICON + TITLE */}
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full ${iconBg}`}
              >
                <span className={`${iconColor}`}>{icon}</span>
              </div>
            )}

            <AlertDialogTitle className="text-2xl font-bold text-slate-800">
              {title}
            </AlertDialogTitle>
          </div>

          {/* DESCRIPTION */}
          <AlertDialogDescription className="text-slate-500 leading-relaxed text-[15px]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* FOOTER */}
        <AlertDialogFooter className="mt-6 flex-row-reverse gap-3 sm:justify-end">
          <AlertDialogAction
            onClick={onConfirm}
            className={`rounded-xl text-white px-6 py-2.5 text-sm font-medium shadow-md ${confirmColor}`}
          >
            {confirmLabel}
          </AlertDialogAction>

          <AlertDialogCancel className="rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 px-6 py-2.5 text-sm font-medium shadow-sm">
            {cancelLabel}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
