import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../constants/roles.constants.tsx";

const HomePage: React.FC = () => {
  const user = useAuthStore(({ user }) => user);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect users with USER role to initiatives page
    if (user?.roles?.includes(ROLES.USER)) {
      navigate("/my-initiatives");
    }
  }, [user, navigate]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      Home
    </div>
  );
};

export default HomePage;
