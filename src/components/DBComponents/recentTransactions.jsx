import React from "react";

export const RecentTransactions = ({ transactions }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
            <ul>
                {transactions.length > 0 ? (
                    transactions.slice(0, 5).map((transaction, index) => (
                        <li key={index} className="py-2 border-b last:border-b-0">
                            <p className="text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-gray-600">{transaction.date} - ${transaction.amount}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No recent transactions.</p>
                )}
            </ul>
        </div>
    );
};
