import { useEffect, useState } from "react";
import { getAllGroups } from "../api/groupApi";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";

const Home = () => {
  const { currentUser } = useUser();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await getAllGroups();
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    } finally {
      setLoading(false);
    }
  };

  // --- FILTERING LOGIC ---
  // If a user is selected, ONLY show groups they belong to.
  // We use String() comparison to ensure IDs match correctly.
  const visibleGroups = currentUser
    ? groups.filter((g) =>
        g.members.some((m) => String(m._id) === String(currentUser._id))
      )
    : groups; // If no user selected, show all groups (or you can set this to [] to show nothing)

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading groups...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {currentUser ? `Groups for ${currentUser.name}` : "All Groups"}
            </h2>
            <p className="text-gray-500 mt-1">
              {currentUser 
                ? "Here are the groups you are part of" 
                : "Select a user in the navbar to filter these groups"
              }
            </p>
          </div>
          
          <Link 
            to="/create-group"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md transition font-medium"
          >
            + Create New Group
          </Link>
        </div>

        {/* Groups Grid */}
        {visibleGroups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-gray-500 text-lg font-medium">
              {currentUser 
                ? `${currentUser.name} is not in any groups yet.` 
                : "No groups found."}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Create a group to start splitting expenses!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleGroups.map((group) => (
              <Link
                key={group._id}
                to={`/group/${group._id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-transparent hover:border-indigo-100"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition truncate pr-2">
                    {group.name}
                  </h3>
                  {/* Optional: Show an arrow or icon */}
                  <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
                </div>

                {/* Members Tags */}
                <div className="flex flex-wrap gap-2 mb-4 h-16 content-start overflow-hidden">
                  {group.members.slice(0, 5).map((m) => (
                    <span
                      key={m._id}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium truncate max-w-[100px]
                        ${currentUser && String(m._id) === String(currentUser._id)
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                          : "bg-gray-100 text-gray-600"
                        }
                      `}
                    >
                      {m.name}
                    </span>
                  ))}
                  {group.members.length > 5 && (
                    <span className="text-xs px-2 py-1 bg-gray-50 text-gray-500 rounded-full">
                      +{group.members.length - 5} more
                    </span>
                  )}
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-400">
                  <span>{group.members.length} Members</span>
                  <span>Created by {group.createdBy?.name || "Unknown"}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;