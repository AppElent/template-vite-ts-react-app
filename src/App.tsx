import '@/config/firebase';
import { db } from '@/config/firebase';
import routes from '@/config/routes';
import { FirebaseAuthProvider } from '@/libs/auth';
import FirestoreDataSource from '@/libs/data-sources/data-sources/FirestoreDataSource';
import { recipeYupSchema } from '@/schemas/recipe';
import theme from '@/theme/paperbase/theme';
import './App.css';
import config from './config';
import Dashboard from './Dashboard';
import LocalStorageDataSource from './libs/data-sources/data-sources/LocalStorageDataSource';
import Recipe from './types/recipe';

const firebaseProvider = new FirebaseAuthProvider({ login: '/login', logout: '/logout' });

const dataSources = {
  recipes: new FirestoreDataSource<Recipe>(
    {
      target: 'recipes',
      targetMode: 'collection',
      YupValidationSchema: recipeYupSchema,
      subscribe: true,
    },
    { db }
  ),
  settings: new LocalStorageDataSource({ target: 'settings', targetMode: 'document' }),
};

function App() {
  console.log('App config', firebaseProvider, dataSources, routes, config);
  return (
    <>
      <Dashboard
        theme={theme}
        authProvider={firebaseProvider}
        routes={routes}
        dataSources={dataSources}
      />
    </>
  );
}

export default App;
