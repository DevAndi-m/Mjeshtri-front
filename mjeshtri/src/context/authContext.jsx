import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state directly from localStorage to avoid cascading renders
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const fullName = localStorage.getItem("fullName");
    const role = localStorage.getItem("role");

    return token && fullName ? { fullName, role, token } : null;
  });

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("fullName", data.fullName);
    localStorage.setItem("role", data.role);

    setUser({
      fullName: data.fullName,
      role: data.role,
      token: data.token
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

// If Vite complains about "Fast Refresh", it's usually because 
// of multiple exports. This structure is generally fine, 
// but ensure you aren't exporting other non-component variables here.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};