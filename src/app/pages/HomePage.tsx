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
  Users,
  CheckCircle2,
  ArrowRight,
  Target,
  TrendingUp,
  Clock,
  Smartphone
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const { user } = useApp();

  // Redirect authenticated users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: TrendingDown,
      title: "Track Expenses",
      description: "Easily record and categorize all your daily expenses in one place. Never lose track of where your money goes."
    },
    {
      icon: PiggyBank,
      title: "Budget Management",
      description: "Set monthly or custom budgets and get alerts when you're close to exceeding them."
    },
    {
      icon: Plane,
      title: "Trip Planning",
      description: "Plan and track expenses for your trips with dedicated trip budgets and spending analysis."
    },
    {
      icon: BarChart3,
      title: "Visual Reports",
      description: "Get insights with beautiful charts and detailed analytics of your spending patterns."
    },
    {
      icon: TrendingUp,
      title: "Income Tracking",
      description: "Record income from various sources and track your net balance over time."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is stored securely and never shared with third parties."
    },
    {
      icon: Zap,
      title: "Fast & Easy",
      description: "Simple, intuitive interface that makes expense tracking effortless for everyone."
    },
    {
      icon: Target,
      title: "Category Management",
      description: "Create custom categories to organize expenses the way that makes sense for you."
    },
  ];

  const benefits = [
    "Save time by automating expense tracking",
    "Get clarity on your spending habits",
    "Plan better for your financial future",
    "Set and achieve your budgeting goals",
    "Make smarter financial decisions",
    "Reduce money-related stress"
  ];

  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description: "Create a free account in seconds with your email"
    },
    {
      number: "2",
      title: "Add Expenses",
      description: "Start recording your daily expenses and income"
    },
    {
      number: "3",
      title: "Set Budgets",
      description: "Define spending limits for different categories"
    },
    {
      number: "4",
      title: "Get Insights",
      description: "View detailed reports and analytics of your spending"
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 text-white py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div>
            <div className="inline-block bg-white/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm border border-white/30">
              <span className="text-sm font-semibold">✨ The Smart Way to Manage Money</span>
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 font-bold leading-tight">
              Take Control of Your <span className="text-yellow-300">Finances</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-indigo-100">
              Track expenses, manage budgets, plan trips, and gain financial clarity with ExpenseTracker - 
              the all-in-one personal finance management solution for students, freelancers, and professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8 font-semibold">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/auth/choice">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-purple-600 font-semibold">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-indigo-100 text-sm mt-6">✓ No credit card required • 100% Free forever</p>
          </div>

          {/* Right Side - Stats */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold mb-2">5000+</div>
              <p className="text-indigo-100">Active Users</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold mb-2">$10M+</div>
              <p className="text-indigo-100">Expenses Tracked</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <p className="text-indigo-100">Budgets Created</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems & Solutions */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Stop Losing Track of Your Money
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're managing personal finances, saving for a trip, or planning a budget, we have you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Problems */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Common Challenges</h3>
              {[
                "Expenses scattered across multiple apps and receipts",
                "Hard to identify spending patterns and trends",
                "Difficult to stick to monthly budgets",
                "No visibility into where your money really goes",
                "Complex trip/project budget planning",
                "No clarity on income vs. expenses"
              ].map((problem, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="h-6 w-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 font-bold">✕</span>
                  </div>
                  <p className="text-gray-700">{problem}</p>
                </div>
              ))}
            </div>

            {/* Solutions */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Solutions</h3>
              {[
                "Centralize all expenses in one secure platform",
                "Beautiful charts reveal your spending habits",
                "Smart budget alerts keep you on track",
                "Complete visibility with advanced analytics",
                "Dedicated tools for trip and project budgeting",
                "Real-time balance tracking and insights"
              ].map((solution, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-gray-700">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Powerful Features for Complete Control
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your finances effectively
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <CardHeader>
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">Start managing your finances today</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg h-full">
                  <div className="h-12 w-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-6 text-lg font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-8 w-8 h-0.5 bg-indigo-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-indigo-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Why Choose ExpenseTracker?
            </h2>
            <p className="text-xl text-gray-600">Join thousands of users who have transformed their finances</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 bg-white p-6 rounded-xl shadow-md">
                <Smartphone className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                <p className="text-gray-800 font-semibold">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Take Control?
          </h2>
          <p className="text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
            Start tracking your expenses today. It only takes 30 seconds to create your free account.
          </p>
          <Link to="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-12 font-semibold inline-flex items-center gap-2">
              Explore More
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <p className="text-indigo-100 text-sm mt-6">No credit card required • Start free today</p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 mb-8">Trusted by users worldwide</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-gray-700 font-semibold">100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-gray-700 font-semibold">Always Free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-gray-700 font-semibold">No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-gray-700 font-semibold">Your Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Wallet className="h-6 w-6 text-indigo-500" />
            <span className="text-white font-bold text-lg">ExpenseTracker</span>
          </div>
          <p className="text-sm mb-2">
            © 2026 ExpenseTracker. Your personal finance management solution.
          </p>
          <p className="text-xs text-gray-500">
            Final Year Project - Personal Expense Tracking System
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Made with ❤️ for better financial management
          </p>
        </div>
      </footer>
    </div>
  );
}
