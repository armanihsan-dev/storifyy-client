import { getCurrectUser } from '../API/userAPI';
import { createContext, useEffect, useState } from 'react';

const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrectUser('http://localhost:3000');
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to fetch current user', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // <--- IMPORTANT
  return (
    <CurrentUserContext.Provider value={{ currentUser, loading }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserContext;
