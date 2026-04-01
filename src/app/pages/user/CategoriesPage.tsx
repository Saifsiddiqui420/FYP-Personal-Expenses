import { useState } from "react";
import { Navigate } from "react-router";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "../../components/ui/dialog";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "../../context/AppContext";

const COMMON_ICONS = ['🍔', '🚗', '🛍️', '✈️', '📄', '🎬', '🏥', '📚', '💰', '🎮', '🏠', '⚡', '📱', '🎵', '🏋️', '🍕'];
const COMMON_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA15E', '#BC6C25', '#606C38', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

export default function CategoriesPage() {
  const { user, isLoading, categories, expenses, addCategory, updateCategory, deleteCategory } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("💰");
  const [color, setColor] = useState("#6366f1");

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

  const resetForm = () => {
    setName("");
    setIcon("💰");
    setColor("#6366f1");
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Please enter a category name");
      return;
    }

    const categoryData = {
      name,
      icon,
      color,
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
      toast.success("Category updated successfully");
    } else {
      addCategory(categoryData);
      toast.success("Category added successfully");
    }

    resetForm();
    setIsAddOpen(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setIcon(category.icon || "💰");
    setColor(category.color || "#6366f1");
    setIsAddOpen(true);
  };

  const handleDelete = (id: string) => {
    // Check if category is being used
    const isUsed = expenses.some(e => e.categoryId === id);
    if (isUsed) {
      toast.error("Cannot delete category that has expenses");
      return;
    }

    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory(id);
      toast.success("Category deleted");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Manage your expense categories</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                <DialogDescription>
                  {editingCategory ? "Update category details" : "Create a new expense category"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Groceries"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Icon</Label>
                  <div className="grid grid-cols-8 gap-2">
                    {COMMON_ICONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setIcon(emoji)}
                        className={`h-10 w-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                          icon === emoji 
                            ? 'bg-indigo-100 ring-2 ring-indigo-500' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <Input
                    type="text"
                    placeholder="Or enter custom emoji"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="grid grid-cols-6 gap-2 mb-2">
                    {COMMON_COLORS.map((clr) => (
                      <button
                        key={clr}
                        type="button"
                        onClick={() => setColor(clr)}
                        className={`h-10 w-10 rounded-lg transition-all ${
                          color === clr ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                        style={{ backgroundColor: clr }}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                  <div 
                    className="h-12 w-12 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: color + '20' }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="font-medium">{name || 'Category Name'}</p>
                    <p className="text-sm text-gray-500">Preview</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCategory ? "Update" : "Add"} Category
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setIsAddOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Tags className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No categories yet</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => {
              const categoryExpenses = expenses.filter(e => e.categoryId === category.id);
              const totalSpent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);

              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-12 w-12 rounded-full flex items-center justify-center text-2xl"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {categoryExpenses.length} transaction{categoryExpenses.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Spent</span>
                      <span className="text-lg font-medium" style={{ color: category.color }}>
                        ₨{totalSpent.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
