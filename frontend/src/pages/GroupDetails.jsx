import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getGroupById, deleteGroup } from "../api/groupApi";
import { getExpensesByGroup } from "../api/expenseApi";
import { getGroupBalances, settleBalance } from "../api/balanceApi";
import { useUser } from "../context/userContext.jsx";

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);

  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [settleTarget, setSettleTarget] = useState(null);
  const [settleAmount, setSettleAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all data for the group
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

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const handleDeleteGroup = async () => {
    try {
      setLoading(true);
      await deleteGroup(groupId);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSettle = async (e) => {
    e.preventDefault();
    if (!settleTarget || !settleAmount) return;

    try {
      setLoading(true);
      await settleBalance({
        group: groupId,
        fromUser: currentUser._id,
        toUser: settleTarget._id,
        amount: Number(settleAmount)
      });
      
      setSettleTarget(null);
      setSettleAmount("");
      fetchData(); // Refresh data immediately
    } catch (err) {
      alert(err.response?.data?.message || "Settlement failed");
    } finally {
      setLoading(false);
    }
  };

  if (!group) return <p className="p-6">Loading...</p>;

  // --- Helper to safely compare IDs ---
  const isSameUser = (id1, id2) => String(id1) === String(id2);

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{group.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{group.members.length} members</p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/group/${groupId}/add-expense`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              + Add Expense
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-lg transition"
            >
              Delete Group
            </button>
          </div>
        </div>

        {/* Warning if no user selected */}
        {!currentUser && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r">
            <p className="text-yellow-700 font-medium">
              ⚠️ Please select a user in the Navbar to view your balances.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Balances */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Your Balances</h3>
              
              {!currentUser ? (
                <p className="text-gray-400 text-sm italic">Select a user to see debts.</p>
              ) : balances.length === 0 ? (
                <p className="text-gray-500 italic text-sm">No debts found.</p>
              ) : (
                <div className="space-y-3">
                  {balances.map((b) => {
                    // Guard clauses for deleted users
                    if (!b.fromUser || !b.toUser) return null;

                    // STRICT LOGIC: 
                    // b.fromUser OWES b.toUser
                    const iOwe = isSameUser(b.fromUser._id, currentUser._id);
                    const owesMe = isSameUser(b.toUser._id, currentUser._id);
                    
                    // If this balance has nothing to do with the selected user, hide it
                    if (!iOwe && !owesMe) return null; 

                    return (
                      <div key={b._id} className={`p-3 rounded-xl border ${iOwe ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {iOwe ? `You owe ${b.toUser.name}` : `${b.fromUser.name} owes you`}
                          </span>
                          <span className={`font-bold ${iOwe ? 'text-red-600' : 'text-green-600'}`}>
                            ₹{b.amount}
                          </span>
                        </div>
                        
                        {/* Only show SETTLE button if YOU owe money */}
                        {iOwe && (
                          <button
                            onClick={() => {
                                setSettleTarget(b.toUser);
                                setSettleAmount(b.amount);
                            }}
                            className="w-full text-xs bg-white border border-red-200 text-red-600 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition font-medium"
                          >
                            Pay / Settle
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {/* Fallback if map filters out everything */}
                  {balances.every(b => !isSameUser(b.fromUser?._id, currentUser._id) && !isSameUser(b.toUser?._id, currentUser._id)) && (
                     <p className="text-gray-500 italic text-sm">You are all settled up! 🎉</p>
                  )}
                </div>
              )}
            </div>

            <div>
               <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Group Members</h3>
               <div className="flex flex-wrap gap-2">
                 {group.members.map(m => (
                   <span key={m._id} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-1">
                     {m.name}
                   </span>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Column: Expenses */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Expense History</h3>
            {expenses.length === 0 ? (
              <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl border-dashed border-2">
                No expenses added yet.
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.map((exp) => (
                  <div key={exp._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{exp.description}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium text-indigo-600">
                             {/* Check if payer exists before accessing name */}
                             {exp.paidBy ? exp.paidBy.name : "Unknown"}
                          </span> paid 
                          <span className="font-bold text-gray-900"> ₹{exp.totalAmount}</span>
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full uppercase">
                        {exp.splitType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settle Modal */}
        {settleTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSettleTarget(null)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-scaleIn">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Settle Up</h3>
              <p className="text-gray-600 mb-6">
                Paying <strong>{settleTarget.name}</strong>
              </p>
              
              <form onSubmit={handleSettle}>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Amount</label>
                <div className="relative mb-6">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-bold">₹</span>
                  <input 
                    type="number" 
                    value={settleAmount}
                    onChange={(e) => setSettleAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 text-lg font-bold border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setSettleTarget(null)}
                    className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg transition"
                  >
                    {loading ? "Settling..." : "Pay Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Delete Group Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Group?</h3>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancel</button>
                <button onClick={handleDeleteGroup} className="px-4 py-2 rounded-lg bg-red-600 text-white">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;