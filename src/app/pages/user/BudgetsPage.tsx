import { useState, useMemo } from "react";
import { Navigate } from "react-router";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Progress } from "../../components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Plus, Pencil, Trash2, PiggyBank, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Budget } from "../../context/AppContext";

export default function BudgetsPage() {
  const { user, isLoading, budgets, categories, expenses, addBudget, updateBudget, deleteBudget } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Form state
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [period, setPeriod] = useState<"monthly" | "yearly" | "custom">("monthly");

  // Call ALL hooks first, before any conditional returns
  const budgetProgress = useMemo(() => {
    return budgets.map(budget => {
      let spent = 0;
      
      if (budget.categoryId) {
        spent = expenses
          .filter(e => e.categoryId === budget.categoryId)
          .reduce((sum, e) => sum + e.amount, 0);
      } else {
        // Overall budget
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        spent = expenses
          .filter(e => {
            const expDate = new Date(e.date);
            if (budget.period === 'monthly') {
              return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
            }
            return true; // For yearly or custom, show all expenses
          })
          .reduce((sum, e) => sum + e.amount, 0);
      }
      
      const percentage = (spent / budget.amount) * 100;
      const remaining = budget.amount - spent;
      
      return {
        ...budget,
        spent,
        percentage: Math.min(percentage, 100),
        remaining,
        status: percentage >= 100 ? 'exceeded' : percentage >= 90 ? 'warning' : 'good'
      };
    });
  }, [budgets, expenses]);

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
    setAmount("");
    setCategoryId("");
    setPeriod("monthly");
    setEditingBudget(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }

    const budgetData: any = {
      amount: parseFloat(amount),
      period,
    };
    
    // Only include categoryId if it's not empty
    if (categoryId) {
      budgetData.categoryId = categoryId;
    }

    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData);
      toast.success("Budget updated successfully");
    } else {
      addBudget(budgetData);
      toast.success("Budget added successfully");
    }

    resetForm();
    setIsAddOpen(false);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setAmount(budget.amount.toString());
    setCategoryId(budget.categoryId || "");
    setPeriod(budget.period);
    setIsAddOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      deleteBudget(id);
      toast.success("Budget deleted");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl text-gray-900">Budgets</h1>
            <p className="text-gray-600 mt-1">Set and track your spending limits</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingBudget ? "Edit Budget" : "Add New Budget"}</DialogTitle>
                <DialogDescription>
                  {editingBudget ? "Update budget details" : "Set a new spending limit"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Budget Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category (Leave empty for overall budget)</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Overall budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Period *</Label>
                  <Select value={period} onValueChange={(val) => setPeriod(val as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingBudget ? "Update" : "Add"} Budget
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

        {/* Budgets List */}
        {budgetProgress.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <PiggyBank className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No budgets set yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Create your first budget to start tracking your spending limits
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {budgetProgress.map((budget) => {
              const category = categories.find(c => c.id === budget.categoryId);
              const categoryName = category?.name || "Overall Budget";
              const categoryIcon = category?.icon || "💰";

              return (
                <Card key={budget.id} className={`${
                  budget.status === 'exceeded' ? 'border-red-300 bg-red-50' :
                  budget.status === 'warning' ? 'border-yellow-300 bg-yellow-50' :
                  ''
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-12 w-12 rounded-full flex items-center justify-center text-xl"
                          style={{ backgroundColor: category?.color + '20' || '#e5e7eb' }}
                        >
                          {categoryIcon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{categoryName}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1 capitalize">
                            {budget.period} budget
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEdit(budget)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDelete(budget.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Spent</span>
                        <span className={`font-medium ${
                          budget.status === 'exceeded' ? 'text-red-600' :
                          budget.status === 'warning' ? 'text-yellow-600' :
                          'text-gray-900'
                        }`}>
                          ₨{budget.spent.toFixed(2)} / ₨{budget.amount.toFixed(2)}
                        </span>
                      </div>
                      
                      <Progress 
                        value={budget.percentage} 
                        className={`h-3 ${
                          budget.status === 'exceeded' ? '[&>div]:bg-red-600' :
                          budget.status === 'warning' ? '[&>div]:bg-yellow-500' :
                          '[&>div]:bg-green-500'
                        }`}
                      />
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Remaining</p>
                          <p className={`text-lg font-medium ${
                            budget.remaining < 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            ₨{Math.abs(budget.remaining).toFixed(2)}
                            {budget.remaining < 0 && ' over budget'}
                          </p>
                        </div>
                        
                        {budget.status !== 'good' && (
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                            budget.status === 'exceeded' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {budget.status === 'exceeded' ? 'Exceeded' : 'Warning'}
                            </span>
                          </div>
                        )}
                      </div>
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
