import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { ShieldAlert, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      if (user?.role === 'admin') {
        toast.success("Welcome Admin!");
        navigate("/admin");
      } else {
        setError("This account is not an admin account. Please use user login.");
        toast.error("Admin access denied");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Admin login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-red-200">
      <CardHeader className="text-center bg-red-50">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-red-900">Admin Portal</CardTitle>
        <CardDescription>Administrative access only</CardDescription>
      </CardHeader>
      <CardContent className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
            <p className="font-semibold mb-1">Demo Admin Credentials:</p>
            <p>Email: <code className="bg-blue-100 px-1">admin@expensetracker.com</code></p>
            <p>Password: <code className="bg-blue-100 px-1">admin123</code></p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Admin Sign In"}
          </Button>

          <div className="border-t pt-4 space-y-2">
            <p className="text-center text-sm text-gray-600">
              Regular user?{" "}
              <Link to="/auth/login/user" className="text-blue-600 hover:underline">
                User Login
              </Link>
            </p>
            <p className="text-center text-sm text-gray-600">
              Or{" "}
              <Link to="/auth/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
              {" "}for a new account
            </p>
          </div>

          <Link to="/auth/choice" className="block text-center text-sm text-indigo-600 hover:underline">
            Back to login options
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
