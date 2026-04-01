import { useMemo, useRef } from "react";
import { Navigate } from "react-router";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { TrendingDown, TrendingUp, Calendar, Download } from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const { user, isLoading, expenses, income, categories } = useApp();
  const reportRef = useRef<HTMLDivElement>(null);

  // Category-wise expenses
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, { name: string; value: number; color: string; icon: string }>();
    
    expenses.forEach(expense => {
      const category = categories.find(c => c.id === expense.categoryId);
      if (category) {
        const existing = categoryMap.get(category.id);
        categoryMap.set(category.id, {
          name: category.name,
          value: (existing?.value || 0) + expense.amount,
          color: category.color || '#6366f1',
          icon: category.icon || '💰'
        });
      }
    });

    return Array.from(categoryMap.values());
  }, [expenses, categories]);

  // Monthly trends
  const monthlyData = useMemo(() => {
    const months: { [key: string]: { expenses: number; income: number } } = {};
    
    // Process expenses
    expenses.forEach(expense => {
      const monthKey = expense.date.substring(0, 7); // YYYY-MM
      if (!months[monthKey]) {
        months[monthKey] = { expenses: 0, income: 0 };
      }
      months[monthKey].expenses += expense.amount;
    });

    // Process income
    income.forEach(inc => {
      const monthKey = inc.date.substring(0, 7); // YYYY-MM
      if (!months[monthKey]) {
        months[monthKey] = { expenses: 0, income: 0 };
      }
      months[monthKey].income += inc.amount;
    });

    return Object.entries(months)
      .map(([month, data]) => ({
        month,
        ...data
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [expenses, income]);

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

  const downloadPDF = () => {
    const printWindow = window.open('', '', 'width=1200,height=600');
    if (!printWindow) {
      toast.error('Please allow pop-ups to download PDF');
      return;
    }

    // Get the report content
    const reportContent = reportRef.current?.innerHTML;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Financial Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; text-align: center; }
            .date { text-align: center; color: #666; margin-bottom: 30px; }
            .content { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #4f46e5; color: white; }
            .card { page-break-inside: avoid; margin-bottom: 30px; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; }
            @media print { body { margin: 0; padding: 20px; } .card { page-break-inside: avoid; } }
          </style>
        </head>
        <body>
          <h1>Financial Report</h1>
          <p class="date">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <div class="content">
            ${reportContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    toast.success('Use Print dialog to save as PDF');
  };

  // Income vs Expense comparison
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  
  const incomeExpenseData = [
    { name: 'Income', value: totalIncome, fill: '#10b981' },
    { name: 'Expenses', value: totalExpenses, fill: '#ef4444' }
  ];

  // Top spending categories
  const topCategories = categoryData.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Visualize your spending patterns</p>
          </div>
          <Button 
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <div ref={reportRef} className="space-y-6">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Total Income</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-600">₨{totalIncome.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Total Expenses</CardTitle>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-red-600">₨{totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Net Balance</CardTitle>
              <Calendar className="h-5 w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₨{(totalIncome - totalExpenses).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Category Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Distribution of expenses across categories</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No expense data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₨${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Income vs Expense */}
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>Overall financial comparison</CardDescription>
            </CardHeader>
            <CardContent>
              {totalIncome === 0 && totalExpenses === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={incomeExpenseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `₨${value.toFixed(2)}`} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Income and expenses over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyData.every(m => m.income === 0 && m.expenses === 0) ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No monthly data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `₨${value.toFixed(2)}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Income"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
            <CardDescription>Your highest expense categories</CardDescription>
          </CardHeader>
          <CardContent>
            {topCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No category data available</p>
            ) : (
              <div className="space-y-4">
                {topCategories.map((category, index) => {
                  const percentage = (category.value / totalExpenses) * 100;
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center text-xl" 
                        style={{ backgroundColor: category.color + '20' }}>
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-gray-600">
                            ₨{category.value.toFixed(2)} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: category.color
                            }}
                          />
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
    </div>
  );
}
