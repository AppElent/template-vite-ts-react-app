import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseDialogReturn {
  isOpen: boolean;
  data: any | null;
  setData: (data: any | null) => void;
  open: (value?: string) => void;
  close: () => void;
  updateDialogData: (data: any) => void;
  toggle: () => void;
}

interface UseDialogOptionsProps {
  queryKey?: string; // If querykey is set, the dialog data is stored in the URL
  initialData?: any;
}

const useDialog = (options?: UseDialogOptionsProps): UseDialogReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<any | null>(options?.initialData);
  const [queryParams, setQueryParams] = useSearchParams();
  const queryKeyRef = useRef(options?.queryKey);

  // Update the ref when options.queryKey changes
  useEffect(() => {
    if (options?.queryKey !== queryKeyRef.current && options?.queryKey) {
      queryKeyRef.current = options.queryKey;
    }
  }, [options?.queryKey]);

  // Get query value from URL
  const queryValue = useMemo(() => {
    if (queryKeyRef.current) {
      return queryParams.get(queryKeyRef.current);
    }
  }, [queryParams]);

  // Determine if the dialog is open based on the query value OR the state variable
  const isOpenDef = useMemo(() => {
    if (queryKeyRef.current) {
      return !!queryValue;
    } else {
      return isOpen;
    }
  }, [isOpen, queryValue]);

  const setData = useCallback((data: any | null) => {
    if (queryKeyRef.current) {
      if (data) {
        queryParams.set(queryKeyRef.current, data);
      } else {
        queryParams.delete(queryKeyRef.current);
      }
      setQueryParams(queryParams);
    } else {
      setDialogData(data);
    }
  }, []);

  // Respond to changes in the query value
  useEffect(() => {
    if (queryKeyRef.current) {
      if (queryValue) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  }, [queryValue]);

  // Open the dialog
  const openDialog = useCallback(
    (value?: string) => {
      if (queryKeyRef.current) {
        if (value) {
          queryParams.set(queryKeyRef.current, value);
        } else {
          queryParams.delete(queryKeyRef.current);
        }
        setQueryParams(queryParams);
      } else {
        if (value) {
          setDialogData(value);
        }
        setIsOpen(true);
      }
    },
    [queryParams, setQueryParams]
  );

  // Close the dialog
  const closeDialog = useCallback(() => {
    if (queryKeyRef.current) {
      queryParams.delete(queryKeyRef.current);
      setQueryParams(queryParams);
    } else {
      setIsOpen(false);
    }
  }, [setQueryParams, queryParams]);

  // useEffect(() => {
  //   setDialogData(initialData);
  // }, [initialData]);

  // Set or update the dialog data without opening or closing the dialog
  const updateDialogData = useCallback((data: any) => {
    setDialogData(data);
  }, []);

  // Toggle the dialog's open state
  const toggleDialog = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen: isOpenDef,
    data: queryKeyRef.current ? queryValue : dialogData,
    setData: setData,
    open: openDialog,
    close: closeDialog,
    updateDialogData,
    toggle: toggleDialog,
  };
};

export default useDialog;
