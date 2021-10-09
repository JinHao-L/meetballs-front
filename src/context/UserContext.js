import React, { createContext, useState, useEffect } from 'react';
import { accessTokenKey } from '../common/CommonValues';
import { refresh } from '../services/auth';
import { getUser } from '../services/user';

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // init connection with background and maintain synced data
  useEffect(() => {
    const updateUser = async () => {
      const token = sessionStorage.getItem(accessTokenKey);
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const user = await getUser();
        setUser(user.data);
      } catch (err) {
        console.log('Error getting user', err)
      }
    };
    document.addEventListener(accessTokenKey, updateUser, false);
    refresh().catch((err) => console.log('refresh failed'));

    return () => {
      document.removeEventListener(accessTokenKey, updateUser, false);
    };
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
