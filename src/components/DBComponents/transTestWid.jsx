import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../scripts/database-Stuff/db.js";
import React, {useEffect, useRef, useState} from "react";

function colorSwitch(num) {
    if (num % 2 === 0) return "bg-gray-200 hover:bg-gray-300";
    else return "bg-white hover:bg-gray-100";
}
function shorten(num, maxLength) {
    if (num.length > maxLength) {
        return num.slice(0, maxLength) + '...';
    }
    return num;
}


export function TransWidget({ defaultBal } = { defaultBal: 0 }) {
    const transactions = useLiveQuery(() => db.transactionLog.toArray());

    const [TransAction, setTransAction] = React.useState('');
    const [TransName, setTransName] = React.useState('');
    const [TransCategory, setTransCategory] = React.useState('');
    const [TransDate, setTransDate] = React.useState('');
    const [TransId, setTransId] = React.useState('');
    const [TransAmount, setTransAmount] = React.useState(0);

    function setupDetails(name, action, category, amount, date, id) {
        setTransId(id);
        setTransName(name);
        setTransDate(date);
        setTransCategory(category);
        setTransAction(action);
        setTransAmount(amount);
    }
    // Transactions stuff

    const [balance, setBal] = useState(defaultBal); // Current balance
    const [inputBal, setInputBal] = useState(""); // Input value for adding (string so we don't get an error with the input)
    const [inputName, setInputName] = useState("");
    const [inputAction, setInputAction] = useState(""); // Deposit or withdraw
    const [inputCategory, setInputCategory] = useState(""); // Category for the transaction
    const [dropDownToggle, setDropDownToggle] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropDown = () => setDropDownToggle(!dropDownToggle);

    useEffect(() => {
        const clickOutsideDropdown = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropDownToggle(false); // Close the dropdown if clicked outside
            }

        };

        document.addEventListener('mousedown', clickOutsideDropdown);

        return () => {
            // Cleanup event listener on component unmount
            document.removeEventListener('mousedown', clickOutsideDropdown);
        };
    }, [])

    const categorySelect = (category) =>{
        setTransCategory(category);
        setDropDownToggle(false);

    }

    async function clearTable(){
        await db.transactionLog.clear();
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
        <>
            {/* Blurring div and gray area */}

            <div
                className={`flex flex-row ml-3 mt-5 mb-5 mr-1 bg-gray-100 overflow-x-hidden overflow-y-auto drop-shadow rounded-xl h-[95%] w-[67%]}`}>
                {/* Scroll Area */}
                <div
                    className='flex flex-col m-5 bg-gray-100 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 rounded-xl h-[90%] w-[95%]'>
                    {/* Top row */}
                    <div className='flex flex-row bg-white h-6 ml-3 mr-3 mt-3 mb-1 rounded w-[98%] font-bold shadow'>
                        <p className='ml-3 w-[55px] text-left'>ID #</p>
                        <p className='w-[150px] text-left'>Name</p>
                        <p className='w-[140px] text-left'>Category</p>
                        <p className='w-[100px] text-left'>Action</p>
                        <p className='w-[100px] text-left'> Amount</p>
                        <p className=''>Date</p>
                    </div>

                    {/* Transactions Rows */}
                    <ul>
                        {[...(transactions ?? [])].reverse().map((transaction) => (
                            <li key={transaction.id} className='last:mb-3'>
                                <button type='button'
                                        className={`flex flex-row ${colorSwitch(transaction.id)} text-black h-6 ml-3 mr-3 w-[98%] mt-2 rounded font-bold shadow`}
                                        onClick={() => setupDetails(transaction.name, transaction.action, transaction.category, transaction.amount, transaction.date, transaction.id)}>
                                    <p className='ml-3 w-[55px] text-left'>{transaction.id}</p>
                                    <p className='w-[150px] text-left'>{transaction.name.charAt(0).toUpperCase() + transaction.name.slice(1)}</p>
                                    <p className='w-[140px] text-left'>{transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</p>
                                    <p className='w-[100px] text-left'>{transaction.action.charAt(0).toUpperCase() + transaction.action.slice(1)}</p>
                                    <p className='w-[100px] text-left'>{transaction.action === 'withdraw' && `-$${shorten(transaction.amount, 6)}`} {transaction.action === 'deposit' && `+$${shorten(transaction.amount, 6)}`}</p>
                                    <p className='text-left'>{transaction.date}</p>
                                </button>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>

            {/*details*/}
            <div className='flex flex-col h-[85%] w-[30%] mt-5 ml-2'>
                <div
                    className='flex flex-col bg-gray-100 mb-5 overflow-x-hidden overflow-y-hidden rounded-xl h-[31%] items-center'>
                    <h1 className='mt-3 mx-3 text-black font-bold w-fit'>Transaction Details</h1>
                    <p className='flex flex-row'>Transaction Id: #{TransId}</p>
                    <p>Name of Transaction: {TransName.charAt(0).toUpperCase() + TransName.slice(1)}</p>
                    <p>Category: {TransCategory.charAt(0).toUpperCase() + TransCategory.slice(1)}</p>
                    <p>Action: {TransAction.charAt(0).toUpperCase() + TransAction.slice(1)}</p>
                    <p>Amount: {TransAction === 'withdraw' && "-"}{TransAction === 'deposit' && "+"}${TransAmount}</p>
                    <p>Date of Transaction: {TransDate.charAt(0).toUpperCase() + TransDate.slice(1)}</p>
                </div>


                {/* Add Transactions */}
                <div
                    className='flex flex-col bg-gray-100 overflow-x-hidden h-[55%] overflow-y-hidden rounded-xl  items-center'>
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
                            className="text-black rounded-xl  h-11"
                        />

                        <div className="relative flex flex-col justify-center items-center text-center">
                            <button
                                className='bg-white text-gray-500 outline outline-black rounded-xl h-11 w-52 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200'
                                type='button' onClick={toggleDropDown}>
                                Choose category
                            </button>

                            <div ref={dropdownRef} className={`absolute top-full mt-2 w-52 bg-white divide-y divide-gray-100 rounded-lg shadow-md ${dropDownToggle ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-300`}>
                                <ul className="py-2 text-sm text-gray-700">
                                    <li>
                                        <button onClick={(e) => categorySelect(e.target.textContent)}  className="block px-4 py-2 hover:bg-gray-100">Dashboard</button>
                                    </li>
                                    <li>
                                        <button onClick={(e) => categorySelect(e.target.textContent)} className="block px-4 py-2 hover:bg-gray-100">Settings</button>
                                    </li>
                                    <li>
                                        <button onClick={(e) => categorySelect(e.target.textContent)} className="block px-4 py-2 hover:bg-gray-100">Earnings</button>
                                    </li>
                                    <li>
                                        <button onClick={(e) => categorySelect(e.target.textContent)} className="block px-4 py-2 hover:bg-gray-100">Sign out</button>
                                    </li>
                                </ul>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </>
    )
        ;
}
