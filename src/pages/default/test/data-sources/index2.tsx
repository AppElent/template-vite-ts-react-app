import Tabs from '@/libs/tabs';
import DefaultPage from '@/pages/default/DefaultPage';

const tabsData = [
  {
    label: 'Item One',
    value: 'itemOne',
    component: <div>Item One</div>,
  },
  {
    label: 'Item Two',
    value: 'itemTwo',
    component: <div>Item Two</div>,
  },
  {
    label: 'Item Three',
    value: 'itemThree',
    component: <div>Item Three</div>,
  },
  {
    label: 'Item Four',
    value: 'itemFour',
    component: <div>Item Fout</div>,
  },
  {
    label: 'Item Five',
    value: 'itemFive',
    component: <div>Item Five</div>,
  },
  {
    label: 'Item Six',
    value: 'itemSix',
    component: <div>Item Six</div>,
  },
  {
    label: 'Item Seven',
    value: 'itemSeven',
    component: <div>Item Seven</div>,
  },
];

const DataSources = () => {
  return (
    <DefaultPage>
      <Tabs
        tabs={tabsData}
        tabOptions={{ queryParamName: 'tab' }}
      />
    </DefaultPage>
  );
};

export default DataSources;
