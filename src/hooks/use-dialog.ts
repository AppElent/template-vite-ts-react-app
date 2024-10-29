import { useState, useCallback, useEffect } from 'react';

interface DialogData {
  // Define the structure of your dialog data here
  // For example:
  title: string;
  content: string;
}

interface UseDialogReturn {
  isOpen: boolean;
  data: DialogData | null;
  setData: (data: DialogData | null) => void;
  open: () => void;
  close: () => void;
  updateDialogData: (data: DialogData) => void;
  toggle: () => void;
}

const useDialog = (initialData: DialogData | null = null): UseDialogReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<DialogData | null>(initialData);

  useEffect(() => {
    setDialogData(initialData);
  }, [initialData]);

  // Set or update the dialog data without opening or closing the dialog
  const updateDialogData = useCallback((data: DialogData) => {
    setDialogData(data);
  }, []);

  // Toggle the dialog's open state
  const toggleDialog = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data: dialogData,
    setData: setDialogData,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    updateDialogData,
    toggle: toggleDialog,
  };
};

export default useDialog;
