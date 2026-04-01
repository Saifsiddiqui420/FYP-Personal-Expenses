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
import { Plus, Pencil, Trash2, Plane, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { Trip } from "../../context/AppContext";

export default function TripsPage() {
  const { user, isLoading, trips, expenses, categories, addTrip, updateTrip, deleteTrip } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  // Form state
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    setTripName("");
    setDestination("");
    setBudget("");
    setStartDate("");
    setEndDate("");
    setEditingTrip(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tripName || !destination || !budget || !startDate || !endDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const tripData = {
      tripName,
      destination,
      budget: parseFloat(budget),
      startDate,
      endDate,
    };

    if (editingTrip) {
      updateTrip(editingTrip.id, tripData);
      toast.success("Trip updated successfully");
    } else {
      addTrip(tripData);
      toast.success("Trip added successfully");
    }

    resetForm();
    setIsAddOpen(false);
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setTripName(trip.tripName);
    setDestination(trip.destination);
    setBudget(trip.budget.toString());
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setIsAddOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      deleteTrip(id);
      toast.success("Trip deleted");
      if (selectedTrip === id) {
        setSelectedTrip(null);
      }
    }
  };

  const tripProgress = useMemo(() => {
    return trips.map(trip => {
      const tripExpenses = expenses.filter(e => e.tripId === trip.id);
      const totalSpent = tripExpenses.reduce((sum, e) => sum + e.amount, 0);
      const percentage = (totalSpent / trip.budget) * 100;
      const remaining = trip.budget - totalSpent;
      
      return {
        ...trip,
        expenses: tripExpenses,
        totalSpent,
        percentage: Math.min(percentage, 100),
        remaining,
        status: percentage >= 100 ? 'exceeded' : percentage >= 90 ? 'warning' : 'good'
      };
    });
  }, [trips, expenses]);

  const selectedTripData = selectedTrip 
    ? tripProgress.find(t => t.id === selectedTrip)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl text-gray-900">Trip Planner</h1>
            <p className="text-gray-600 mt-1">Plan and track your trip expenses</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingTrip ? "Edit Trip" : "Add New Trip"}</DialogTitle>
                <DialogDescription>
                  {editingTrip ? "Update trip details" : "Plan a new trip"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tripName">Trip Name *</Label>
                  <Input
                    id="tripName"
                    type="text"
                    placeholder="e.g., Summer Vacation 2026"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    type="text"
                    placeholder="e.g., Paris, France"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget *</Label>
                  <Input
                    id="budget"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingTrip ? "Update" : "Add"} Trip
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

        {/* Trips Grid */}
        {tripProgress.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No trips planned yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Create your first trip to start planning your expenses
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Trips List */}
            <div className="space-y-4">
              {tripProgress.map((trip) => (
                <Card 
                  key={trip.id} 
                  className={`cursor-pointer transition-all ${
                    selectedTrip === trip.id ? 'border-indigo-500 shadow-md' : ''
                  } ${
                    trip.status === 'exceeded' ? 'border-red-300 bg-red-50' :
                    trip.status === 'warning' ? 'border-yellow-300 bg-yellow-50' :
                    ''
                  }`}
                  onClick={() => setSelectedTrip(trip.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Plane className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{trip.tripName}</CardTitle>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {trip.destination}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(trip);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(trip.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Spent</span>
                        <span className={`font-medium ${
                          trip.status === 'exceeded' ? 'text-red-600' :
                          trip.status === 'warning' ? 'text-yellow-600' :
                          'text-gray-900'
                        }`}>
                          ₨{trip.totalSpent.toFixed(2)} / ₨{trip.budget.toFixed(2)}
                        </span>
                      </div>
                      
                      <Progress 
                        value={trip.percentage} 
                        className={`h-2 ${
                          trip.status === 'exceeded' ? '[&>div]:bg-red-600' :
                          trip.status === 'warning' ? '[&>div]:bg-yellow-500' :
                          '[&>div]:bg-indigo-500'
                        }`}
                      />
                      
                      <div className="text-sm">
                        <span className="text-gray-600">Remaining: </span>
                        <span className={`font-medium ${
                          trip.remaining < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          ₨{Math.abs(trip.remaining).toFixed(2)}
                          {trip.remaining < 0 && ' over budget'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trip Details */}
            <div>
              {selectedTripData ? (
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Trip Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl mb-1">{selectedTripData.tripName}</h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedTripData.destination}
                        </p>
                      </div>

                      <div className="p-4 bg-indigo-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Budget</p>
                            <p className="text-xl text-indigo-600 font-medium">
                              ₨{selectedTripData.budget.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Spent</p>
                            <p className="text-xl text-indigo-600 font-medium">
                              ₨{selectedTripData.totalSpent.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Expenses ({selectedTripData.expenses.length})</h4>
                        {selectedTripData.expenses.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No expenses for this trip yet
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {selectedTripData.expenses.map((expense) => {
                              const category = categories.find(c => c.id === expense.categoryId);
                              return (
                                <div 
                                  key={expense.id} 
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">{category?.icon || '💰'}</span>
                                    <div>
                                      <p className="text-sm font-medium">
                                        {expense.description || category?.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(expense.date).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="font-medium text-red-600">
                                    ₨{expense.amount.toFixed(2)}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <p className="text-center text-gray-500">
                      Select a trip to view details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
