import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthenticatedUser } from './auth';
import { APP_ROUTES } from '../utils/constants';

export function useUser() {
  const [user, setUser] = useState(null);
  const [authenticated, setAutenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      if (!authenticated) {
        navigate(APP_ROUTES.SIGN_IN);
        return;
      }
      setUser(user);
      setAutenticated(authenticated);
    }
    getUserDetails();
  }, []);

  return { user, authenticated };
}
