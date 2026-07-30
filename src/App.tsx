import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/use-auth";
import { Login } from "./pages/auth/login";
import { ProtectedRoute } from "./components/common/protected-route";
import { AdminLayout } from "./layout/admin-layout";
import { StaffLayout } from "./layout/staff-layout";
import { Dashboard } from "./pages/admin/dashboard";
import { StaffPage } from "./pages/admin/staff";
import { OrdersPage } from "./pages/admin/orders";
import { TablesPage } from "./pages/admin/tables";
import { MenuPage } from "./pages/admin/menu";
import { ADMIN_PATH } from "./routes/admin/admin.paths";

function App() {
  const { isAuthenticated, userRole } = useAuth();

  const isAdmin = userRole === "SUPER_ADMIN" || userRole === "ADMIN";

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? ADMIN_PATH.DASHBOARD : "/staff"} replace />
          ) : (
            <Login />
          )
        }
      />

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
          {/* Placeholder pages */}
          <Route
            path={ADMIN_PATH.SETTINGS}
            element={
              <div className="text-gray-500 text-sm">
                Sozlamalar sahifasi (keyingi bosqichda)
              </div>
            }
          />
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
            element={
              <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">👷‍♂️</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Xush kelibsiz!
                </h2>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  Siz xodim sifatida tizimga kirdingiz. Bu sahifa tez orada
                  kerakli vositalar bilan to'ldiriladi. Ungacha yuqori o'ng
                  burchakdagi tugma orqali chiqishingiz mumkin.
                </p>
              </div>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
