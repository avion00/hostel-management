import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

function AlertDialog({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  confirmVariant = "destructive",
  isLoading = false,
}) {
  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  const isDestructive = confirmVariant === "destructive";
  const Icon = isDestructive ? AlertTriangle : CheckCircle2;

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleCancel();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md border border-slate-200 bg-white shadow-lg rounded-xl p-0"
        onKeyDown={handleKeyDown}
      >
        <div className="px-6 pt-5 pb-4 flex gap-3 items-start">
          <div
            className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              isDestructive
                ? "bg-red-100 text-red-600"
                : "bg-emerald-100 text-emerald-600"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-base sm:text-lg font-semibold text-slate-900">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-slate-600 leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        <DialogFooter className="px-6 pb-4 pt-1 flex sm:flex-row sm:justify-end gap-2 bg-slate-50/80 rounded-b-xl">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              isDestructive
                ? "bg-red-600 hover:bg-red-500 text-white shadow-sm"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
            }
          >
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AlertDialog;
