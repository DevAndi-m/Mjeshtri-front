import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Runs once on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fullName = localStorage.getItem("fullName");
    const role = localStorage.getItem("role");

    if (token && fullName) {
      setUser({ fullName, role });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("fullName", data.fullName);
    localStorage.setItem("role", data.role);

    setUser({
      fullName: data.fullName,
      role: data.role
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
