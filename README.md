# 💰 Expense Splitter (Splitwise Clone)

A full-stack expense sharing application designed to track shared expenses, split bills among friends, and visualize balances with a simplified debt graph. This project was built to fulfill a backend engineering design assignment focusing on logical structuring and problem-solving.

## 🚀 Live Demo
- **Frontend:** [Click here to view App](https://expense-split-lac.vercel.app/)
- **Backend API:** [Click here to view API](https://expense-split-backend.vercel.app/)

---

## 📋 Features
This application meets all the requirements specified in the design assignment:

### 1. Group Management
- Create groups with multiple members.
- View group details and history.

### 2. Expense Tracking with Complex Splits
Supports three distinct types of splitting logic:
- **Equal Split:** Bill is divided equally among all selected participants.
- **Exact Amount:** Specify exactly how much each person owes.
- **Percentage Split:** Distribute the bill based on percentage shares (must sum to 100%).

### 3. Smart Balance Tracking
- **Real-time Updates:** Automatically calculates "Who owes Whom" after every expense.
- **Debt Simplification:** Implements an algorithm to simplify debts between two users (e.g., if A owes B ₹500 and B owes A ₹200, the system stores a single record: A owes B ₹300).
- **Settlements:** Ability to settle debts and clear balances.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite):** For a fast and reactive user interface.
- **Tailwind CSS:** For modern, responsive styling.
- **Axios:** For API integration.
- **React Router DOM:** For seamless client-side navigation.

### Backend
- **Node.js & Express.js:** RESTful API architecture.
- **MongoDB & Mongoose:** NoSQL database for flexible data modeling (Users, Groups, Expenses, Balances).
- **CORS & Dotenv:** Security and configuration management.

---

## 📂 Project Structure

```bash
EXPENSESPLIT/
├── Backend/                 # Node.js & Express Backend
│   ├── src/
│   │   ├── config/          # DB Connection (db.js)
│   │   ├── controllers/     # Logic (user, group, expense, balance)
│   │   ├── models/          # Mongoose Schemas
│   │   ├── routes/          # API endpoints
│   │   └── server.js        # Server Entry Point
│   ├── .env                 # Environment variables
│   ├── package.json         # Backend dependencies
│   └── vercel.json          # Vercel Deployment Config
│
└── frontend/                # React (Vite) Frontend
    ├── public/              # Static assets
    ├── src/
    │   ├── api/             # API calls (axios setup)
    │   ├── components/      # UI Components (Navbar, etc.)
    │   ├── context/         # UserContext
    │   ├── pages/           # Route Pages (Home, GroupDetails, etc.)
    │   ├── App.jsx          # Main App Component
    │   └── main.jsx         # React Entry Point
    ├── index.html           # HTML entry
    ├── package.json         # Frontend dependencies
    ├── vite.config.js       # Vite Configuration
    └── vercel.json          # Frontend Deployment Config
