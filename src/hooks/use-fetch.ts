import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions extends RequestInit {
  autoFetch?: boolean;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: () => void;
}

function useFetch<T = unknown>(url: string, options: UseFetchOptions = {}): UseFetchResult<T> {
  const { autoFetch = true, ...fetchOptions } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result: T = await response.json();
      setData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, fetchOptions]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return { data, loading, error, fetchData };
}

export default useFetch;
