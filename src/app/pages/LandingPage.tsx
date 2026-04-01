import { Link, Navigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { 
  Wallet, 
  TrendingDown, 
  PiggyBank, 
  BarChart3, 
  Plane, 
  Shield,
  Zap,
  Users
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const { user } = useApp();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: TrendingDown,
      title: "Track Expenses",
      description: "Easily record and categorize all your daily expenses in one place"
    },
    {
      icon: PiggyBank,
      title: "Budget Management",
      description: "Set budgets and get alerts when you're close to exceeding them"
    },
    {
      icon: Plane,
      title: "Trip Planning",
      description: "Plan and track expenses for your trips with dedicated trip budgets"
    },
    {
      icon: BarChart3,
      title: "Visual Reports",
      description: "Get insights with beautiful charts and detailed analytics"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is stored securely and privately"
    },
    {
      icon: Zap,
      title: "Fast & Easy",
      description: "Simple interface that makes expense tracking effortless"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div>
            <div className="flex justify-start mb-6 md:mb-8">
              <Wallet className="h-16 w-16 md:h-20 md:w-20" />
            </div>
            <h1 className="text-4xl md:text-5xl mb-6 font-bold">
              Take Control of Your Finances
            </h1>
            <p className="text-lg md:text-xl mb-8 text-indigo-100">
              Track expenses, manage budgets, and plan your financial future with ExpenseTracker - 
              your personal finance management solution
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/auth/choice">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-indigo-600">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="hidden md:flex justify-center">
            <img 
              src="/images/bg.png" 
              alt="Financial Management" 
              className="w-full max-w-md h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">
              Everything You Need to Manage Money
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for students, travelers, and anyone managing expenses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-indigo-300 transition-all">
                <CardHeader>
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Solution Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl mb-6 text-gray-900">
                Stop Wondering Where Your Money Goes
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 w-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600">✗</span>
                  </div>
                  <p className="text-gray-700">Hard to track daily expenses across multiple categories</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600">✗</span>
                  </div>
                  <p className="text-gray-700">Difficult to plan budgets for trips or monthly spending</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600">✗</span>
                  </div>
                  <p className="text-gray-700">No clear insights on spending patterns</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl mb-6 text-gray-900">
                Get Complete Financial Clarity
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-700">Easily categorize and track every expense</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-700">Set budgets and get alerts before overspending</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-700">Visual charts show exactly where your money goes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 px-4 text-white relative bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/bg-2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Users className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl mb-6 font-bold">
            Join Thousands Managing Their Finances Better
          </h2>
          <p className="text-xl mb-8 text-white">
            Start tracking your expenses today and take control of your financial future
          </p>
          <Link to="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wallet className="h-6 w-6 text-indigo-500" />
            <span className="text-white">ExpenseTracker</span>
          </div>
          <p className="text-sm">
            © 2026 ExpenseTracker. Your personal finance management solution.
          </p>
          <p className="text-xs mt-2">
            Final Year Project - Personal Expense Tracking System
          </p>
        </div>
      </footer>
    </div>
  );
}
