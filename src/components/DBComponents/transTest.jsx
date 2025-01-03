import { useState, useEffect } from "react";
import { db } from "../../scripts/database-Stuff/db.js";
import React from "react";

export function TransTest({ defaultBal } = { defaultBal: 0 }) {
    const [balance, setBal] = useState(defaultBal); // Current balance
    const [inputBal, setInputBal] = useState(""); // Input value for adding (string so we don't get an error with the input)
    const [inputName, setInputName] = useState("");
    const [inputAction, setInputAction] = useState(""); // Deposit or withdraw
    const [inputCategory, setInputCategory] = useState(""); // Category for the transaction


    function clearTable(){
        db.transactionLog.clear();
    }
    // Grab Balance
    useEffect(() => {
        async function grabBalance() {
            try {
                const existingBal = await db.currentBal.toCollection().first();
                if (existingBal) {
                    setBal(parseFloat(existingBal.balance) || 0); // Ensure balance is a number
                } else {
                    setBal(defaultBal); // Set to default if no balance exists
                }
            } catch (error) {
                console.log("Error grabbing balance:", error);
            }
        }
        grabBalance();
    }, [defaultBal]);

    async function updateBal() {
        try {
            const intInput = parseFloat(inputBal); // Make input a number
            const intBalance = parseFloat(balance); // Current balance

            if (isNaN(intInput) || isNaN(intBalance)) {
                console.error("Invalid input or balance: not a number");
                return;
            }

            if (intInput < 0.01) {
                console.error("Invalid input or balance: less than 1 cent");
                return;
            }

            const newBalance = inputAction === "deposit"
                ? intBalance + intInput
                : intBalance - intInput; // Subtract if action is 'withdraw'

            const existingBal = await db.currentBal.toCollection().first();

            if (existingBal) {
                await db.currentBal.update(existingBal.id, { balance: newBalance.toFixed(2) }); // To fixed makes sure Balance is at maximum 2 decimal digits.
            } else {
                await db.currentBal.add({ balance: newBalance });
            }

            await db.transactionLog.add({
                name: inputName,
                action: inputAction,
                amount: intInput,
                category: inputCategory,
                date: new Date().toDateString(),
                time: new Date().toLocaleTimeString(),
            });

            // Reset the input fields
            setBal(newBalance);
            setInputBal("");
            setInputName("");
            setInputAction("");
            setInputCategory("");
        } catch (error) {
            console.log("Error updating balance:", error);
        }
    }

    return (
        <>
            <div className="text-white font-medium text-lg">
                <label>Current Balance ${balance}</label>
            </div>

            <div className="text-white text-lg">
                <label>Add Transaction</label>
            </div>

            {/* Name Input */}
            <input
                type="text"
                value={inputName}
                onChange={(evN) => setInputName(evN.target.value)}
                placeholder="Add Name"
                className="text-black"
            />

            {/* Action Radio Buttons */}
            <div className="text-white">
                <label>
                    <input
                        type="radio"
                        value="deposit"
                        name="action"
                        checked={inputAction === "deposit"}
                        onChange={(e) => setInputAction(e.target.value)}
                    />
                    Deposit
                </label>
                <label>
                    <input
                        type="radio"
                        value="withdraw"
                        name="action"
                        checked={inputAction === "withdraw"}
                        onChange={(e) => setInputAction(e.target.value)}
                    />
                    Withdraw
                </label>
            </div>

            {/* Category Dropdown */}
            <div>
                <label className='text-white'>Category:</label>
                <select
                    value={inputCategory}
                    onChange={(ev) => setInputCategory(ev.target.value)}
                    className="text-black"
                >
                    <option value="">Select a category</option>
                    <option value="food">Food</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="bills">Bills</option>
                    <option value="shopping">Shopping</option>
                    <option value="work">work</option>
                </select>
            </div>

            {/* Amount Input */}
            <input
                type="number"
                value={inputBal}
                onChange={(evB) => setInputBal(evB.target.value)}
                placeholder="Enter amount to add"
                className="text-black"
            />

            {/* Update Balance Button */}
            <div>
                <button onClick={updateBal} className="text-white">
                    Add Transaction
                </button>

                <button onClick={clearTable} className="text-white">
                    Clear Transactions
                </button>
            </div>

        </>
    );
}
