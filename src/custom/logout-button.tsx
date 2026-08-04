import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "@/config/request";
import { useLanguage } from "@/context/LanguageContext";

export const LogoutButton = () => {
  const { logout, userRole } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      const isAdmin = userRole === "SUPER_ADMIN" || userRole === "ADMIN";
      const endpoint = isAdmin
        ? "/auth/admin/sign-out"
        : "/auth/staff/sign-out";
      await API.post(endpoint);
    } catch (err) {
      console.error("Logout failed on backend", err);
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 shadow-sm dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20"
    >
      <LogOut size={16} />
      <span>{t("Chiqish")}</span>
    </button>
  );
};
