import { Outlet } from "react-router";
import { AppProvider } from "../context/AppContext";
import { AuthModalProvider } from "../context/AuthModalContext";
import { Toaster } from "../components/ui/sonner";
import AuthModalsComponent from "../components/AuthModalsComponent";

export default function RootLayout() {
  return (
    <AppProvider>
      <AuthModalProvider>
        <Outlet />
        <AuthModalsComponent />
        <Toaster />
      </AuthModalProvider>
    </AppProvider>
  );
}
