import './App.css'
import  '@/config/firebase';
import Dashboard from './Dashboard'
import theme from '@/theme/paperbase/theme';
import { FirebaseAuthProvider } from '@/libs/auth';
import routes from '@/config/routes';
import config from './config';
import { db } from '@/config/firebase';
import FirebaseDataSource from '@/libs/data-sources/data-sources/FirebaseDataSource';
import FirebaseDataSourceNoRealtime from '@/libs/data-sources/data-sources/FirebaseDataSourceNoRealtime';

const firebaseProvider = new FirebaseAuthProvider({login: '/login', logout: '/logout'});
// const datasources = [
//   {provider: 'firestore', key: 'recipes', options: {target: 'recipes', targetMode: 'collection'}, providerConfig: { db}},
// ]

const dataSources = [
  // { key: 'dummy', dataSource: new FirebaseDataSource(db, 'dummy') },
  // { key: 'dummy2', dataSource: new FirebaseDataSourceNoRealtime(db, 'dummy') },
  {key: 'recipes', dataSource: new FirebaseDataSource({target: 'recipes', targetMode: 'collection'}, {db})},
  // {key: 'dummy', dataSource: new FirebaseDataSource({target: 'dummy', targetMode: 'collection'}, {db})},
  // {key: 'dummy2', dataSource: new FirebaseDataSourceNoRealtime({target: 'dummy', targetMode: 'collection'}, {db})},
]

function App() {
  console.log('App config', firebaseProvider, dataSources, routes, config)
  return (
    <>
      <Dashboard 
        theme={theme}
        authProvider={firebaseProvider}
        routes={routes}
        dataSources={dataSources}
      />
    </> 
  )
}

export default App
