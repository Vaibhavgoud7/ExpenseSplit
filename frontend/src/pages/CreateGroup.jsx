
import { useEffect, useState } from "react";
import { createGroup } from "../api/groupApi";
import { getAllUsers } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";

const CreateGroup = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white px-8 py-6 rounded-xl shadow text-gray-600">
          Please select a user to create a group
        </div>
      </div>
    );
  }

  const toggleMember = (userId) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter group name");
      return;
    }

    if (members.length === 0) {
      alert("Select at least one member");
      return;
    }

    const finalMembers = members.includes(currentUser._id)
      ? members
      : [...members, currentUser._id];

    try {
      setLoading(true);
      const res = await createGroup({
        name,
        members: finalMembers,
        createdBy: currentUser._id
      });
      navigate(`/group/${res.data._id}`);
    } catch (err) {
      console.error("Group creation failed", err);
      alert("Group creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Create a New Group
          </h2>
          <p className="text-gray-500 mt-1">
            Add members and start tracking shared expenses
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Group Name */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              placeholder="Goa Trip, Flatmates, Office Lunch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full px-5 py-3 rounded-xl border border-gray-200
                focus:ring-2 focus:ring-blue-500 focus:outline-none
                text-gray-800 placeholder-gray-400
              "
            />
          </div>

          {/* Members */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Select Members
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {users.map((user) => {
                const selected = members.includes(user._id);

                return (
                  <div
                    key={user._id}
                    onClick={() => toggleMember(user._id)}
                    className={`
                      relative cursor-pointer rounded-2xl p-4 border transition-all duration-200
                      ${
                        selected
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg"
                          : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{user.name}</span>

                      {selected && (
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-blue-600 font-bold text-sm">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 rounded-2xl font-semibold text-white text-lg transition-all
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 shadow-lg"
                }
              `}
            >
              {loading ? "Creating Group..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
