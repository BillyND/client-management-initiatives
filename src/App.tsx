import { ConfigProvider } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { LoadingScreen } from "./components/LoadingScreen.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./constants/roles.constants.tsx";
import { MainLayout } from "./layouts/MainLayout";
import AuthPage from "./pages/AuthPage";
import ChangePassword from "./pages/ChangePassword";
import EvaluationPage from "./pages/EvaluationPage";
import HomePage from "./pages/HomePage";
import InitiativeListPage from "./pages/InitiativeListPage";
import MyInitiativesPage from "./pages/MyInitiativesPage";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import SubmitInitiativePage from "./pages/SubmitInitiativePage";
import UserManagementPage from "./pages/UserManagementPage";
import { authService } from "./services/authService.ts";
import { useAuthStore } from "./store/useAuthStore.ts";

const App: React.FC = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#11b75c" } }}>
      <AuthWrapper>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/my-initiatives" element={<MyInitiativesPage />} />
            <Route
              path="/submit-initiative"
              element={<SubmitInitiativePage />}
            />
            <Route path="/initiatives" element={<InitiativeListPage />} />
            <Route path="/evaluate" element={<EvaluationPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MainLayout>
      </AuthWrapper>
    </ConfigProvider>
  );
};

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/auth";

  const [isLoading, setIsLoading] = useState(false);
  const { setAuth, user, accessToken } = useAuthStore();
  console.log("===>user", user, accessToken);

  // Verify authentication status
  const verifyAuth = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const user = await authService.verifyToken();

      // Redirect if authenticated
      if (user && isAuthPage) {
        navigate("/");
      } else if (!user && !isAuthPage) {
        navigate("/auth");
      }

      setAuth(user);
    } catch (error) {
      console.error(error);

      if (!isAuthPage) {
        navigate("/auth");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isAuthPage, setAuth, navigate]);

  useEffect(() => {
    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default App;
