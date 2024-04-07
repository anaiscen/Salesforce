import { useState, useContext, createContext } from "react";

const UserContext = createContext(null);

// eslint-disable-next-line react/prop-types
function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

export default UserProvider;
