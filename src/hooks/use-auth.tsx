import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { TUserRole } from "@/types/types";
import Cookies from "js-cookie";

interface AuthState {
  isAuthenticated: boolean;
  userRole: TUserRole | null;
  userName: string | null;
  userAvatar: string | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, role: TUserRole, name?: string) => void;
  logout: () => void;
  updateProfile: (name: string, avatarUrl: string | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userRole: null,
    userName: null,
    userAvatar: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = localStorage.getItem("userRole") as TUserRole | null;
    const name = localStorage.getItem("userName");
    const avatar = localStorage.getItem("userAvatar");

    if (token && role) {
      setAuthState({ isAuthenticated: true, userRole: role, userName: name, userAvatar: avatar });
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, role: TUserRole, name?: string) => {
    const isStaffRole = role !== "SUPER_ADMIN" && role !== "ADMIN";
    Cookies.set("token", token, { expires: isStaffRole ? 0.5 : 7 });

    localStorage.setItem("userRole", role);
    if (name) localStorage.setItem("userName", name);

    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: true,
      userRole: role,
      userName: name ?? null,
    }));
  };

  const updateProfile = (name: string, avatarUrl: string | null) => {
    localStorage.setItem("userName", name);
    if (avatarUrl) {
      localStorage.setItem("userAvatar", avatarUrl);
    } else {
      localStorage.removeItem("userAvatar");
    }

    setAuthState((prev) => ({
      ...prev,
      userName: name,
      userAvatar: avatarUrl,
    }));
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatar");
    setAuthState({ isAuthenticated: false, userRole: null, userName: null, userAvatar: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
