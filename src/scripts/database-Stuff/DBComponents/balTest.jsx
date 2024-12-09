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
                } else {
                    // If no balance exists, ensure we set it to defaultBal (0 or input)
                    setBal(defaultBal);
                }
            } catch (error) {
                console.log("Error grabbing balance:", error);
            }
        }
        grabBalance();
    }, [defaultBal]);

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
                // Update the existing balance
                await db.currentBal.update(existingBal.id, {
                    balance: newBalance,
                });
            } else {
                // If no balance exists, create a new one
                await db.currentBal.add({
                    balance: newBalance,
                });
            }

            // reset the input field
            setBal(newBalance);
            setInputBal("");
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
