import { createBrowserRouter } from "react-router";
// Auth pages
import AuthModalPage from "./pages/auth/AuthModalPage";
import LoginPage from "./pages/auth/LoginPage";
import UserLoginPage from "./pages/auth/UserLoginPage";
import AuthChoicePage from "./pages/auth/AuthChoicePage";
import SignupPage from "./pages/auth/SignupPage";

// User pages
import DashboardPage from "./pages/user/DashboardPage";
import ExpensesPage from "./pages/user/ExpensesPage";
import IncomePage from "./pages/user/IncomePage";
import BudgetsPage from "./pages/user/BudgetsPage";
import TripsPage from "./pages/user/TripsPage";
import ReportsPage from "./pages/user/ReportsPage";
import ProfilePage from "./pages/user/ProfilePage";
import CategoriesPage from "./pages/user/CategoriesPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLoginPage from "./pages/admin/AdminLoginPage";

// Other pages
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <AuthModalPage /> },
      { path: "home", element: <HomePage /> },
      { path: "landing", element: <LandingPage /> },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          { path: "choice", element: <AuthChoicePage /> },
          { path: "login", element: <LoginPage /> },
          { path: "login/user", element: <UserLoginPage /> },
          { path: "login/admin", element: <AdminLoginPage /> },
          { path: "signup", element: <SignupPage /> },
        ],
      },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "expenses", element: <ExpensesPage /> },
      { path: "income", element: <IncomePage /> },
      { path: "budgets", element: <BudgetsPage /> },
      { path: "trips", element: <TripsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "admin", element: <AdminDashboard /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
