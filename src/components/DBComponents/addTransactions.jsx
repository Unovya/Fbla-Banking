import React, {useEffect, useRef, useState} from 'react';
import {db} from "../../scripts/database-Stuff/db";

const AddTransactions = ({ defaultBal } = { defaultBal: 0 }) => {

    const [balance, setBal] = useState(defaultBal); // Current balance
    const [inputBal, setInputBal] = useState(""); // Input value for adding (string so we don't get an error with the input)
    const [inputName, setInputName] = useState("");
    const [inputAction, setInputAction] = useState("Choose an Action"); // Deposit or withdraw
    const [inputCategory, setInputCategory] = useState("Choose a Category"); // Category for the transaction
    const [categoryDropDownToggle, setCategoryDropDownToggle] = useState(false);
    const [actionDropDownToggle, setActionDropDownToggle] = useState(false);
    const [transErrorStatus, setTransErrorStatus] = useState('')
    const categoryDropdownRef = useRef(null);
    const actionDropdownRef = useRef(null);

    const toggleCategoryDropDown = () =>{
        if (inputAction !== 'deposit' && inputAction !== 'withdraw'){
            setTransErrorStatus('You must select an action before a category')
        }
        else {
            setCategoryDropDownToggle(!categoryDropDownToggle);
            setTransErrorStatus('')
        }

    }
    const toggleActionDropDown = () => setActionDropDownToggle(!actionDropDownToggle);

    useEffect(() => {
        const clickOutsideDropdown = (e) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
                setCategoryDropDownToggle(false); // Close the dropdown if clicked outside
            }

        };
        // listen for clicks
        document.addEventListener('mousedown', clickOutsideDropdown);

        return () => {
            // stop listening for clicks
            document.removeEventListener('mousedown', clickOutsideDropdown);
        };
    }, [])

    useEffect(() => {
        const clickOutsideDropdown = (e) => {
            if (actionDropdownRef.current && !actionDropdownRef.current.contains(e.target)) {
                setActionDropDownToggle(false); // Close the dropdown if clicked outside
            }

        };
        // listen for clicks
        document.addEventListener('mousedown', clickOutsideDropdown);

        return () => {
            // stop listening for clicks
            document.removeEventListener('mousedown', clickOutsideDropdown);
        };
    }, [])

    const categorySelect = (category) =>{
        setInputCategory(category);
        setCategoryDropDownToggle(false);

    }
    const actionSelect = (action) =>{
        setInputAction(action);
        setActionDropDownToggle(false);

    }


    function clearFields(){
        setInputBal("");
        setInputName("");
        setInputAction("Choose an Action");
        setInputCategory("Choose a Category");
        setTransErrorStatus('')
        console.log('nun atm'); // Change to check values

    }

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
            if (inputName === '' || inputAction === 'Choose an Action' || inputCategory ==='Choose a Category' || inputBal === ''){
                setTransErrorStatus('*All fields must be completed');
                console.log('must fill all fields');
                return;
            } else {
                setTransErrorStatus('');
            }

            

            const intInput = parseFloat(inputBal); // Make input a number
            const intBalance = parseFloat(balance); // Current balance

            if (intInput > intBalance && inputAction === 'withdraw'){
                setTransErrorStatus(`You do not have $${intInput}`);
                return;
            }


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
            setInputAction("Choose an Action");
            setInputCategory("Choose a Category");
        } catch (error) {
            console.log("Error updating balance:", error);
        }
    }


    return (
        <>
            <div
                className='flex flex-col shadow-md bg-gray-100 overflow-x-hidden h-[70%] overflow-y-hidden rounded-xl  items-center'>
                <h1 className={`mt-3 mx-3 text-red-700 ${transErrorStatus === '' && 'hidden'}  font-extrabold w-fit`}>{transErrorStatus}</h1>

                <h1 className='mt-3 mx-3 text-black font-bold w-fit'>Add Transaction</h1>
                {/* input fields */}
                <div className='justify-center items-center text-center space-y-3'>
                    <div className="text-white font-medium text-lg">
                        <label className='text-black'>Current Balance ${balance}</label>
                    </div>

                    {/* Name input */}
                    <input
                        type="text"
                        value={inputName}
                        onChange={(evN) => setInputName(evN.target.value)}
                        placeholder="Name of Transaction"
                        className="text-gray-700 border-black rounded-xl  h-11"
                    />

                    {/* Action Input */}
                    <div className="relative flex flex-col justify-center items-center text-center">
                        <button
                            className="text-gray-700 bg-white border border-black rounded-xl h-11 w-52 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center"
                            type="button"
                            onClick={toggleActionDropDown}>
                            {inputAction.charAt(0).toUpperCase() + inputAction.slice(1)}
                        </button>

                        <div ref={actionDropdownRef} className={`absolute top-full mt-2 w-52 bg-white z-50 divide-y divide-gray-100 rounded-lg shadow-md ${actionDropDownToggle ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'} transition-all duration-300`}>
                            <ul className="py-2 text-sm items-center text-center text-gray-700">
                                <li>
                                    <button onClick={(e) => actionSelect('deposit')} className="inline-block w-full py-2 hover:bg-gray-100">Deposit</button>
                                </li>
                                <li>
                                    <button onClick={(e) => actionSelect('withdraw')}  className="inline-block w-full py-2 hover:bg-gray-100">Withdraw</button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Category input */}
                    <div className="relative flex flex-col justify-center items-center text-center">
                        <button
                            className="text-gray-700 bg-white border border-black rounded-xl h-11 w-52 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center"
                            type="button"
                            onClick={toggleCategoryDropDown}>
                            {inputCategory.charAt(0).toUpperCase() + inputCategory.slice(1)}
                        </button>

                        <div ref={categoryDropdownRef} className={`absolute top-full mt-2 w-52 bg-white z-50 divide-y divide-gray-100 rounded-lg shadow-md ${categoryDropDownToggle ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'} transition-all duration-300`}>
                            <ul className={`py-2 text-sm items-center ${inputAction === 'deposit' ? 'hidden' : ''} text-center text-gray-700`}>
                                <li>
                                    <button onClick={(e) => categorySelect('entertainment')} className={`inline-block w-full py-2 hover:bg-gray-100`}>Entertainment</button>
                                </li>
                                <li>
                                    <button onClick={(e) => categorySelect('food')}  className="inline-block w-full py-2 hover:bg-gray-100">Food</button>
                                </li>
                                <li>
                                    <button onClick={(e) => categorySelect('shopping')} className="inline-block w-full py-2 hover:bg-gray-100">Shopping</button>
                                </li>
                                <li>
                                    <button onClick={(e) => categorySelect('bills')} className="inline-block w-full py-2 hover:bg-gray-100">Bills</button>
                                </li>
                                <li>
                                    <button onClick={(e) => categorySelect('other')}  className="inline-block w-full py-2 hover:bg-gray-100">Other</button>
                                </li>
                            </ul>

                            <ul className={`py-2 text-sm items-center ${inputAction === 'withdraw' ? 'hidden' : ''} text-center text-gray-700`}>
                                <li>
                                    <button onClick={(e) => categorySelect('work')} className={`inline-block w-full py-2 hover:bg-gray-100`}>Work</button>
                                </li>
                                <li>
                                    <button onClick={(e) => categorySelect('other')}  className="inline-block w-full py-2 hover:bg-gray-100">Other</button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Amount input */}
                    <input
                        type="number"
                        value={inputBal}
                        onChange={(evN) => setInputBal(evN.target.value)}
                        placeholder="Transaction Amount"
                        className="text-gray-700  rounded-xl shadow-md border-black h-11"
                    />

                </div>

                <div className="flex space-x-4 mt-10">
                    <button
                        onClick={updateBal}
                        className="text-gray-700 bg-white border border-black rounded-xl h-11 w-11/12 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center shadow-md"
                    >
                        Add Transaction
                    </button>

                    <button onClick={clearFields} className="text-gray-700 bg-white border border-black rounded-xl h-11 w-11/12 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center shadow-md">
                        Clear Fields
                    </button>

                    {/* Add Selected Delete */}
                </div>
            </div>
        </>
    );
};

export default AddTransactions;
