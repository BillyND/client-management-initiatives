import { Layout } from "antd";
import React from "react";
import { useLocation } from "react-router-dom";
import { MainHeader } from "./Header";
import { MainContent } from "./MainContent";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ["/auth"].includes(location.pathname);

  if (isAuthPage) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#EFF2F5" }}>
        {children}
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MainHeader />
      <MainContent>{children}</MainContent>
    </Layout>
  );
};

export default MainLayout;
