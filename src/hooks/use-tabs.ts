import { useCallback, useEffect, useState } from 'react';

interface TabData {
  label: string;
  value: string;
}

const useTabs = (tabsData: TabData[], options?: any) => {
  const { initialData, queryParamName } = options || {};
  const getValue = () => {
    if (queryParamName) {
      // If there is a query param named tab then set that tab
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(queryParamName);
    } else if (initialData) {
      return initialData;
    } else {
      if (tabsData && tabsData.length > 0) {
        return tabsData[0].value;
      }
    }
  };
  const [tab, setTab] = useState(getValue());
  // TODO: fix this hook
  const [query, setQuery] = [
    '',
    (value: any) => {
      console.log(value);
    },
  ];

  useEffect(() => {
    if (queryParamName) {
      // If there is a query param named tab then set that tab
      if (query) {
        setTab(query);
      }
    }
  }, [queryParamName, query]);

  const handleTabChange = useCallback((_e: any, newValue: any) => {
    if (queryParamName && setQuery) {
      setQuery(newValue);
    } else {
      setTab(newValue);
    }
  }, []);

  return { tab, handleTabChange, setTab, tabsData };
};

export default useTabs;
