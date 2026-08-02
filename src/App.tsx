import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/use-auth";
import { Login } from "./pages/auth/login";
import { ProtectedRoute } from "./components/common/protected-route";
import { AdminLayout } from "./layout/admin-layout";
import { StaffLayout } from "./layout/staff-layout";
import { OshpazPage } from "./pages/staff/oshpaz";
import { OfitsiantPage } from "./pages/staff/ofitsiant";
import { KassirPage } from "./pages/staff/kassir";
import { CustomerMenuPage } from "./pages/customer/CustomerMenuPage";
import { Dashboard } from "./pages/admin/dashboard";
import { StaffPage } from "./pages/admin/staff";
import { OrdersPage } from "./pages/admin/orders";
import { TablesPage } from "./pages/admin/tables";
import { MenuPage } from "./pages/admin/menu";
import { CategoriesPage } from "./pages/admin/categories";
import { Settings } from "./pages/admin/settings";
import { ADMIN_PATH } from "./routes/admin/admin.paths";

function App() {
  const { isAuthenticated, userRole } = useAuth();

  const isAdmin = userRole === "SUPER_ADMIN" || userRole === "ADMIN";

  const getStaffRedirect = () => {
    if (userRole === "OSHPAZ") return "/staff/oshpaz";
    if (userRole === "OFITSIANT") return "/staff/ofitsiant";
    if (userRole === "KASSIR") return "/staff/kassir";
    return "/login";
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? ADMIN_PATH.DASHBOARD : getStaffRedirect()} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route path="/table/:tableId" element={<CustomerMenuPage />} />

      <Route
        element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]} />}
      >
        <Route element={<AdminLayout />}>
          <Route
            path={ADMIN_PATH.ROOT}
            element={<Navigate to={ADMIN_PATH.DASHBOARD} replace />}
          />
          <Route path={ADMIN_PATH.DASHBOARD} element={<Dashboard />} />
          <Route path={ADMIN_PATH.STAFF} element={<StaffPage />} />
          <Route path={ADMIN_PATH.ORDERS} element={<OrdersPage />} />
          <Route path={ADMIN_PATH.TABLES} element={<TablesPage />} />
          <Route path={ADMIN_PATH.MENU} element={<MenuPage />} />
          <Route path={ADMIN_PATH.CATEGORIES} element={<CategoriesPage />} />
          <Route path={ADMIN_PATH.SETTINGS} element={<Settings />} />
        </Route>
      </Route>

      {/* Staff Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["KASSIR", "OFITSIANT", "OSHPAZ"]} />
        }
      >
        <Route element={<StaffLayout />}>
          <Route
            path="/staff"
            element={<Navigate to={getStaffRedirect()} replace />}
          />
          <Route path="/staff/oshpaz" element={<OshpazPage />} />
          <Route path="/staff/ofitsiant" element={<OfitsiantPage />} />
          <Route path="/staff/kassir" element={<KassirPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
