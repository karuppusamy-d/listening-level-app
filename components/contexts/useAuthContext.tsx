"use client";
import {
  ReactElement,
  ReactNode,
  useContext,
  useState,
  createContext,
  useEffect,
} from "react";
import axios, { AxiosResponse } from "axios";
import { decode } from "jsonwebtoken";
import { User, UserJWT } from "../types/user";
import * as db from "@/utils/indexedDB";

// Type definitions for useAuthContext
type AuthProviderType = ({ children }: { children: ReactNode }) => ReactElement;
type Login = (email: string, password: string) => Promise<User>;
type Signup = (email: string, password: string) => Promise<User>;
type ContextValue = {
  currentUser: User | null;
  login: Login;
  signup: Signup;
  logout: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  // updateEmail: (email: string) => Promise<boolean> | null;
  // updatePassword: (password: string) => Promise<boolean> | null;
  // verifyEmail: () => Promise<boolean> | null;
};

// Create the context
const AuthContext = createContext<ContextValue | undefined>(undefined);

// Use the context
const useAuthContext = (): ContextValue => {
  return useContext(AuthContext) as ContextValue;
};

// Create the provider
const AuthProvider: AuthProviderType = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initializeUser = async () => {
    try {
      const status = await db.initDB();
      if (status) {
        const user = await db.getUser();
        setCurrentUser(user);
      }
    } catch (err: unknown) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const decodedToken = decode(currentUser.access_token) as UserJWT;
      if (Math.floor(Date.now() / 1000) >= decodedToken.exp) {
        logout();
      }
    }
  }, [currentUser]);

  const login: Login = async (email, password) => {
    const res: AxiosResponse<User> = await axios.post("/api/login", {
      email,
      password,
    });
    const user = res.data;
    db.addUser(user);
    setCurrentUser(user);
    return user;
  };

  const signup: Login = async (email, password) => {
    const res: AxiosResponse<User> = await axios.post("/api/signup", {
      email,
      password,
    });
    const user = res.data;
    setCurrentUser(user);
    return user;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const res: AxiosResponse<{ email: string }> = await axios.post(
      "/api/resetPassword",
      {
        email,
      }
    );
    const result = res.data.email === email;
    return result;
  };

  const logout = async () => {
    const result = await db.deleteUser();
    if (result) {
      setCurrentUser(null);
      return true;
    }
    return false;
  };

  const value = {
    currentUser,
    login,
    signup,
    resetPassword,
    logout,
  };

  // Return the provider
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center h-[100vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuthContext };
export default AuthContext;
