
import { useEffect, useState } from "react";
import { createUser, getAllUsers, deleteUser } from "../api/userApi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      setLoading(true);
      await createUser({ name, email });
      setName("");
      setEmail("");
      fetchUsers();
    } catch (err) {
      console.error("User creation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!confirmUser) return;

    try {
      setDeletingId(confirmUser._id);
      await deleteUser(confirmUser._id);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    } finally {
      setDeletingId(null);
      setConfirmUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          👤 Users
        </h2>

        {/* Create User Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Add New User
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2 rounded-lg font-medium"
            >
              {loading ? "Creating..." : "Add User"}
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {users.length === 0 ? (
            <p className="p-6 text-center text-gray-500">
              No users found
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center px-6 py-4 border-b last:border-none hover:bg-indigo-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={() => setConfirmUser(user)}
                  className="text-red-600 border border-red-500 hover:bg-red-500 hover:text-white transition px-4 py-1.5 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* ===== Delete Confirmation Modal ===== */}
        {confirmUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background Blur */}
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setConfirmUser(null)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-scaleIn">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Delete User
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>{confirmUser.name}</strong>?  
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmUser(null)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  disabled={deletingId === confirmUser._id}
                  className="bg-red-600 hover:bg-red-700 transition text-white px-5 py-2 rounded-lg"
                >
                  {deletingId === confirmUser._id
                    ? "Deleting..."
                    : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Animation */}
        <style>
          {`
            @keyframes scaleIn {
              from {
                opacity: 0;
                transform: scale(0.9);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-scaleIn {
              animation: scaleIn 0.2s ease-out;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Users;
