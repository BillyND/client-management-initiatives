import React from "react";
import { Typography, Button, Space } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

const HomePage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Title>Hệ thống quản lý và chấm sáng kiến trực tuyến</Title>
      <Space direction="vertical" size="large" style={{ marginTop: "20px" }}>
        <Button type="primary">
          <Link to="/submit">Gửi sáng kiến</Link>
        </Button>
        <Button>
          <Link to="/initiatives">Xem danh sách sáng kiến</Link>
        </Button>
        <Button>
          <Link to="/evaluate">Chấm điểm sáng kiến</Link>
        </Button>
        <Button>
          <Link to="/reports">Xem báo cáo</Link>
        </Button>
      </Space>
    </div>
  );
};

export default HomePage;
