// DeleteDialog.jsx
import React from "react";
import { cn } from "../../lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
}

export default function DialogueBox({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  cancelText,
  confirmText,
}: Props) {
  if (!isOpen) return null;

  const handleConfirm = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    onConfirm();
    onClose();
  };
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-black/60",
        { hidden: !isOpen },
      )}
      onClick={onClose}
    >
      <div className="z-[150] w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold">
          {title || "Are you sure?"}
        </h2>
        <p className="mb-4 text-gray-600">
          {message || "This action cannot be undone."}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
          >
            {cancelText || "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            {confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
