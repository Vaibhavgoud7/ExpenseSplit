
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getGroupById, deleteGroup } from "../api/groupApi";
import { getExpensesByGroup } from "../api/expenseApi";
import { getGroupBalances } from "../api/balanceApi";

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupRes = await getGroupById(groupId);
        const expenseRes = await getExpensesByGroup(groupId);
        const balanceRes = await getGroupBalances(groupId);

        setGroup(groupRes.data);
        setExpenses(expenseRes.data);
        setBalances(balanceRes.data);
      } catch (err) {
        console.error("Failed to load group data", err);
      }
    };

    fetchData();
  }, [groupId]);

  const handleDeleteGroup = async () => {
    try {
      setDeleting(true);
      await deleteGroup(groupId);
      navigate("/");
    } catch (err) {
      console.error("Failed to delete group", err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!group) return <p className="p-6">Loading...</p>;

  const splitLabel = (type) => {
    if (type === "equal") return "Equal Split";
    if (type === "exact") return "Exact Split";
    if (type === "percentage") return "Percentage Split";
    return "";
  };

  return (
    <div className="min-h-screen bg-blue-100 py-10">
    <div className="p-8 max-w-4xl mx-auto relative bg-white rounded-3xl shadow-lg py-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{group.name}</h2>

        <div className="flex gap-3">
          <Link
            to={`/group/${groupId}/add-expense`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Add Expense
          </Link>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow cursor-pointer "
          >
            Delete Group
          </button>
        </div>
      </div>

      {/* Members */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-gray-700">Members</h3>
        <div className="flex gap-2 flex-wrap">
          {group.members.map((m) => (
            <span
              key={m._id}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {m.name}
            </span>
          ))}
        </div>
      </div>

      {/* Expenses */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-gray-700">Expenses</h3>

        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses yet</p>
        ) : (
          expenses.map((exp) => (
            <div
              key={exp._id}
              className="border rounded-xl p-4 mb-3 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium">{exp.description}</p>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {splitLabel(exp.splitType)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Paid by <strong>{exp.paidBy?.name || "Unknown"}</strong> — ₹
                {exp.totalAmount}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Balances */}
      <div>
        <h3 className="font-semibold mb-2 text-gray-700">Balances</h3>

        {balances.length === 0 ? (
          <p className="text-gray-500">All settled 🎉</p>
        ) : (
          balances.map((b) => {
            // ✅ CRASH FIX: Guard against deleted users
            if (!b.fromUser || !b.toUser) return null;

            return (
              <div
                key={b._id}
                className="flex justify-between items-center border rounded-xl p-3 mb-2 bg-white shadow-sm"
              >
                <span className="text-gray-700">
                  {b.fromUser.name} owes {b.toUser.name}
                </span>
                <span className="font-semibold text-red-600">
                  ₹{b.amount}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* ===== Delete Group Modal ===== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 backdrop-blur-md"
            onClick={() => setShowDeleteModal(false)}
          />

          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-96 animate-scaleIn">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Delete Group
            </h3>

            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete{" "}
              <strong>{group.name}</strong>?  
              This will permanently remove all expenses and balances.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteGroup}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
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

export default GroupDetails;
