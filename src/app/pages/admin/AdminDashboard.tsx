import { useState, useMemo } from "react";
import { Navigate } from "react-router";
import { useApp } from "../../context/AppContext";
import AdminNavbar from "../../components/AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Settings,
  Home,
  Trash2,
  Edit,
  Shield,
  Search,
  Lock,
  Unlock
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "../../context/AppContext";

export default function AdminDashboard() {
  const { user, isLoading, expenses, income, categories, budgets, trips } = useApp();
  const [adminTab, setAdminTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<(User & { password?: string }) | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');

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

  // Check if user is admin - redirect to admin login if not
  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth/login/admin" replace />;
  }

  // Get all users from localStorage
  const allUsers = useMemo(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users as (User & { password: string })[];
  }, []);

  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm]);

  // Calculate statistics
  const stats = {
    totalUsers: allUsers.length,
    adminUsers: allUsers.filter(u => u.role === 'admin').length,
    regularUsers: allUsers.filter(u => u.role === 'user').length,
    totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    totalIncome: income.reduce((sum, i) => sum + i.amount, 0),
    activeTrips: trips.length,
    activeBudgets: budgets.length,
    totalTransactions: expenses.length + income.length,
  };

  const handleChangeRole = (userId: string, newRole: 'admin' | 'user') => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].role = newRole;
      localStorage.setItem('users', JSON.stringify(users));
      toast.success(`User role changed to ${newRole}`);
      setIsEditOpen(false);
    }
  };

  const handleDeleteUser = (userId: string, userEmail: string) => {
    if (userId === user.id) {
      toast.error("Cannot delete your own account");
      return;
    }

    if (confirm(`Are you sure you want to delete ${userEmail}?`)) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const filteredUsers = users.filter((u: User) => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      toast.success("User deleted successfully");
    }
  };

  const handleResetPassword = (userEmail: string) => {
    const newPassword = prompt(`Enter new password for ${userEmail}:`);
    if (newPassword && newPassword.length >= 6) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.email === userEmail);
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        toast.success("Password reset successfully");
      }
    } else if (newPassword) {
      toast.error("Password must be at least 6 characters");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar currentTab={adminTab} onTabChange={setAdminTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Control Panel</h1>
          <p className="text-gray-600 mt-2">Manage users and system authentication</p>
        </div>

        {/* OVERVIEW TAB */}
        {adminTab === "overview" && (
          <div className="space-y-8">
            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-gray-700">Total Users</CardTitle>
                  <Users className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
                  <p className="text-xs text-gray-600 mt-1">Registered accounts</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-gray-700">Admin Users</CardTitle>
                  <Shield className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{stats.adminUsers}</div>
                  <p className="text-xs text-gray-600 mt-1">Administrative accounts</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-gray-700">Regular Users</CardTitle>
                  <Users className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.regularUsers}</div>
                  <p className="text-xs text-gray-600 mt-1">Standard accounts</p>
                </CardContent>
              </Card>
            </div>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Total Transactions</span>
                    <span className="text-2xl font-bold text-indigo-600">{stats.totalTransactions}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Total Income</span>
                    <span className="text-2xl font-bold text-green-600">₨{stats.totalIncome.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Total Expenses</span>
                    <span className="text-2xl font-bold text-red-600">₨{stats.totalExpenses.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Active Budgets</span>
                    <span className="text-2xl font-bold text-orange-600">{stats.activeBudgets}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Active Trips</span>
                    <span className="text-2xl font-bold text-cyan-600">{stats.activeTrips}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Categories</span>
                    <span className="text-2xl font-bold text-pink-600">{categories.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* USER MANAGEMENT TAB */}
        {adminTab === "users" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>User Management</span>
                  <span className="text-sm font-normal text-gray-600">{filteredUsers.length} users</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="text-left p-4">User ID</th>
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Email</th>
                        <th className="text-left p-4">Role</th>
                        <th className="text-left p-4">Member Since</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-mono text-xs text-gray-600">{u.id.substring(0, 8)}</td>
                          <td className="p-4 font-medium">{u.name}</td>
                          <td className="p-4">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {u.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </td>
                          <td className="p-4 space-y-2">
                            <Dialog open={isEditOpen && editingUser?.id === u.id} onOpenChange={setIsEditOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingUser(u);
                                    setNewRole(u.role);
                                  }}
                                  className="w-full"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit User</DialogTitle>
                                  <DialogDescription>
                                    Manage user role and permissions
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <label className="text-sm font-medium block mb-2">User Role</label>
                                    <Select value={newRole} onValueChange={(value: any) => setNewRole(value)}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="user">Regular User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button
                                    onClick={() => {
                                      if (editingUser) {
                                        handleChangeRole(editingUser.id, newRole);
                                      }
                                    }}
                                    className="w-full"
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResetPassword(u.email)}
                              className="w-full text-orange-600 hover:bg-orange-50"
                            >
                              <Unlock className="h-4 w-4 mr-1" />
                              Reset Pass
                            </Button>
                            {user.id !== u.id && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                className="w-full"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <p className="text-center py-8 text-gray-500">No users found</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* AUTHENTICATION TAB */}
        {adminTab === "auth" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Password Policy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">Minimum Password Length</span>
                      <span className="font-medium">6 characters</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">Session Timeout</span>
                      <span className="font-medium">30 days</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">Password Expiry</span>
                      <span className="font-medium">No expiry</span>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-2">
                    {allUsers.map((u) => (
                      <div key={u.id} className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-200">
                        <div>
                          <p className="font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-600">{u.email}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          Logged In
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      Force Password Reset for All Users
                    </Button>
                    <Button className="w-full" variant="outline">
                      Disable All Active Sessions
                    </Button>
                    <Button className="w-full" variant="destructive">
                      Reset All User Passwords
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* SETTINGS TAB */}
        {adminTab === "settings" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Application Settings</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">App Name</span>
                      <span className="font-medium">ExpenseTracker</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">Version</span>
                      <span className="font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">Last Updated</span>
                      <span className="font-medium">March 12, 2026</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Backup & Recovery</h3>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      Backup All Data
                    </Button>
                    <Button className="w-full" variant="outline">
                      Export User Data
                    </Button>
                    <Button className="w-full" variant="destructive">
                      Clear All Data (Irreversible)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
