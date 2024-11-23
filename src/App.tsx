import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import viVN from "antd/lib/locale/vi_VN";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import SubmitInitiativePage from "./pages/SubmitInitiativePage";
import InitiativeListPage from "./pages/InitiativeListPage";
import EvaluationPage from "./pages/EvaluationPage";
import ReportsPage from "./pages/ReportsPage";
import AuthPage from "./pages/AuthPage";

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{ token: { colorPrimary: "#11b75c" } }}
    >
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit" element={<SubmitInitiativePage />} />
            <Route path="/initiatives" element={<InitiativeListPage />} />
            <Route path="/evaluate" element={<EvaluationPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ConfigProvider>
  );
};

export default App;
