import { Link, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { useAuthModal } from "../context/AuthModalContext";
import { Button } from "./ui/button";
import { 
  Wallet, 
  LayoutDashboard, 
  TrendingDown, 
  TrendingUp, 
  PiggyBank, 
  Plane, 
  BarChart3, 
  User, 
  LogOut,
  Menu,
  Tags
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function Navbar() {
  const { user, logout } = useApp();
  const { openLogin, openSignup } = useAuthModal();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/expenses", label: "Expenses", icon: TrendingDown },
    { to: "/income", label: "Income", icon: TrendingUp },
    { to: "/budgets", label: "Budgets", icon: PiggyBank },
    { to: "/trips", label: "Trips", icon: Plane },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/categories", label: "Categories", icon: Tags },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <Wallet className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">ExpenseTracker</span>
          </Link>

          {user ? (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Navigation */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-2 p-2"
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    ))}
                    <hr className="my-2" />
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-2 p-2"
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-red-600 transition-colors flex items-center gap-2 p-2 text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={openLogin}>Login</Button>
              <Button onClick={openSignup}>Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
