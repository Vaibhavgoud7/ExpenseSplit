import { useEffect, useState } from "react";
import { getAllUsers } from "../api/userApi";
import { useUser } from "../context/userContext.jsx";

const UserSelector = () => {
  const { currentUser, selectUser } = useUser();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleChange = (e) => {
    const userId = e.target.value;
    const selectedUser = users.find((u) => u._id === userId) || null;
    selectUser(selectedUser);
  };

  return (
    <div className="relative">
      <select
        value={currentUser?._id || ""}
        onChange={handleChange}
        className="
          appearance-none
          bg-white/95 backdrop-blur
          border border-gray-300
          text-gray-800 text-sm
          px-3 py-1.5 pr-8
          rounded-full
          shadow-sm
          hover:border-indigo-400
          focus:outline-none
          focus:ring-2 focus:ring-indigo-500
          transition
        "
      >
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 text-xs">
        ▼
      </div>
    </div>
  );
};

export default UserSelector;
