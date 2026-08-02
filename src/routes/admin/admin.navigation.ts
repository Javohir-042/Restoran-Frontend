import {
    LayoutDashboard,
    Users,
    ClipboardList,
    Armchair,
    UtensilsCrossed,
    Tags,
    Settings,
} from "lucide-react";
import { ADMIN_PATH } from "./admin.paths";

export const adminNavigation = [
    { id: "dashboard", label: "Dashboard", path: ADMIN_PATH.DASHBOARD, icon: LayoutDashboard },
    { id: "staff", label: "Xodimlar", path: ADMIN_PATH.STAFF, icon: Users },
    { id: "orders", label: "Buyurtmalar", path: ADMIN_PATH.ORDERS, icon: ClipboardList },
    { id: "tables", label: "Stollar", path: ADMIN_PATH.TABLES, icon: Armchair },
    { id: "menu", label: "Menyu", path: ADMIN_PATH.MENU, icon: UtensilsCrossed },
    { id: "categories", label: "Turkumlar", path: ADMIN_PATH.CATEGORIES, icon: Tags },
    { id: "settings", label: "Sozlamalar", path: ADMIN_PATH.SETTINGS, icon: Settings },
];