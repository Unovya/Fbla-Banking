import { useState, useEffect } from "react";
import { db } from "../db.js";
import React from "react";

export function BalTest({ defaultBal } = { defaultBal: 0 }) {
    const [balance, setBal] = useState(defaultBal); // Current balance
    const [inputBal, setInputBal] = useState(""); // Input value for adding (string so we don't get an error with the input)

    useEffect(() => {
        // grabs the current balance from the database
        async function grabBalance() {
            try {
                const existingBal = await db.currentBal.toCollection().first();
                if (existingBal) {
                    setBal(parseFloat(existingBal.balance) || 0); // make balance a number
                }
            } catch (error) {
                console.log("Error grabbing balance:", error);
            }
        }
        grabBalance();
    }, []);

    async function updateBal() {
        try {
            const intInput = parseFloat(inputBal); // make input a number
            const intBalance = parseFloat(balance); // make balance number

            if (isNaN(intInput) || isNaN(intBalance)) {
                console.error("Invalid input or balance: not a number");
                return;
            }

            const newBalance = intBalance + intInput; // add it
            const existingBal = await db.currentBal.toCollection().first();

            if (existingBal) {
                // Update the existing Bal
                await db.currentBal.update(existingBal.id, {
                    balance: newBalance,
                });
            } else {
                // If no Bal exists, create a new one (This shouldn't Happen)
                await db.currentBal.add({
                    balance: newBalance,
                });
            }

            setBal(newBalance); // Update the balance
            setInputBal(""); // Reset the input field
        } catch (error) {
            console.log("Error updating balance:", error);
        }
    }

    return (
        <>
            <div className='text-white text-lg'>
                <label>Current Balance: {balance}</label>
            </div>
            <input
                type="number"
                value={inputBal}
                onChange={(ev) => setInputBal(ev.target.value)}
                placeholder="Enter amount to add"
                className='text-black'
            />
            <button onClick={updateBal} className='text-white'>Update Balance</button>
        </>
    );
}
