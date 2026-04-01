# 💰 ExpenseTracker - Personal Finance Management System

> A comprehensive web-based expense tracking application built for Final Year Project (FYP)

![Status](https://img.shields.io/badge/Status-Complete-success)
![FYP](https://img.shields.io/badge/FYP-2026-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178c6)

---

## 📖 About The Project

ExpenseTracker is a modern, feature-rich personal finance management system designed to help users track their daily expenses, manage budgets, and plan trip expenses. Built with React, TypeScript, and Tailwind CSS, it provides an intuitive interface with powerful analytics and reporting capabilities.

### 🎯 Key Features

- ✅ **User Authentication** - Secure signup/login system
- 💸 **Expense Tracking** - Categorized expense management
- 💰 **Income Tracking** - Record all income sources
- 🎯 **Budget Management** - Set limits and get alerts
- ✈️ **Trip Planner** - Plan and track trip budgets
- 📊 **Visual Reports** - Charts and analytics
- 🏷️ **Custom Categories** - Personalized expense categories
- 📱 **Responsive Design** - Works on all devices
- 💾 **Data Export** - Backup your financial data

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd expense-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

### First Time Setup

1. Click **"Sign Up"** to create an account
2. Explore the **Dashboard** to see your financial overview
3. Add your first **Expense** or **Income**
4. Set a **Budget** to track spending limits
5. View **Reports** for visual insights

---

## 📚 Documentation

### Complete Documentation Files

- 📘 **[Project Documentation](PROJECT_DOCUMENTATION.md)** - Full academic documentation
- 📗 **[Quick Start Guide](QUICK_START_GUIDE.md)** - User guide for beginners
- 📙 **[Features Checklist](FEATURES_CHECKLIST.md)** - Complete feature list

### Key Sections

- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [User Guide](#user-guide)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────┐
│         User Interface (React)               │
│  - Landing, Dashboard, Reports, etc.         │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│      State Management (Context API)          │
│  - Authentication, Data Operations           │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│     Data Storage (LocalStorage)              │
│  - Users, Expenses, Income, etc.             │
└──────────────────────────────────────────────┘
```

---

## 🗄️ Database Design

### Data Models

**Users** → Expenses, Income, Categories, Budgets, Trips

```typescript
User {
  id, name, email, password, createdAt
}

Expense {
  id, userId, categoryId, amount, date, description, paymentMethod, tripId
}

Income {
  id, userId, amount, source, date, description
}

Category {
  id, userId, name, icon, color
}

Budget {
  id, userId, categoryId, amount, period
}

Trip {
  id, userId, tripName, destination, budget, startDate, endDate
}
```

---

## ✨ Features

### 1. User Authentication
- Sign up with email and password
- Secure login system
- Session management
- Protected routes

### 2. Dashboard
- Total balance overview
- Income vs Expenses summary
- Budget alerts and warnings
- Recent transactions (latest 5)
- Real-time updates

### 3. Expense Management
- Add/Edit/Delete expenses
- Categorize expenses
- Multiple payment methods
- Link to trips
- Search and filter
- Export data

### 4. Income Tracking
- Record all income sources
- Track income history
- Date-based organization
- Edit and delete capabilities

### 5. Budget Management
- Set monthly/yearly budgets
- Category-specific budgets
- Visual progress bars
- Automatic alerts at 90% and 100%
- Color-coded status

### 6. Trip Planner
- Create trip plans
- Set trip budgets
- Link expenses to trips
- Track spending vs budget
- Trip-specific analytics

### 7. Reports & Analytics
- **Pie Chart**: Category-wise distribution
- **Bar Chart**: Income vs Expenses
- **Line Chart**: 6-month trend
- Top spending categories
- Detailed breakdowns

### 8. Categories
- 8 default categories
- Custom category creation
- Icon and color customization
- Usage statistics

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons

### Data Visualization
- **Recharts** - Charts and graphs

### Routing
- **React Router 7** - Navigation

### State Management
- **Context API** - Global state

### Build Tools
- **Vite** - Fast development
- **PostCSS** - CSS processing

---

## 📱 Pages

1. **Landing Page** - Marketing and features
2. **Login Page** - User authentication
3. **Signup Page** - Account creation
4. **Dashboard** - Financial overview
5. **Expenses** - Expense management
6. **Income** - Income tracking
7. **Budgets** - Budget management
8. **Trips** - Trip planning
9. **Reports** - Analytics and charts
10. **Categories** - Category management
11. **Profile** - User settings and data export
12. **404** - Error page

---

## 🎨 UI/UX Features

- ✨ Modern, clean interface
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Color-coded categories
- 📊 Interactive charts
- 🔔 Toast notifications
- ⚠️ Budget alerts
- 🎯 Progress indicators
- 🔍 Search functionality
- 🎭 Modal dialogs
- 🌈 Custom themes

---

## 📊 Sample Data Flow

### Adding an Expense
```
User clicks "Add Expense" 
  → Opens dialog form
  → User fills details
  → Submits form
  → Validates input
  → Saves to localStorage
  → Updates Context state
  → Re-renders all components
  → Shows success notification
  → Updates dashboard totals
  → Checks budget alerts
```

---

## 🎓 Academic Value

### Learning Outcomes
- Full-stack web development
- React & TypeScript mastery
- State management patterns
- Data persistence strategies
- UI/UX design principles
- Responsive web design
- Data visualization
- Software architecture
- Project documentation

### Suitable For
- Computer Science FYP
- Software Engineering Capstone
- Web Development Project
- Information Systems Project

---

## 📈 Statistics

- **Total Pages**: 12
- **React Components**: 50+
- **Lines of Code**: 4,500+
- **Features**: 100+
- **Charts**: 3 types
- **Database Models**: 6

---

## 🔒 Security Features

- Password validation (min 6 chars)
- Email uniqueness check
- Form input validation
- Protected routes
- Session management
- Local data storage

**Note**: For production deployment, additional security measures are recommended:
- Password hashing (bcrypt)
- JWT authentication
- HTTPS encryption
- CSRF protection
- Rate limiting

---

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
```

### Deploy To

- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting**

### Environment

No environment variables needed - uses LocalStorage

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Export to PDF
- [ ] Export to Excel
- [ ] Email reports
- [ ] Recurring expenses
- [ ] Multi-currency support
- [ ] Receipt upload
- [ ] AI spending predictions
- [ ] Mobile apps
- [ ] Backend API
- [ ] Cloud sync
- [ ] Shared budgets
- [ ] Bill reminders

---

## 🐛 Known Limitations

1. **Data Storage**: Uses LocalStorage (browser-based)
2. **Data Loss**: Clearing browser data deletes all information
3. **No Cloud Sync**: Data not synced across devices
4. **Single User**: No multi-user support per device

**Solution**: Regular data exports recommended

---

## 📸 Screenshots

### Dashboard
- Overview of finances
- Budget alerts
- Recent transactions

### Expense Tracking
- Add/edit expenses
- Filter by category
- Search functionality

### Reports
- Visual charts
- Category breakdown
- Monthly trends

### Trip Planner
- Create trips
- Track trip expenses
- Budget comparison

---

## 🤝 Contributing

This is an academic project (FYP). For educational purposes only.

---

## 📄 License

This project is created for educational purposes as part of a Final Year Project (FYP).

---

## 👨‍💻 Developer

**Your Name**  
Computer Science Student  
University Name  
Academic Year: 2025-2026

### Supervisor
**Supervisor Name**  
Department of Computer Science

---

## 📞 Support

For questions or issues:
- 📧 Email: your.email@university.edu
- 🎓 Department: Computer Science
- 📚 Project: FYP-2026-XXX

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Radix UI** - For accessible components
- **Recharts** - For beautiful charts
- **Tailwind CSS** - For utility-first styling
- **Lucide** - For elegant icons

Special thanks to my supervisor and department for guidance and support.

---

## 📝 Version History

- **v1.0.0** (March 2026) - Initial release
  - All core features implemented
  - Complete documentation
  - Ready for FYP submission

---

## 🎯 Project Status

✅ **COMPLETE** - Ready for FYP Demonstration

### Completion Checklist
- [x] All features implemented
- [x] UI/UX complete
- [x] Documentation complete
- [x] Testing complete
- [x] Build working
- [x] Deployment ready

---

## 💡 Pro Tips for Using This Project

### For FYP Presentation
1. Start with the Landing Page
2. Demo the signup process
3. Show dashboard with sample data
4. Demonstrate adding expenses
5. Show budget alerts in action
6. Present the Reports page with charts
7. Highlight the Trip Planner feature
8. Export data to show persistence

### For Documentation
- Use `PROJECT_DOCUMENTATION.md` for technical details
- Reference `FEATURES_CHECKLIST.md` for feature proof
- Include `QUICK_START_GUIDE.md` in appendix

### For Demo
- Prepare sample data beforehand
- Create a demo user account
- Add diverse expenses across categories
- Set budgets that show alerts
- Create sample trips with expenses

---

**Happy Tracking! 💰📊**

---

*Built with ❤️ for Final Year Project 2026*
