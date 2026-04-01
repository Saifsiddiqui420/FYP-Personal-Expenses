import { Navigate } from "react-router";
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { User, Mail, Calendar, Database, Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, isLoading, expenses, income, budgets, trips, categories } = useApp();
  const [showExportInfo, setShowExportInfo] = useState(false);

  // Wait for auth state to load before redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleExportData = () => {
    const data = {
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      expenses,
      income,
      budgets,
      trips,
      categories
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully");
  };

  const stats = {
    totalExpenses: expenses.length,
    totalIncome: income.length,
    totalBudgets: budgets.length,
    totalTrips: trips.length,
    totalCategories: categories.length,
    totalTransactions: expenses.length + income.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account and data</p>
        </div>

        {/* User Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Expenses</p>
                <p className="text-2xl text-red-600">{stats.totalExpenses}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Income</p>
                <p className="text-2xl text-green-600">{stats.totalIncome}</p>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Budgets</p>
                <p className="text-2xl text-indigo-600">{stats.totalBudgets}</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Trips</p>
                <p className="text-2xl text-purple-600">{stats.totalTrips}</p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Categories</p>
                <p className="text-2xl text-yellow-600">{stats.totalCategories}</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Transactions</p>
                <p className="text-2xl text-blue-600">{stats.totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-gray-500">Download all your data as JSON</p>
                  </div>
                </div>
                <Button onClick={handleExportData} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> All your data is stored locally in your browser. 
                  Make sure to export your data regularly to avoid losing it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
