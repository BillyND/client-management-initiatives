import { Grid, Layout } from "antd";

const { Content } = Layout;
const { useBreakpoint } = Grid;

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const { xs } = useBreakpoint();

  return (
    <div
      style={{
        maxWidth: xs ? "100%" : "1200px",
        margin: "0 auto",
        width: "100%",
        padding: xs ? "0" : "0 16px",
      }}
    >
      <Content
        style={{
          padding: 16,
          margin: xs ? "0" : "16px",
          background: "#fff",
          borderRadius: 6,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          minHeight: 280,
        }}
      >
        {children}
      </Content>
    </div>
  );
};
