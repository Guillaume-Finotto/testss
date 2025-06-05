import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("breezy_access_token");
    if (token) {
      const savedUser = JSON.parse(localStorage.getItem("breezy_user"));
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const signin = async (email, password) => {
    try {
      const response = await api.post("/auth/signin", { email, password });
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem("breezy_access_token", accessToken);
      localStorage.setItem("breezy_refresh_token", refreshToken);
      localStorage.setItem("breezy_user", JSON.stringify(user));
      setUser(user);
      navigate("/feed");
    } catch (err) {
      throw err;
    }
  };

  const signup = async (email, username, password) => {
    try {
      await api.post("/auth/signup", { email, username, password });
      navigate("/login");
    } catch (err) {
      throw err;
    }
  };

  const signout = () => {
    localStorage.removeItem("breezy_access_token");
    localStorage.removeItem("breezy_refresh_token");
    localStorage.removeItem("breezy_user");
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    loading,
    signin,
    signup,
    signout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
