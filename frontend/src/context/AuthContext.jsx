import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/mockApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = authApi.getSession();
    setUser(session);
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    const res = await authApi.login(email, password, role);
    if (res.success) setUser(res.user);
    return res;
  };

  const loginWithOtp = async (payload) => {
    const res = await authApi.loginWithOtp(payload);
    if (res.success) setUser(res.user);
    return res;
  };

  const loginWithSocial = async (payload) => {
    const res = await authApi.loginWithSocial(payload);
    if (res.success) setUser(res.user);
    return res;
  };

  const loginDemo = async (demoKey) => {
    const res = await authApi.loginDemo(demoKey);
    if (res.success) setUser(res.user);
    return res;
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        loginWithOtp,
        loginWithSocial,
        loginDemo,
        sendOtp: authApi.sendOtp,
        verifyOtp: authApi.verifyOtp,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
