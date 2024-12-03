import { useContext } from 'react';
import { AuthContext } from './context';

interface UseAuthOptions {
  redirectUnauthenticated?: string;
}

const useAuth = (_options?: UseAuthOptions) => {
  const context = useContext(AuthContext);

  return context;
};

export default useAuth;
