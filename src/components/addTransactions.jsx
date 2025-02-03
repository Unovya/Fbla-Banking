import React, {useEffect, useState} from 'react';
import {db} from "../scripts/database-Stuff/db";

export function AddTransactions({ defaultBal } = { defaultBal: 0 }) {

    const [balance, setBal] = useState(defaultBal); // Current balance
    const [inputBal, setInputBal] = useState(""); // Input value for adding (string so we don't get an error with the input)
    const [inputName, setInputName] = useState("");
    const [inputAction, setInputAction] = useState(""); // Deposit or withdraw
    const [inputCategory, setInputCategory] = useState(""); // Category for the transaction
    const [dropDownToggle, setDropDownToggle] = useState(false);

    const toggleDropDown = () => console.log('test');

    async function clearTable(){
        await db.transactionLog.clear();
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
                amount: intInput.toFixed(2),
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
            <div className='flex flex-col bg-gray-100 overflow-x-hidden h-[55%] overflow-y-hidden rounded-xl  items-center'>
                <h1 className='mt-3 mx-3 text-black font-bold w-fit'>Add Transaction</h1>
                {/* input fields */}
                <div className='justify-center items-center text-center'>
                    <div className="text-white font-medium text-lg">
                        <label className='text-black'>Current Balance ${balance}</label>
                    </div>

                    {/* Name input */}
                    <input
                        type="text"
                        value={inputName}
                        onChange={(evN) => setInputName(evN.target.value)}
                        placeholder="Name of Transaction"
                        className="text-black rounded-xl h-11"
                    />

                    <div className="relative flex-col justify-center text-center text-left">
                        <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none' type='button' onClick={toggleDropDown}></button>
                    </div>

                </div>
            </div>
    );
}

