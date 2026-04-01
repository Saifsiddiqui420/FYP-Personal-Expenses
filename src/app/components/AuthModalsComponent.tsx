import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { useAuthModal } from "../context/AuthModalContext";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Wallet, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AuthModalsComponent() {
  const { login, signup } = useApp();
  const navigate = useNavigate();
  const { isLoginOpen, isSignupOpen, closeLogin, closeSignup, openSignup, openLogin } = useAuthModal();

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Signup State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields");
      return;
    }

    try {
      await login(loginEmail, loginPassword);
      toast.success("Welcome back!");
      setLoginEmail("");
      setLoginPassword("");
      closeLogin();
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err.message || "Login failed";
      setLoginError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setSignupError("Please fill in all fields");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    try {
      await signup(signupName, signupEmail, signupPassword);
      // Wait a moment for the logout to be processed by onAuthStateChanged effect
      await new Promise(resolve => setTimeout(resolve, 300));
      toast.success("Account created successfully! Please sign in.");
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");
      closeSignup();
      navigate("/auth/login/user");
    } catch (err: any) {
      const errorMessage = err.message || "Signup failed";
      setSignupError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={closeLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">User Login</DialogTitle>
            <DialogDescription className="text-center">
              Sign in to your expense tracker account
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{loginError}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="john@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>

            <div className="border-t pt-4">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    closeLogin();
                    openSignup();
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={isSignupOpen} onOpenChange={closeSignup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Create Account</DialogTitle>
            <DialogDescription className="text-center">
              Start tracking your expenses today
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSignup} className="space-y-4">
            {signupError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{signupError}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="john@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <Input
                id="signup-confirm-password"
                type="password"
                placeholder="••••••••"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              Create Account
            </Button>

            <div className="border-t pt-4">
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    closeSignup();
                    openLogin();
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
