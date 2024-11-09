import useRouter from '@/hooks/use-router';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useReducer } from 'react';

export const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  raw: null,
  options: { login: null },
  provider: null,
};

const AuthContext = createContext({
  ...initialState,
  issuer: 'FIREBASE',
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});

export const AuthConsumer = AuthContext.Consumer;

export const useAuth = () => useContext(AuthContext);

const reducer = (state: any, action: any) => {
  if (action.type === 'AUTH_STATE_CHANGED') {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

export const AuthProvider = (props: any) => {
  const { provider, children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const handleAuthStateChanged = async (user: any) => {
    console.log('User authentication changed', { user, provider });
    if (user) {
      // Here you should extract the complete user profile to make it available in your entire app.
      // The auth state only provides basic information.
      dispatch({
        type: 'AUTH_STATE_CHANGED',
        payload: {
          isAuthenticated: true,
          user: await provider.getCurrentUser(),
        },
      });
    } else {
      dispatch({
        type: 'AUTH_STATE_CHANGED',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
      router.replace(provider?.paths?.login || '/');
    }
  };

  useEffect(() => provider.onAuthStateChanged(handleAuthStateChanged)(), [provider]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: provider.provider,
        signUp: provider.signUp,
        signInWithEmailAndPassword: provider.signIn,
        signInWithGoogle: provider.signInWithGoogle,
        signOut: provider.signOut,
        options: provider.options,
        provider,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  provider: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};
