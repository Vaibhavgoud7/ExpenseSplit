
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGroupById } from "../api/groupApi";
import { addExpense } from "../api/expenseApi";
import { useUser } from "../context/userContext.jsx";

const AddExpense = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const [group, setGroup] = useState(null);
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    getGroupById(groupId).then((res) => setGroup(res.data));
  }, [groupId]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Select user first
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addExpense({
      description,
      totalAmount: Number(totalAmount),
      paidBy: currentUser._id,
      group: groupId,
      splitType,
      participants: splitType === "equal" ? undefined : participants
    });

    navigate(`/group/${groupId}`);
  };

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 py-12">
      <div className="max-w-xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Add Expense
          </h2>
          <p className="text-gray-500 mb-6">
            Group: <span className="font-medium">{group.name}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="Dinner, groceries, rent..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                placeholder="₹ 0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Split Type (UI only, logic unchanged) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Split Type
              </label>
              <select
                value={splitType}
                onChange={(e) => setSplitType(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="equal">Equal Split</option>
                <option value="exact">Exact Amount</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
