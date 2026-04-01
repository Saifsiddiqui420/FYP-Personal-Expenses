import { Navigate } from "react-router";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  PiggyBank,
  AlertCircle,
  DollarSign,
  TrendingUpIcon
} from "lucide-react";
import { useMemo } from "react";
import { Alert, AlertDescription } from "../../components/ui/alert";

export default function DashboardPage() {
  const { user, isLoading, expenses, income, budgets, categories } = useApp();

  // Call ALL hooks first, before any conditional returns
  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
    const balance = totalIncome - totalExpenses;
    
    // Calculate monthly budget
    const monthlyBudgets = budgets.filter(b => b.period === 'monthly');
    const totalMonthlyBudget = monthlyBudgets.reduce((sum, b) => sum + b.amount, 0);
    
    // Calculate current month expenses
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    }).reduce((sum, exp) => sum + exp.amount, 0);
    
    const budgetRemaining = totalMonthlyBudget - monthlyExpenses;

    return {
      totalExpenses,
      totalIncome,
      balance,
      monthlyBudget: totalMonthlyBudget,
      monthlyExpenses,
      budgetRemaining
    };
  }, [expenses, income, budgets]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    const allTransactions = [
      ...expenses.map(e => ({ 
        ...e, 
        type: 'expense' as const,
        categoryName: categories.find(c => c.id === e.categoryId)?.name || 'Uncategorized'
      })),
      ...income.map(i => ({ 
        ...i, 
        type: 'income' as const,
        categoryName: i.source,
        categoryId: '',
        paymentMethod: undefined,
        tripId: undefined
      }))
    ];
    
    return allTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses, income, categories]);

  // Budget alerts
  const budgetAlerts = useMemo(() => {
    const alerts: Array<{
      type: 'warning' | 'exceeded';
      category: string;
      spent: number;
      budget: number;
      percentage: number;
    }> = [];

    budgets.forEach(budget => {
      let spent = 0;
      if (budget.categoryId) {
        spent = expenses
          .filter(e => e.categoryId === budget.categoryId)
          .reduce((sum, e) => sum + e.amount, 0);
      } else {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        spent = expenses
          .filter(e => {
            const expDate = new Date(e.date);
            return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
          })
          .reduce((sum, e) => sum + e.amount, 0);
      }

      const percentage = (spent / budget.amount) * 100;
      if (percentage >= 90) {
        const category = budget.categoryId
          ? categories.find(c => c.id === budget.categoryId)?.name || 'Unknown'
          : 'Overall';

        alerts.push({
          type: percentage >= 100 ? 'exceeded' : 'warning',
          category,
          spent,
          budget: budget.amount,
          percentage
        });
      }
    });

    return alerts;
  }, [budgets, expenses, categories]);

  // Monthly income calculation
  const monthlyIncomeTotal = useMemo(() => {
    const now = new Date();
    return income.filter(i => {
      const iDate = new Date(i.date);
      return iDate.getMonth() === now.getMonth() && iDate.getFullYear() === now.getFullYear();
    }).reduce((sum, i) => sum + i.amount, 0);
  }, [income]);

  // Wait for auth state to load before redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect admins to admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Redirect unauthenticated users to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-1">Here's your financial overview</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Left Side - Analytics & Charts */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Analytics Card */}
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pie Chart Visualization */}
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Pie slices */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.3)" 
                        strokeWidth="2"
                      />
                      {stats.totalIncome > 0 && (
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="12"
                          strokeDasharray={Math.min((stats.totalIncome / (stats.totalIncome + stats.totalExpenses)) * 251.2, 251.2)}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      )}
                      {stats.totalExpenses > 0 && (
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="none" 
                          stroke="#ef4444" 
                          strokeWidth="12"
                          strokeDasharray={Math.min((stats.totalExpenses / (stats.totalIncome + stats.totalExpenses)) * 251.2, 251.2)}
                          strokeDashoffset={-Math.min((stats.totalIncome / (stats.totalIncome + stats.totalExpenses)) * 251.2, 251.2)}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      )}
                      {/* Center circle */}
                      <circle cx="50" cy="50" r="30" fill="#4c1d95" />
                      <text x="50" y="50" textAnchor="middle" dy="0.3em" className="fill-white text-sm font-semibold">
                        {stats.totalIncome + stats.totalExpenses > 0 
                          ? `₨${(stats.totalIncome + stats.totalExpenses).toFixed(0)}` 
                          : '$0'}
                      </text>
                    </svg>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="flex-1">
                      <p className="text-sm opacity-90">Income</p>
                      <p className="text-lg font-semibold">₨{stats.totalIncome.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="flex-1">
                      <p className="text-sm opacity-90">Expenses</p>
                      <p className="text-lg font-semibold">₨{stats.totalExpenses.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Stats Mini Cards */}
            <div className="space-y-3">
              <Card className="bg-white border border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">MONTHLY INCOME</p>
                      <p className="text-lg font-bold text-gray-900">${monthlyIncomeTotal.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-100">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">MONTHLY EXPENSES</p>
                      <p className="text-lg font-bold text-gray-900">₨{stats.monthlyExpenses.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Stats Cards */}
          <div className="lg:col-span-2 space-y-8">
            {/* Budget Alerts */}
            {budgetAlerts.length > 0 && (
              <div className="space-y-3">
                {budgetAlerts.map((alert, index) => (
                  <Alert 
                    key={index} 
                    variant={alert.type === 'exceeded' ? 'destructive' : 'default'}
                    className={alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' : ''}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {alert.type === 'exceeded' ? (
                        <span>
                          <strong>{alert.category}</strong> budget exceeded! 
                          Spent ₨{alert.spent.toFixed(2)} of ₨{alert.budget.toFixed(2)} 
                          ({alert.percentage.toFixed(0)}%)
                        </span>
                      ) : (
                        <span>
                          <strong>{alert.category}</strong> budget warning! 
                          Spent ₨{alert.spent.toFixed(2)} of ₨{alert.budget.toFixed(2)} 
                          ({alert.percentage.toFixed(0)}%)
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-gray-700">Total Balance</CardTitle>
                  <Wallet className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₨{stats.balance.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Income - Expenses</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-gray-700">Total Income</CardTitle>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ₨{stats.totalIncome.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {income.length} transaction{income.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-gray-700">Total Expenses</CardTitle>
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    ₨{stats.totalExpenses.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-gray-700">Budget Remaining</CardTitle>
                  <PiggyBank className="h-5 w-5 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stats.budgetRemaining >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                    ₨{stats.budgetRemaining.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    This month: ₨{stats.monthlyExpenses.toFixed(2)} / ₨{stats.monthlyBudget.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Recent Transactions - Full Width */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-lg">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center font-semibold ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '−'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {transaction.description || transaction.categoryName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()} • {transaction.categoryName}
                        </p>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₨{transaction.amount.toFixed(2)}
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
