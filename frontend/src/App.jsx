import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AccountLayout from "./layouts/AccountLayout";
import AdminLayout from "./layouts/AdminLayout";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import FreeContentListPage from "./pages/FreeContentListPage";
import FreeContentDetailPage from "./pages/FreeContentDetailPage";
import PacksCatalogPage from "./pages/PacksCatalogPage";
import PackDetailPage from "./pages/PackDetailPage";
import SubPackDetailPage from "./pages/SubPackDetailPage";
import RoutineDetailPage from "./pages/RoutineDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PersonalizedPage from "./pages/PersonalizedPage";

import ProfilePage from "./pages/account/ProfilePage";
import MyPacksPage from "./pages/account/MyPacksPage";
import CalendarPage from "./pages/account/CalendarPage";
import FavoritesPage from "./pages/account/FavoritesPage";
import HistoryPage from "./pages/account/HistoryPage";
import WalksPage from "./pages/account/WalksPage";
import ChecksPage from "./pages/account/ChecksPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminPacksPage from "./pages/admin/AdminPacksPage";
import AdminFreeContentPage from "./pages/admin/AdminFreeContentPage";
import AdminPurchasesPage from "./pages/admin/AdminPurchasesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminPersonalizedPage from "./pages/admin/AdminPersonalizedPage";

import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      {/* Publico */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/gratis" element={<FreeContentListPage />} />
        <Route path="/gratis/:id" element={<FreeContentDetailPage />} />
        <Route path="/packs" element={<PacksCatalogPage />} />
        <Route path="/packs/:slug" element={<PackDetailPage />} />
        <Route path="/sub-packs/:id" element={<SubPackDetailPage />} />
        <Route path="/personalizados" element={<PersonalizedPage />} />
        <Route path="/ingresar" element={<LoginPage />} />
        <Route path="/crear-cuenta" element={<RegisterPage />} />

        {/* Requieren sesion pero conservan navbar/footer publicos */}
        <Route path="/rutinas/:id" element={<ProtectedRoute><RoutineDetailPage /></ProtectedRoute>} />
        <Route path="/checkout/:subPackId" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />

        {/* Cuenta de usuario */}
        <Route
          path="/cuenta"
          element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfilePage />} />
          <Route path="packs" element={<MyPacksPage />} />
          <Route path="calendario" element={<CalendarPage />} />
          <Route path="favoritos" element={<FavoritesPage />} />
          <Route path="historial" element={<HistoryPage />} />
          <Route path="caminatas" element={<WalksPage />} />
          <Route path="checks" element={<ChecksPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Panel admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="packs" element={<AdminPacksPage />} />
        <Route path="contenido-gratis" element={<AdminFreeContentPage />} />
        <Route path="compras" element={<AdminPurchasesPage />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="personalizados" element={<AdminPersonalizedPage />} />
      </Route>
    </Routes>
  );
}
