import { Navigate } from "react-router";

export default function LoginPage() {
  // Redirect to auth choice page
  return <Navigate to="/auth/choice" replace />;
}
