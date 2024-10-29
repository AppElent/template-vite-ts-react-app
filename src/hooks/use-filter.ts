import { useState, useMemo, useEffect } from 'react';

interface Options {
  initialPage?: number;
  initialRowsPerPage?: number;
  limit?: number;
  initialSortField?: string | null;
  initialSortDirection?: 'asc' | 'desc';
  initialFilters?: Record<string, any>;
  searchableFields?: string[] | null;
  updateInitialData?: boolean;
}

interface UseFilterReturn {
  data: any[];
  setData: (data: any[]) => void;
  totalFilteredItems: number;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  sortField: string | null;
  setSortField: (sortField: string | null) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (sortDirection: 'asc' | 'desc') => void;
  filters: Record<string, any>;
  addFilter: (key: string, filterFunctionOrValue: any) => void;
  removeFilter: (key: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * A custom React hook that handles data filtering, sorting, pagination, search, and rows per page setting.
 *
 * @param {Array} initialData - The initial dataset to be filtered.
 * @param {Object} options - Configuration options for filtering, sorting, and pagination.
 * @param {number} [options.initialPage=0] - Initial page number (0-based).
 * @param {number} [options.initialRowsPerPage=10] - Number of items per page initially.
 * @param {number} [options.limit=Infinity] - Maximum number of items to be shown (hard limit).
 * @param {string|null} [options.initialSortField=null] - Field to sort by initially.
 * @param {'asc'|'desc'} [options.initialSortDirection='asc'] - Sort direction, 'asc' for ascending, 'desc' for descending.
 * @param {Object} [options.initialFilters={}] - Custom filters to be applied.
 * @param {Array|null} [options.searchableFields=null] - Fields to perform text search on. If not provided, all fields will be searched.
 *
 * @returns {Object} Returns the filtered, sorted, and paginated data along with functions to update the filters, sorting, pagination, search query, and rows per page.
 */
function useFilter(initialData: any[] = [], options: Options = {}): UseFilterReturn {
  const {
    initialPage = 0, // Start with page 0
    initialRowsPerPage = 10, // Initial rows per page
    limit = Infinity, // Hard limit for the number of items
    initialSortField = null,
    initialSortDirection = 'asc',
    initialFilters = {},
    searchableFields = null, // Default to null (indicating all fields will be used)
    updateInitialData = false,
  } = options;

  const [data, setData] = useState<any[]>(initialData); // Holds the current dataset
  const [page, setPage] = useState<number>(initialPage); // Tracks the current page (0-based)
  const [rowsPerPage, setRowsPerPage] = useState<number>(initialRowsPerPage); // Number of items to show per page
  const [sortField, setSortField] = useState<string | null>(initialSortField); // Field used for sorting
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection); // Sort direction ('asc' or 'desc')
  const [filters, setFilters] = useState(initialFilters); // Custom filters applied to the data
  const [searchQuery, setSearchQuery] = useState(''); // Text search query

  // Respond to changes in the initial data
  useEffect(() => {
    if (updateInitialData) setData(initialData);
  }, [initialData, updateInitialData]);

  /**
   * Adds or updates a filter.
   * @param {string} key - The key identifying the filter.
   * @param {Function|any} filterFunctionOrValue - The filter function or value to be applied.
   */
  const addFilter = (key: string, filterFunctionOrValue: string | (() => void)) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: filterFunctionOrValue,
    }));
  };

  /**
   * Removes a filter.
   * @param {string} key - The key identifying the filter to be removed.
   */
  const removeFilter = (key: string) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      delete newFilters[key];
      return newFilters;
    });
  };

  /**
   * Applies sorting to the dataset based on the sortField and sortDirection.
   * @param {Array} data - The dataset to be sorted.
   * @returns {Array} The sorted dataset.
   */
  const applySort = (data: any[]) => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  /**
   * Applies custom filters to the dataset.
   * @param {Array} data - The dataset to be filtered.
   * @returns {Array} The filtered dataset.
   */
  const applyFilters = (data: any[]) => {
    return data.filter((item: any) => {
      return Object.keys(filters).every((key) => {
        const filter = filters[key];
        if (typeof filter === 'function') {
          return filter(item);
        }
        return item[key] === filter;
      });
    });
  };

  /**
   * Applies text search to the dataset based on searchable fields or all fields.
   * @param {Array} data - The dataset to be searched.
   * @returns {Array} The filtered dataset that matches the search query.
   */
  const applyTextSearch = (data: any[]) => {
    if (!searchQuery) return data; // If no search query, return data unchanged

    const lowerCaseQuery = searchQuery.toLowerCase();

    return data.filter((item) => {
      // Use all fields if `searchableFields` is null
      const fieldsToSearch = searchableFields || Object.keys(item);

      return fieldsToSearch.some((field) => {
        const fieldValue = item[field];
        if (fieldValue) {
          return fieldValue.toString().toLowerCase().includes(lowerCaseQuery);
        }
        return false;
      });
    });
  };

  /**
   * Applies pagination to the dataset based on the current page (0-based) and rowsPerPage.
   * Then enforces the hard limit if necessary.
   * @param {Array} data - The dataset to be paginated.
   * @returns {Array} The paginated dataset.
   */
  const applyPagination = (data: any[]) => {
    const startIndex = page * rowsPerPage; // Start index for the current page (0-based)
    const endIndex = Math.min(startIndex + rowsPerPage, limit); // Ensure no more than `limit` items are returned
    return data.slice(startIndex, endIndex);
  };

  /**
   * Total items after applying filters and search, but before pagination is applied.
   */
  const totalFilteredItems = useMemo(() => {
    let processedData = applyFilters(data);
    processedData = applyTextSearch(processedData);
    processedData = applySort(processedData);
    return Math.min(processedData.length, limit); // Respect hard limit for total count
  }, [data, filters, searchQuery, sortField, sortDirection, limit]);

  // Memoized computation of filtered, sorted, searched, and paginated data
  const filteredData = useMemo(() => {
    let processedData = applyFilters(data);
    processedData = applyTextSearch(processedData);
    processedData = applySort(processedData);
    return applyPagination(processedData);
  }, [data, filters, searchQuery, sortField, sortDirection, page, rowsPerPage, limit]);

  /**
   * Reset the page to 0 whenever filters, searchQuery, sortField, or sortDirection change,
   * but only if the current page is not already 0 to avoid unnecessary resets.
   */
  useEffect(() => {
    if (page !== 0) {
      setPage(0);
    }
  }, [filters, searchQuery, sortField, sortDirection]);

  /**
   * Sets the number of rows per page and resets the page to 0.
   * @param {number} newRowsPerPage - The new number of rows per page.
   */
  const updateRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to page 0 when changing rows per page
  };

  // Return all necessary states and functions for controlling the filter, pagination, search, and sorting.
  return {
    data: filteredData,
    totalFilteredItems, // Total number of items after filters, search, and before pagination
    page,
    rowsPerPage,
    sortField,
    sortDirection,
    filters,
    searchQuery,
    setPage,
    setRowsPerPage: updateRowsPerPage, // This allows setting rows per page
    setSortField,
    setSortDirection,
    addFilter,
    removeFilter,
    setSearchQuery,
    setData,
  };
}

export default useFilter;
