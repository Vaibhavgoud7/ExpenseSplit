
import { useEffect, useState } from "react";
import { getAllGroups } from "../api/groupApi";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";

const Home = () => {
  const { currentUser } = useUser();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const res = await getAllGroups();
    setGroups(res.data);
  };

  const visibleGroups = currentUser
    ? groups.filter((g) =>
        g.members.some((m) => m._id === currentUser._id)
      )
    : groups;

  return (
    <div className="min-h-screen bg-blue-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            👥 Your Groups
          </h2>
          <p className="text-gray-500 mt-1">
            Manage shared expenses easily
          </p>
        </div>

        {/* Groups */}
        {visibleGroups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              No groups yet
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Create a group to start splitting expenses
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleGroups.map((group) => (
              <Link
                key={group._id}
                to={`/group/${group._id}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5"
              >
                {/* Group Name */}
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                  {group.name}
                </h3>

                {/* Members */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.members.map((m) => (
                    <span
                      key={m._id}
                      className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full"
                    >
                      {m.name}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 text-sm text-gray-400">
                  {group.members.length} members
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
