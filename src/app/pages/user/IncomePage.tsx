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
import { Textarea } from "../../components/ui/textarea";
import { Plus, Pencil, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { Income } from "../../context/AppContext";

export default function IncomePage() {
  const { user, isLoading, income, addIncome, updateIncome, deleteIncome } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // Form state
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");

  // Calculate derived values before conditional returns
  const sortedIncome = useMemo(() => {
    return [...income].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [income]);

  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);

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
    setSource("");
    setDate(new Date().toISOString().split('T')[0]);
    setDescription("");
    setEditingIncome(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !source || !date) {
      toast.error("Please fill in required fields");
      return;
    }

    const incomeData = {
      amount: parseFloat(amount),
      source,
      date,
      description,
    };

    if (editingIncome) {
      updateIncome(editingIncome.id, incomeData);
      toast.success("Income updated successfully");
    } else {
      addIncome(incomeData);
      toast.success("Income added successfully");
    }

    resetForm();
    setIsAddOpen(false);
  };

  const handleEdit = (inc: Income) => {
    setEditingIncome(inc);
    setAmount(inc.amount.toString());
    setSource(inc.source);
    setDate(inc.date);
    setDescription(inc.description);
    setIsAddOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this income?")) {
      deleteIncome(id);
      toast.success("Income deleted");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl text-gray-900">Income</h1>
            <p className="text-gray-600 mt-1">Track your income sources</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Income
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingIncome ? "Edit Income" : "Add New Income"}</DialogTitle>
                <DialogDescription>
                  {editingIncome ? "Update income details" : "Record a new income"}
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
                  <Label htmlFor="source">Source *</Label>
                  <Input
                    id="source"
                    type="text"
                    placeholder="e.g., Salary, Freelance, Gift"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                  />
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
                    placeholder="Add notes about this income..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingIncome ? "Update" : "Add"} Income
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

        {/* Total */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="text-2xl text-green-600">₨{totalIncome.toFixed(2)}</p>
        </div>

        {/* Income List */}
        <Card>
          <CardHeader>
            <CardTitle>All Income ({sortedIncome.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedIncome.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No income recorded yet</p>
            ) : (
              <div className="space-y-3">
                {sortedIncome.map((inc) => (
                  <div 
                    key={inc.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {inc.description || inc.source}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(inc.date).toLocaleDateString()} • {inc.source}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl text-green-600 font-medium">
                        +₨{inc.amount.toFixed(2)}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEdit(inc)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDelete(inc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
