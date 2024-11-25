import { ConfigProvider } from "antd";
import viVN from "antd/lib/locale/vi_VN";
import React, { useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { LoadingScreen } from "./components/LoadingScreen";
import { MainLayout } from "./layouts/MainLayout";
import AuthPage from "./pages/AuthPage";
import EvaluationPage from "./pages/EvaluationPage";
import HomePage from "./pages/HomePage";
import InitiativeListPage from "./pages/InitiativeListPage";
import ReportsPage from "./pages/ReportsPage";
import SubmitInitiativePage from "./pages/SubmitInitiativePage";
import { authService } from "./services";
import { useAuthStore } from "./store/useAuthStore";
import MyInitiativesPage from "./pages/MyInitiativesPage";
import ChangePassword from "./pages/ChangePassword";
import ProfilePage from "./pages/ProfilePage";
import UserManagementPage from "./pages/UserManagementPage";

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{ token: { colorPrimary: "#11b75c" } }}
    >
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
            <Route path="users" element={<UserManagementPage />} />
          </Routes>
        </MainLayout>
      </AuthWrapper>
    </ConfigProvider>
  );
};

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/auth";

  // Handle authentication verification and navigation
  const handleAuthVerification = useCallback(
    async (user: any) => {
      setAuth(user);

      if (user) {
        navigate(isAuthPage ? "/" : pathname);
      } else {
        navigate("/auth");
      }
    },
    [setAuth, navigate, isAuthPage, pathname]
  );

  // Verify authentication status
  const verifyAuth = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const user = await authService.verifyToken();
      await handleAuthVerification(user);
    } catch (error) {
      console.log(error);
      navigate("/auth");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, handleAuthVerification, navigate]);

  useEffect(() => {
    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthPage]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default App;
