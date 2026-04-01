import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Wallet, Shield, Users } from "lucide-react";

export default function AuthChoicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Wallet className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personal Expense Tracker</h1>
          <p className="text-gray-600">Choose your login type to continue</p>
        </div>

        <div className="max-w-md mx-auto">
          {/* User Login Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-xl">User Login</CardTitle>
              <CardDescription>Access your expense tracking dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Sign in to manage your expenses, income, budgets, and trips.
              </p>
              <div className="space-y-2">
                <Link to="/auth/login/user" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    User Login
                  </Button>
                </Link>
                <p className="text-center text-sm text-gray-600">
                  New user?{" "}
                  <Link to="/auth/signup" className="text-blue-600 hover:underline">
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-indigo-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
