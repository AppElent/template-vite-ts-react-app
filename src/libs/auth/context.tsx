import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useContext, ReactNode, Dispatch } from 'react';
import useRouter from '@/hooks/use-router';

// Define types for the state and actions
interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: any;
  raw: any;
  paths: { login: string | null };
  provider: any;
}

interface AuthAction {
  type: 'AUTH_STATE_CHANGED';
  payload: {
    isAuthenticated: boolean;
    user: any;
  };
}

interface AuthContextType extends AuthState {
  issuer: string;
  createUserWithEmailAndPassword: () => Promise<void>;
  signInWithEmailAndPassword: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  provider: any;
  children: ReactNode;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  raw: null,
  paths: { login: null },
  provider: null,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  issuer: 'FIREBASE',
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});

export const AuthConsumer = AuthContext.Consumer;

export const useAuth = () => useContext(AuthContext);

const reducer = (state: AuthState, action: AuthAction): AuthState => {
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

export const AuthProvider: React.FC<AuthProviderProps> = (props) => {
  const { provider, children } = props;
  const [state, dispatch] = useReducer<Dispatch<AuthAction>>(reducer, initialState);
  const router = useRouter();

  const handleAuthStateChanged = async (user: any) => {
    console.log('User authentication changed', { user, provider });
    if (user) {
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
        paths: provider.paths,
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
