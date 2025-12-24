import { useEffect, useState } from "react";
import { getUserBalances } from "../api/balanceApi";
import { useUser } from "../context/userContext.jsx";

const Balances = () => {
  const { currentUser } = useUser();
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    fetchBalances();
  }, [currentUser]);

  const fetchBalances = async () => {
    try {
      const res = await getUserBalances(currentUser._id);
      setBalances(res.data);
    } catch (err) {
      console.error("Failed to fetch balances", err);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Please select a user
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Balances
        </h2>
        <p className="text-gray-500 mb-8">
          Overview of what you owe and what you’ll receive
        </p>

        {balances.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-600">
            🎉 Everything is settled. No pending balances.
          </div>
        ) : (
          <div className="space-y-4">
            {balances.map((b, index) => {
              const isReceivable = b.type === "receivable";

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-5 rounded-2xl shadow-sm border transition-all
                    ${
                      isReceivable
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold
                        ${
                          isReceivable
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }
                      `}
                    >
                      ₹
                    </div>

                    {/* Text */}
                    <div>
                      <p className="font-semibold text-gray-800">
                        {isReceivable ? (
                          <>
                            <span className="text-green-700">
                              {b.user.name}
                            </span>{" "}
                            owes you
                          </>
                        ) : (
                          <>
                            You owe{" "}
                            <span className="text-red-700">
                              {b.user.name}
                            </span>
                          </>
                        )}
                      </p>

                      <p className="text-sm text-gray-500">
                        {isReceivable ? "You will receive" : "You need to pay"}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div
                    className={`text-xl font-bold
                      ${
                        isReceivable
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    `}
                  >
                    ₹{b.amount}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Balances;