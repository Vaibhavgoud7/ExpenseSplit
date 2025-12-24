import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Restore user on refresh
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored && stored !== "undefined") {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const selectUser = (user) => {
    if (!user) {
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
  };

  return (
    <UserContext.Provider value={{ currentUser, selectUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
