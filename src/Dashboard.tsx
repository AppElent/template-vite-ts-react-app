import { useEffect, FC } from 'react';
import useRouter from '@/hooks/use-router';
import useHttpsRedirect from '@/hooks/use-https-redirect';
import { useRoutes } from 'react-router-dom';
import { ConfirmProvider } from 'material-ui-confirm';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import PropTypes from 'prop-types';
import { Seo, setPageTitleSuffix } from '@/components/default/seo';
import { ThemeProvider, Theme } from '@mui/material';
import defaultRoutes from '@/routes/defaultRoutes';
import config from '@/config';
import { AuthConsumer, AuthProvider } from '@/libs/auth';
import { SplashScreen } from '@/components/default/splash-screen';
import IssueDialog from '@/components/default/issue-dialog';
import useDialog from '@/hooks/use-dialog';
import { DataProvider } from './libs/data-sources';
import { DataSource } from './libs/data-sources/DataProvider';

interface DashboardProps {
  theme: Theme;
  routes?: any[];
  authProvider?: any;
  dataSources?: DataSource[];
}

const Dashboard: FC<DashboardProps> = ({ theme, routes, authProvider, dataSources }) => {
  //const { theme, routes, authProvider, dataSources } = props;
  // Redirect to HTTPS
  useHttpsRedirect(config?.paths?.httpsRedirect || false);

  // Issue dialog
  const dialog = useDialog();
  config.issueDialog = {
    open: dialog.open,
    close: dialog.close,
  };

  // Custom redirect from root page
  const navigate = useRouter();
  useEffect(() => {
    if (config?.paths?.rootRedirect && window.location.pathname === '/')
      navigate.push(config.paths.rootRedirect);
  }, [navigate]);

  // Initialize routes
  const element = useRoutes(routes || defaultRoutes);

  // Set HTML page title suffix
  if (config?.meta?.title) setPageTitleSuffix(config?.meta?.title);
  console.log(123);
  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthProvider provider={authProvider}>
          <AuthConsumer>
            {(auth) => {
              // Check if splashscreen should be shown
              const showSlashScreen = !auth.isInitialized;
              if (showSlashScreen) return <SplashScreen />;

              return (
                <>
                  <DataProvider dataSources={dataSources || []}>
                    <QueryParamProvider adapter={ReactRouter6Adapter}>
                      <ConfirmProvider>
                        <Seo />
                        <IssueDialog
                          onSave={(values) => console.log(values)}
                          open={dialog.isOpen}
                          onClose={() => dialog.close()}
                        />
                        {element}
                      </ConfirmProvider>
                    </QueryParamProvider>
                  </DataProvider>
                </>
              );
            }}
          </AuthConsumer>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

Dashboard.propTypes = {
  theme: PropTypes.any.isRequired,
  routes: PropTypes.array,
  dataSources: PropTypes.array,
  authProvider: PropTypes.any,
};

export default Dashboard;
