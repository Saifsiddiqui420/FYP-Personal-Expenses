import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: 'admin' | 'user';
}

export interface Expense {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod?: string;
  tripId?: string;
}

export interface Income {
  id: string;
  userId: string;
  amount: number;
  source: string;
  date: string;
  description: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId?: string;
  amount: number;
  period: 'monthly' | 'yearly' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface Trip {
  id: string;
  userId: string;
  tripName: string;
  destination: string;
  budget: number;
  startDate: string;
  endDate: string;
}

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'userId'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  income: Income[];
  addIncome: (income: Omit<Income, 'id' | 'userId'>) => Promise<void>;
  updateIncome: (id: string, income: Partial<Income>) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'userId'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'userId'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'userId'>) => Promise<void>;
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_CATEGORIES = [
  { name: 'Food', icon: '🍔', color: '#FF6B6B' },
  { name: 'Transport', icon: '🚗', color: '#4ECDC4' },
  { name: 'Shopping', icon: '🛍️', color: '#45B7D1' },
  { name: 'Travel', icon: '✈️', color: '#96CEB4' },
  { name: 'Bills', icon: '📄', color: '#FFEAA7' },
  { name: 'Entertainment', icon: '🎬', color: '#DDA15E' },
  { name: 'Health', icon: '🏥', color: '#BC6C25' },
  { name: 'Education', icon: '📚', color: '#606C38' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);

  // Initialize auth state and set up real-time listeners
  useEffect(() => {
    setIsLoading(true); // Start loading when effect runs
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Create user object from Firebase auth
          const userData: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            createdAt: new Date().toISOString(),
            role: 'user'
          };
          
          setUser(userData);
          
          // Set up real-time listeners and wait for them to complete
          await setupRealTimeListeners(firebaseUser.uid);
        } else {
          setUser(null);
          setExpenses([]);
          setIncome([]);
          setCategories([]);
          setBudgets([]);
          setTrips([]);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const setupRealTimeListeners = async (userId: string): Promise<void> => {
    return new Promise((resolve) => {
      let listenersReady = 0;
      const totalListeners = 5; // categories, expenses, income, budgets, trips

      // Set up real-time listener for categories
      const categoriesQuery = query(collection(db, 'categories'), where('userId', '==', userId));
      const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        
        if (categoriesData.length === 0) {
          // Initialize default categories for new user
          initializeDefaultCategories(userId).catch(err => console.error('Failed to initialize default categories:', err));
        } else {
          setCategories(categoriesData);
        }
        
        listenersReady++;
        if (listenersReady === totalListeners) resolve();
      });

      // Set up real-time listener for expenses
      const expensesQuery = query(collection(db, 'expenses'), where('userId', '==', userId));
      const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
        const expensesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: typeof doc.data().date === 'string' ? doc.data().date : doc.data().date?.toDate?.()?.toISOString().split('T')[0]
        })) as Expense[];
        setExpenses(expensesData);
        
        listenersReady++;
        if (listenersReady === totalListeners) resolve();
      });

      // Set up real-time listener for income
      const incomeQuery = query(collection(db, 'income'), where('userId', '==', userId));
      const unsubscribeIncome = onSnapshot(incomeQuery, (snapshot) => {
        const incomeData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: typeof doc.data().date === 'string' ? doc.data().date : doc.data().date?.toDate?.()?.toISOString().split('T')[0]
        })) as Income[];
        setIncome(incomeData);
        
        listenersReady++;
        if (listenersReady === totalListeners) resolve();
      });

      // Set up real-time listener for budgets
      const budgetsQuery = query(collection(db, 'budgets'), where('userId', '==', userId));
      const unsubscribeBudgets = onSnapshot(budgetsQuery, (snapshot) => {
        const budgetsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Budget[];
        setBudgets(budgetsData);
        
        listenersReady++;
        if (listenersReady === totalListeners) resolve();
      });

      // Set up real-time listener for trips
      const tripsQuery = query(collection(db, 'trips'), where('userId', '==', userId));
      const unsubscribeTrips = onSnapshot(tripsQuery, (snapshot) => {
        const tripsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          startDate: typeof doc.data().startDate === 'string' ? doc.data().startDate : doc.data().startDate?.toDate?.()?.toISOString().split('T')[0],
          endDate: typeof doc.data().endDate === 'string' ? doc.data().endDate : doc.data().endDate?.toDate?.()?.toISOString().split('T')[0]
        })) as Trip[];
        setTrips(tripsData);
        
        listenersReady++;
        if (listenersReady === totalListeners) resolve();
      });

      return () => {
        unsubscribeCategories();
        unsubscribeExpenses();
        unsubscribeIncome();
        unsubscribeBudgets();
        unsubscribeTrips();
      };
    });
  };

  const initializeDefaultCategories = async (userId: string) => {
    const defaultCategories = [
      { name: 'Food', icon: '🍔', color: '#FF6B6B' },
      { name: 'Transport', icon: '🚗', color: '#4ECDC4' },
      { name: 'Shopping', icon: '🛍️', color: '#45B7D1' },
      { name: 'Travel', icon: '✈️', color: '#96CEB4' },
      { name: 'Bills', icon: '📄', color: '#FFEAA7' },
      { name: 'Entertainment', icon: '🎬', color: '#DDA15E' },
      { name: 'Health', icon: '🏥', color: '#BC6C25' },
      { name: 'Education', icon: '📚', color: '#606C38' },
    ];

    const categoryRefs: string[] = [];
    
    for (const cat of defaultCategories) {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...cat,
        userId
      });
      categoryRefs.push(docRef.id);
    }

    // Add dummy data for new users
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Dummy Expenses
    const dummyExpenses = [
      { categoryId: categoryRefs[0], amount: 45.50, date: new Date(currentYear, currentMonth, -25).toISOString().split('T')[0], description: 'Lunch at restaurant', paymentMethod: 'Credit Card', userId },
      { categoryId: categoryRefs[1], amount: 30.00, date: new Date(currentYear, currentMonth, -20).toISOString().split('T')[0], description: 'Uber ride', paymentMethod: 'Debit Card', userId },
      { categoryId: categoryRefs[2], amount: 120.00, date: new Date(currentYear, currentMonth, -18).toISOString().split('T')[0], description: 'New shoes', paymentMethod: 'Credit Card', userId },
      { categoryId: categoryRefs[0], amount: 75.25, date: new Date(currentYear, currentMonth, -15).toISOString().split('T')[0], description: 'Grocery shopping', paymentMethod: 'Cash', userId },
      { categoryId: categoryRefs[4], amount: 150.00, date: new Date(currentYear, currentMonth, -10).toISOString().split('T')[0], description: 'Electricity bill', paymentMethod: 'Bank Transfer', userId },
      { categoryId: categoryRefs[5], amount: 35.00, date: new Date(currentYear, currentMonth, -8).toISOString().split('T')[0], description: 'Movie tickets', paymentMethod: 'Credit Card', userId },
    ];

    for (const exp of dummyExpenses) {
      await addDoc(collection(db, 'expenses'), exp);
    }

    // Dummy Income
    const dummyIncome = [
      { amount: 3500.00, source: 'Salary', date: new Date(currentYear, currentMonth, -28).toISOString().split('T')[0], description: 'Monthly salary', userId },
      { amount: 500.00, source: 'Freelance', date: new Date(currentYear, currentMonth, -15).toISOString().split('T')[0], description: 'Web design project', userId },
    ];

    for (const inc of dummyIncome) {
      await addDoc(collection(db, 'income'), inc);
    }

    // Dummy Budgets
    const dummyBudgets = [
      { categoryId: categoryRefs[0], amount: 400.00, period: 'monthly', userId },
      { categoryId: categoryRefs[1], amount: 200.00, period: 'monthly', userId },
      { amount: 2000.00, period: 'monthly', userId },
    ];

    for (const bud of dummyBudgets) {
      await addDoc(collection(db, 'budgets'), bud);
    }

    // Dummy Trips
    const dummyTrips = [
      { tripName: 'Paris Vacation', destination: 'Paris, France', budget: 2500.00, startDate: new Date(currentYear, currentMonth + 2, 15).toISOString().split('T')[0], endDate: new Date(currentYear, currentMonth + 2, 25).toISOString().split('T')[0], userId },
      { tripName: 'Beach Weekend', destination: 'Miami, FL', budget: 800.00, startDate: new Date(currentYear, currentMonth + 1, 5).toISOString().split('T')[0], endDate: new Date(currentYear, currentMonth + 1, 8).toISOString().split('T')[0], userId },
    ];

    for (const trip of dummyTrips) {
      await addDoc(collection(db, 'trips'), trip);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Create user profile in Firestore
      await addDoc(collection(db, 'users'), {
        uid: userId,
        name,
        email,
        createdAt: Timestamp.now(),
        role: 'user'
      });

      // Log out the user immediately after signup
      // This forces them to manually sign in to access the dashboard
      await signOut(auth);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Don't set user or initialize listeners here - let onAuthStateChanged effect handle it
      // This prevents race conditions and duplicate listener setup
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setExpenses([]);
      setIncome([]);
      setCategories([]);
      setBudgets([]);
      setTrips([]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Expense operations
  const addExpense = async (expense: Omit<Expense, 'id' | 'userId'>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    try {
      // Filter out undefined fields - Firestore doesn't accept undefined values
      const expenseData: any = {
        ...expense,
        userId: user.id
      };
      
      // Remove undefined optional fields
      if (expenseData.tripId === undefined) delete expenseData.tripId;
      if (expenseData.paymentMethod === undefined) delete expenseData.paymentMethod;
      
      await addDoc(collection(db, 'expenses'), expenseData);
    } catch (error) {
      console.error('Add expense error:', error);
      throw error;
    }
  };

  const updateExpense = async (id: string, expense: Partial<Expense>): Promise<void> => {
    try {
      const expenseRef = doc(db, 'expenses', id);
      await updateDoc(expenseRef, expense);
    } catch (error) {
      console.error('Update expense error:', error);
      throw error;
    }
  };

  const deleteExpense = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (error) {
      console.error('Delete expense error:', error);
      throw error;
    }
  };

  // Income operations
  const addIncome = async (incomeData: Omit<Income, 'id' | 'userId'>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    try {
      await addDoc(collection(db, 'income'), {
        ...incomeData,
        userId: user.id
      });
    } catch (error) {
      console.error('Add income error:', error);
      throw error;
    }
  };

  const updateIncome = async (id: string, incomeData: Partial<Income>): Promise<void> => {
    try {
      const incomeRef = doc(db, 'income', id);
      await updateDoc(incomeRef, incomeData);
    } catch (error) {
      console.error('Update income error:', error);
      throw error;
    }
  };

  const deleteIncome = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'income', id));
    } catch (error) {
      console.error('Delete income error:', error);
      throw error;
    }
  };

  // Category operations
  const addCategory = async (category: Omit<Category, 'id' | 'userId'>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    try {
      await addDoc(collection(db, 'categories'), {
        ...category,
        userId: user.id
      });
    } catch (error) {
      console.error('Add category error:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>): Promise<void> => {
    try {
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, category);
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  };

  // Budget operations
  const addBudget = async (budget: Omit<Budget, 'id' | 'userId'>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    try {
      // Filter out undefined fields - Firestore doesn't accept undefined values
      const budgetData: any = {
        ...budget,
        userId: user.id
      };
      
      // Remove undefined optional fields
      if (budgetData.categoryId === undefined) delete budgetData.categoryId;
      
      await addDoc(collection(db, 'budgets'), budgetData);
    } catch (error) {
      console.error('Add budget error:', error);
      throw error;
    }
  };

  const updateBudget = async (id: string, budget: Partial<Budget>): Promise<void> => {
    try {
      const budgetRef = doc(db, 'budgets', id);
      await updateDoc(budgetRef, budget);
    } catch (error) {
      console.error('Update budget error:', error);
      throw error;
    }
  };

  const deleteBudget = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'budgets', id));
    } catch (error) {
      console.error('Delete budget error:', error);
      throw error;
    }
  };

  // Trip operations
  const addTrip = async (trip: Omit<Trip, 'id' | 'userId'>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    try {
      await addDoc(collection(db, 'trips'), {
        ...trip,
        userId: user.id
      });
    } catch (error) {
      console.error('Add trip error:', error);
      throw error;
    }
  };

  const updateTrip = async (id: string, trip: Partial<Trip>): Promise<void> => {
    try {
      const tripRef = doc(db, 'trips', id);
      await updateDoc(tripRef, trip);
    } catch (error) {
      console.error('Update trip error:', error);
      throw error;
    }
  };

  const deleteTrip = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'trips', id));
    } catch (error) {
      console.error('Delete trip error:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        income,
        addIncome,
        updateIncome,
        deleteIncome,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        trips,
        addTrip,
        updateTrip,
        deleteTrip,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};