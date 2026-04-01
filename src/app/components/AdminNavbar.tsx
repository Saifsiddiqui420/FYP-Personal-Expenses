import { Link, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";
import { 
  Wallet, 
  Settings, 
  BarChart3,
  Users,
  LogOut,
  Menu,
  Home
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface AdminLink {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function AdminNavbar({ currentTab, onTabChange }: { currentTab: string; onTabChange: (tab: string) => void }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const adminLinks: AdminLink[] = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "users", label: "User Management", icon: Users },
    { id: "auth", label: "Authentication", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold">Admin Panel</span>
              <p className="text-xs text-gray-400">ExpenseTracker</p>
            </div>
          </Link>

          {user ? (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {adminLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => onTabChange(link.id)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      currentTab === link.id
                        ? 'text-white border-b-2 border-red-600 pb-2'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Desktop User Menu */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white gap-2 hover:bg-gray-700">
                      <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold">
                        A
                      </div>
                      Admin
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-700">
                      {user?.name}
                    </div>
                    <div className="px-2 py-1.5 text-xs text-gray-500 border-b border-gray-200">
                      {user?.email}
                    </div>
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                      <Wallet className="h-4 w-4 mr-2" />
                      User Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                      <Home className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Navigation */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-gray-900 border-gray-700">
                  <div className="space-y-4 mt-8">
                    {adminLinks.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => onTabChange(link.id)}
                        className={`flex items-center gap-2 font-medium w-full transition-colors ${
                          currentTab === link.id
                            ? 'text-red-600'
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </button>
                    ))}
                    <hr className="border-gray-700" />
                    <button
                      onClick={() => navigate("/profile")}
                      className="text-gray-300 hover:text-white w-full text-left flex items-center gap-2 font-medium"
                    >
                      <Wallet className="h-5 w-5" />
                      User Profile
                    </button>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="text-gray-300 hover:text-white w-full text-left flex items-center gap-2 font-medium"
                    >
                      <Home className="h-5 w-5" />
                      Dashboard
                    </button>
                    <hr className="border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 w-full text-left flex items-center gap-2 font-medium"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
