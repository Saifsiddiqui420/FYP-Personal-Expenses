import { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import type { Expense } from "../../context/AppContext";

export default function ExpensesPage() {
  const { user, isLoading, expenses, categories, trips, addExpense, updateExpense, deleteExpense } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterTrip, setFilterTrip] = useState("all");

  // Form state
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [tripId, setTripId] = useState("");

  // Call ALL hooks first, before any conditional returns
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.amount.toString().includes(searchTerm);
      const matchesCategory = filterCategory === "all" || expense.categoryId === filterCategory;
      const matchesTrip = filterTrip === "all" || expense.tripId === filterTrip;
      
      return matchesSearch && matchesCategory && matchesTrip;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, searchTerm, filterCategory, filterTrip]);

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

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
    setDate(new Date().toISOString().split('T')[0]);
    setDescription("");
    setPaymentMethod("");
    setTripId("");
    setEditingExpense(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !categoryId || !date) {
      toast.error("Please fill in required fields");
      return;
    }

    const expenseData: any = {
      amount: parseFloat(amount),
      categoryId,
      date,
      description,
    };
    
    // Only include optional fields if they have values
    if (paymentMethod) {
      expenseData.paymentMethod = paymentMethod;
    }
    if (tripId) {
      expenseData.tripId = tripId;
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
      toast.success("Expense updated successfully");
    } else {
      addExpense(expenseData);
      toast.success("Expense added successfully");
    }

    resetForm();
    setIsAddOpen(false);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount.toString());
    setCategoryId(expense.categoryId);
    setDate(expense.date);
    setDescription(expense.description);
    setPaymentMethod(expense.paymentMethod || "");
    setTripId(expense.tripId || "");
    setIsAddOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id);
      toast.success("Expense deleted");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl text-gray-900">Expenses</h1>
            <p className="text-gray-600 mt-1">Track and manage your expenses</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
                <DialogDescription>
                  {editingExpense ? "Update expense details" : "Record a new expense"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
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
                  <Label htmlFor="category">Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Add notes about this expense..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="digital">Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {trips.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="trip">Trip (Optional)</Label>
                    <Select value={tripId} onValueChange={setTripId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trip" />
                      </SelectTrigger>
                      <SelectContent>
                        {trips.map((trip) => (
                          <SelectItem key={trip.id} value={trip.id}>
                            {trip.tripName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingExpense ? "Update" : "Add"} Expense
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

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Filter by Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {trips.length > 0 && (
                <div className="space-y-2">
                  <Label>Filter by Trip</Label>
                  <Select value={filterTrip} onValueChange={setFilterTrip}>
                    <SelectTrigger>
                      <SelectValue placeholder="All trips" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trips</SelectItem>
                      {trips.map((trip) => (
                        <SelectItem key={trip.id} value={trip.id}>
                          {trip.tripName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-gray-600">Total Expenses (Filtered)</p>
          <p className="text-2xl text-red-600">₨{totalExpenses.toFixed(2)}</p>
        </div>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>All Expenses ({filteredExpenses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No expenses found</p>
            ) : (
              <div className="space-y-3">
                {filteredExpenses.map((expense) => {
                  const category = categories.find(c => c.id === expense.categoryId);
                  const trip = trips.find(t => t.id === expense.tripId);
                  
                  return (
                    <div 
                      key={expense.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div 
                          className="h-12 w-12 rounded-full flex items-center justify-center text-xl"
                          style={{ backgroundColor: category?.color + '20' }}
                        >
                          {category?.icon || '💰'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {expense.description || category?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString()} • {category?.name}
                            {trip && ` • ${trip.tripName}`}
                            {expense.paymentMethod && ` • ${expense.paymentMethod}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl text-red-600 font-medium">
                          ₨{expense.amount.toFixed(2)}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleEdit(expense)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
