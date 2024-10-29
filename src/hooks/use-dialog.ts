import { useState, useCallback, useEffect } from 'react';

interface UseDialogReturn {
  isOpen: boolean;
  data: any | null;
  setData: (data: any | null) => void;
  open: () => void;
  close: () => void;
  updateDialogData: (data: any) => void;
  toggle: () => void;
}

const useDialog = (initialData: any | null = null): UseDialogReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<any | null>(initialData);

  useEffect(() => {
    setDialogData(initialData);
  }, [initialData]);

  // Set or update the dialog data without opening or closing the dialog
  const updateDialogData = useCallback((data: any) => {
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
