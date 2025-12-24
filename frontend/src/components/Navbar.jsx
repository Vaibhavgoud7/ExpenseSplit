import { Link, NavLink } from "react-router-dom";
import UserSelector from "./UserSelector.jsx";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-blue border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-gray-800 tracking-tight"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
            ₹
          </span>
          Expense Splitter
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `text-sm transition-colors ${
                isActive
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            Users
          </NavLink>

          <NavLink
            to="/create-group"
            className={({ isActive }) =>
              `text-sm transition-colors ${
                isActive
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            Create Group
          </NavLink>

          <NavLink
            to="/balances"
            className={({ isActive }) =>
              `text-sm transition-colors ${
                isActive
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            Balances
          </NavLink>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-300" />

          {/* User Selector */}
          <UserSelector />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
