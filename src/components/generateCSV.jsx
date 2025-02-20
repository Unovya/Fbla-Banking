import React, { useEffect, useState } from "react";
import { db } from "../scripts/database-scripts/db.js";
import { HiOutlinePaperClip } from "react-icons/hi2";

const generateCSV = (event, data) => {
    event.preventDefault();
    event.stopPropagation();

    let currentBalance = 0; // Start balance at 0
    const csvData = [
        ["ID", "Name", "Category", "Action", "Amount", "Date", "Balance"], // Add "Balance" header
        ...data.map((transaction) => {
            // Change amount to a number
            const amount = parseFloat(transaction.amount);
            if (isNaN(amount)) {
                return []; // skips non numbers
            }

            // Calculate balance after each transaction
            if (transaction.action === "withdraw") {
                currentBalance -= amount; // Subtract for withdraw
            } else if (transaction.action === "deposit") {
                currentBalance += amount; // Add for deposit
            }

            return [
                transaction.id,
                transaction.name.charAt(0).toUpperCase() + transaction.name.slice(1),
                transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1),
                transaction.action.charAt(0).toUpperCase() + transaction.action.slice(1),
                transaction.action === 'withdraw' ? `-$${amount.toFixed(2)}` : `+$${amount.toFixed(2)}`,
                new Date(transaction.date).toLocaleDateString(),
                `$${currentBalance.toFixed(2)}`, // Add new balance
            ];
        }),
    ];

    function joinContent(content) {
        return content.map((row) => row.join(",")).join("\n");
    }

    const csvContent = joinContent(csvData);

    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
};

const CSVDownloader = () => {
    const [transactions, setTransactions] = useState([]);

    // Fetch transactions from the Dexie database
    useEffect(() => {
        const fetchTransactions = async () => {
            const allTransactions = await db.transactionLog.toArray();
            setTransactions(allTransactions);
        };

        fetchTransactions();
    }, []);

    return (
        <button
            onClick={(event) => generateCSV(event, transactions)}
            type="button"
            className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-base text-white font-semibold py-1 px-2 mr-4 mt-2 border border-gray-400 flex rounded-lg shadow items-center duration-100"
        >
            <HiOutlinePaperClip /> Generate Report
        </button>
    );
};

export default CSVDownloader;
