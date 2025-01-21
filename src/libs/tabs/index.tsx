import Tabs from './tabs';

// Tabs data
export interface TabData {
  label: string;
  value: string;
  component: JSX.Element;
}

// eslint-disable-next-line react-refresh/only-export-components
export { default as useCurrentTab } from './use-current-tab';
// eslint-disable-next-line react-refresh/only-export-components
export { default as useTabs } from './use-tabs';

export default Tabs;
