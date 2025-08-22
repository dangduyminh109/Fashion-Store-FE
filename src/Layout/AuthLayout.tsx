import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <>
      <h1>auth layout</h1>
      <Outlet />
    </>
  );
}

export default AuthLayout;
