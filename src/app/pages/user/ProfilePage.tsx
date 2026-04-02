import { Navigate } from "react-router";
import { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { User, Mail, Calendar, Database, Download, Camera, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, isLoading, expenses, income, budgets, trips, categories, updateProfilePicture } = useApp();
  const [showExportInfo, setShowExportInfo] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleProfilePictureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicturePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadProfilePicture = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploadingPicture(true);
    try {
      await updateProfilePicture(file);
      toast.success('Profile picture updated successfully');
      setProfilePicturePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const clearProfilePicturePreview = () => {
    setProfilePicturePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

        {/* Profile Picture */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Current or Preview Picture */}
              <div className="flex justify-center">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-gray-200">
                  {profilePicturePreview ? (
                    <img 
                      src={profilePicturePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : user?.profilePictureUrl ? (
                    <img 
                      src={user.profilePictureUrl} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                      <Camera className="h-16 w-16 text-indigo-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* File Input */}
              <div className="flex justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Choose Photo
                </Button>
              </div>

              {/* Upload Button */}
              {profilePicturePreview && (
                <div className="flex gap-2 justify-center sm:justify-start">
                  <Button
                    onClick={handleUploadProfilePicture}
                    disabled={isUploadingPicture}
                    className="flex-1 sm:flex-none"
                  >
                    {isUploadingPicture ? 'Uploading...' : 'Upload Picture'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearProfilePicturePreview}
                    disabled={isUploadingPicture}
                    size="icon"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {user?.profilePictureUrl && !profilePicturePreview && (
                <p className="text-center text-sm text-gray-500">
                  Click "Choose Photo" to update your profile picture
                </p>
              )}
            </div>
          </CardContent>
        </Card>

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
