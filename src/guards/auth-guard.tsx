import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import useRouter from '@/hooks/use-router';
import { useAuth } from '@/libs/auth';

const AuthGuard = (props: any) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated, issuer, options } = useAuth();
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (options.login && !isAuthenticated && window.location.pathname !== options?.login) {
      const searchParams = new URLSearchParams({ returnTo: window.location.pathname }).toString();
      const href = options.login + `?${searchParams}`;
      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router, options.login]);

  // Only check on mount, this allows us to redirect the user manually when auth state changes
  useEffect(
    () => {
      check();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated]
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return <>{children}</>;
};

export default AuthGuard;

AuthGuard.propTypes = {
  children: PropTypes.node,
};
