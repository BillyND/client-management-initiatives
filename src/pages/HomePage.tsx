import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const user = useAuthStore(({ user }) => user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "user") {
      navigate("/my-initiatives");
    }
  }, [user, navigate]);

  console.log("===>user", user);

  return <div style={{ textAlign: "center", marginTop: "50px" }}>Home</div>;
};

export default HomePage;
