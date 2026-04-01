import { Outlet, Navigate } from "react-router";
import { useApp } from "../context/AppContext";

export default function AuthLayout() {
  const { user } = useApp();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
}
