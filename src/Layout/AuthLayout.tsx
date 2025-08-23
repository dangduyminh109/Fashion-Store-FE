import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <h1>auth layout</h1>
      <Outlet />
    </>
  );
};

export default AuthLayout;
