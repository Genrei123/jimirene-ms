import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  userRole: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userRole: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize userRole from localStorage
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));

  const login = (token: string, role: string) => {
    // Save the token and role in localStorage, using lowercase for consistency
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    setUserRole(role);  // Update state with role
  };

  const logout = () => {
    // Remove the token and role from localStorage and reset state
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUserRole(null);  // Reset userRole state to null
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
