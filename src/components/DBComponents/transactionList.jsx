import {db} from "../../scripts/database-Stuff/db.js";
import React, {useEffect, useRef, useState} from "react";
import AddTransactions from "./addTransactions.jsx";
import {useLiveQuery} from "dexie-react-hooks";

function colorSwitch(num) {
    if (num % 2 === 0) return "bg-gray-200 hover:bg-gray-300";
    else return "bg-white hover:bg-gray-100";
}
function shorten(num, maxLength) {
    if (num?.length > maxLength) {
        return num?.slice(0, maxLength) + '...';
    }
    return num;
}


export function TransWidget({defaultBal} = {defaultBal: 0}) {

    const transactions = useLiveQuery(() => db.transactionLog.toArray(), [], []);

    const [TransAction, setTransAction] = React.useState('');
    const [TransName, setTransName] = React.useState('');
    const [TransCategory, setTransCategory] = React.useState('');
    const [TransDate, setTransDate] = React.useState('');
    const [TransId, setTransId] = React.useState('');
    const [TransAmount, setTransAmount] = React.useState(0);
    const [deleteID, setDeleteID] = React.useState('');
    const [balance, setBal] = React.useState(defaultBal);
    const [DeleteConfirmation, setDeleteConfirmation] = useState(false); // New state for confirmation




    function setupDetails(name, action, category, amount, date, id) {
        setTransId(id);
        setTransName(name);
        setTransDate(date);
        setTransCategory(category);
        setTransAction(action);
        setTransAmount(amount);
    }

    // Filter
    const [FilterID, setFilterID] = React.useState('');
    const [FilterName, setFilterName] = React.useState('');
    const [FilterCategory, setFilterCategory] = React.useState('Category');
    const [FilterAction, setFilterAction] = React.useState('Action');
    const [FilterAmount, setFilterAmount] = React.useState('');
    const [FilterDate, setFilterDate] = React.useState('');
    const [filterErrorStatus, setFilterErrorStatus] = React.useState('');
    const [categoryDropDownToggle, setCategoryDropDownToggle] = useState(false);
    const [actionDropDownToggle, setActionDropDownToggle] = useState(false);
    const categoryDropdownRef = useRef(null);
    const actionDropdownRef = useRef(null);
    const [FilterOpen, setFilterOpen] = React.useState(false);


    function filterControls(){
        setFilterOpen(!FilterOpen);
    }

    const filterCategorySelect = (category) => {
        setFilterCategory(category);
        setCategoryDropDownToggle(false);
    }

    const actionSelect = (action) =>{
        setFilterAction(action);
        setActionDropDownToggle(false);

    }
    const toggleCategoryDropDown = () =>{
        setCategoryDropDownToggle(!categoryDropDownToggle);
        setFilterErrorStatus('')
    }
    const toggleActionDropDown = () =>{
        setActionDropDownToggle(!actionDropDownToggle);
        setFilterErrorStatus('')
    }

    function formatDate(dateString) {
        const date = new Date(dateString + "T00:00:00");
      
        
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
        
        const weekday = weekdays[date.getDay()];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        return `${weekday} ${month} ${day} ${year}`;
      }
      

    // Filter all current transactions
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);

    useEffect(() => {
        let filtered = transactions;

        if (FilterID) {
            filtered = filtered.filter((transaction) => transaction.id.toString().includes(FilterID.toString()));
        }
        if (FilterName) {filtered = filtered.filter((transaction) => transaction.name.toLowerCase().includes(FilterName.toLowerCase()));
        }
        if (FilterCategory && FilterCategory !== 'Category') {
            filtered = filtered.filter((transaction) => transaction.category === FilterCategory);
        }
        if (FilterAction && FilterAction !== 'Action') {
            filtered = filtered.filter((transaction) => transaction.action === FilterAction);
        }
        if (FilterAmount) {
            filtered = filtered.filter((transaction) => transaction.amount.toString().includes(FilterAmount.toString()));
        }
        if (FilterDate) {
            filtered = filtered.filter((transaction) => transaction.date === FilterDate);
        }

        setFilteredTransactions(filtered);
    }, [transactions, FilterID, FilterName, FilterCategory, FilterAction, FilterAmount, FilterDate]);

    // Empty filter fields and clear the current filter
    function clearFilter(){
        setFilteredTransactions(transactions)

        setFilterID('')
        setFilterName('')
        setFilterCategory('Category')
        setFilterAction('Action')
        setFilterAmount('')
        setFilterDate('')
    }

    //Delete transactions
    async function deleteTransactions() {
        if (deleteID > 0) {
            const transToDelete = await db.transactionLog.get(parseFloat(deleteID));
            if (!DeleteConfirmation) {
                setDeleteConfirmation(true); // Ask for confirmation
                return;
            } else {
                setDeleteConfirmation(false)
            }

            if (transToDelete) {
                const transactionAmount = parseFloat(transToDelete.amount);
                const intBal = parseFloat(balance);

                if (!isNaN(transactionAmount) && !isNaN(intBal)) {
                    const newBalance = transToDelete.action === "deposit"
                        ? intBal - transactionAmount
                        : intBal + transactionAmount;

                    if (!isNaN(newBalance)) { // Ensure newBalance is a number
                        const formattedBalance = newBalance.toFixed(2); // Convert to 2 decimal places

                        const existingBal = await db.currentBal.toCollection().first();
                        if (existingBal) {
                            await db.currentBal.update(existingBal.id, { balance: formattedBalance });
                            await db.transactionLog.delete(parseFloat(deleteID));
                            const checkDeleted = await db.transactionLog.get(parseFloat(deleteID));
                            if (!checkDeleted){
                                console.log(`${deleteID} was deleted`)
                            } else {
                                console.error(`Failed to delete ${deleteID}`)
                            }
                        } else {
                            await db.currentBal.add({ balance: formattedBalance });
                        }
                    } else {
                        console.error("Calculated newBalance isn't a number");
                    }
                } else {
                    console.error("Invalid balance or transaction amount");
                }
            }

            setDeleteID('')
        }
    }


    // Sorting transactions if some are deleted / some other reason they wouldn't be in order
    useEffect(() => {
        const sortTransactions = async () => {
            let previousID = null;

            if (transactions?.length) {
                for (let i = 0; i < transactions.length; i++) {
                    const transaction = transactions[i];
                    const currentID = transaction.id;

                    if (previousID !== null) {
                        const difference = currentID - previousID;

                        if (difference > 1) {
                            for (let o = 0; o < transactions.length; o++) {
                                if (transactions[o].id >= currentID) {
                                    const newID = transactions[o].id - (difference - 1);
                                    await db.transactionLog.update(transactions[o].id, { id: newID }); // update the db

                                    transactions[o].id = newID; // Update the list
                                    console.log(`Sorted: Changed ${transactions[o].id} → ${newID}`);
                                }
                            }
                        }
                    } else if (currentID !== 1) {
                        const firstDifference = currentID - 1;
                        const newID = transaction.id - firstDifference;
                        await db.transactionLog.update(transaction.id, { id: newID }); // update the db
                        transaction.id = newID; // Update the list
                    }

                    previousID = transaction.id;
                }
            }
        };

        sortTransactions();

    }, [transactions]);



    // Used to remove reverse balance made from deleting transactions
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

    //close dropdowns when clicked outside
    useEffect(() => {
        const clickOutsideDropdown = (e) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
                setCategoryDropDownToggle(false); // Close the dropdown if clicked outside
            }

        };

        document.addEventListener('mousedown', clickOutsideDropdown);

        return () => {

            document.removeEventListener('mousedown', clickOutsideDropdown);
        };
    }, [])

    useEffect(() => {
        const clickOutsideDropdown = (e) => {
            if (actionDropdownRef.current && !actionDropdownRef.current.contains(e.target)) {
                setActionDropDownToggle(false); // Close the dropdown if clicked outside
            }

        };

        document.addEventListener('mousedown', clickOutsideDropdown);

        return () => {

            document.removeEventListener('mousedown', clickOutsideDropdown);
        };
    }, [])




    return (
        <>
            <div
                className={`flex flex-col ml-3 mt-5 mb-5 mr-1 bg-gray-100 overflow-x-hidden overflow-y-auto drop-shadow rounded-xl h-[95%] w-[67%]}`}>
                {/* Scroll Area */}
                <div
                    className='flex flex-col m-5 bg-gray-100 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 rounded-xl h-[80%] w-[95%]'>
                    {/* Top row */}
                    <button onClick={filterControls} className='flex flex-row bg-white h-6 ml-3 mr-3 mt-3 mb-1 rounded w-[98%] font-bold shadow'>
                        <p className='ml-3 w-[55px] text-left'>ID #</p>
                        <p className='w-[150px] text-left'>Name</p>
                        <p className='w-[140px] text-left'>Category</p>
                        <p className='w-[100px] text-left'>Action</p>
                        <p className='w-[100px] text-left'> Amount</p>
                        <p className=''>Date</p>
                    </button>

                    {/* Filter Inputs */}
                    <button className={`flex flex-row bg-white h-auto ml-3 mr-3 mt-1 mb-1 ${!FilterOpen && 'hidden'} rounded w-[98%] font-bold shadow`}>
                        <input value={FilterID} onChange={(evN) => setFilterID(evN.target.value)} className='w-[55px] text-left h-[24px] border border-gray-300' placeholder="ID #" />
                        <input value={FilterName} onChange={(e) => setFilterName(e.target.value)} className='w-[150px] text-left h-[24px] border border-gray-300' placeholder="Name"/>

                        {/* Category dropdown */}
                        <div className={`relative flex flex-col`}>
                            <button  className='w-[140px] text-left h-[24px] pl-3 border border-gray-300 text-gray-500'  onClick={toggleCategoryDropDown}>{FilterCategory.charAt(0).toUpperCase() + FilterCategory.slice(1)}</button>

                            <div ref={categoryDropdownRef} className={`absolute left-[-40px] top-full mt-2 w-52 bg-white z-50 divide-y divide-gray-100 rounded-lg shadow-md transition-all duration-300 ${categoryDropDownToggle ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                            <ul className={`py-2 text-sm items-center text-center text-gray-700`}>
                                    <li>
                                        <button onClick={(e) => filterCategorySelect('entertainment')} className={`inline-block w-full py-2 hover:bg-gray-100`}>Entertainment</button>
                                    </li>
                                    <li>
                                        <button onClick={(e) => filterCategorySelect('food')}  className="inline-block w-full py-2 hover:bg-gray-100">Food</button>
                                    </li>
                                    <li>
                                        <button onClick={(e) => filterCategorySelect('shopping')} className="inline-block w-full py-2 hover:bg-gray-100">Shopping</button>
                                    </li>
                                    <li>
                                        <button onClick={(e) => filterCategorySelect('bills')} className="inline-block w-full py-2 hover:bg-gray-100">Bills</button>
                                    </li>
                                    <li>
                                        <button onClick={(e) => filterCategorySelect('work')}  className="inline-block w-full py-2 hover:bg-gray-100">Work</button>
                                    </li>
                                    <li>
                                        <button onClick={(e) => filterCategorySelect('other')}  className="inline-block w-full py-2 hover:bg-gray-100">Other</button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Action dropdown */}
                        <div className={`relative flex flex-col`}>
                            <button className='w-[100px] text-gray-500 pl-3 text-left h-[24px] border border-gray-300' onClick={toggleActionDropDown}>{FilterAction.charAt(0).toUpperCase() + FilterAction.slice(1)}</button>

                            <div ref={actionDropdownRef} className={`absolute left-[-50px] top-full mt-2 w-52 bg-white z-50 divide-y divide-gray-100 rounded-lg shadow-md transition-all duration-300 ${actionDropDownToggle ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
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

                        <input value={FilterAmount} type={'number'} className='w-[100px] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-left h-[24px] border border-gray-300' onChange={(evN) => setFilterAmount(evN.target.value)} placeholder="Amount" />
                        <input value={FilterDate} className='h-[24px] w-[175px] border border-gray-300' type={'date'} onChange={(evN) => setFilterDate(evN.target.value)} placeholder="Date" />
                    </button>

                    <div className='w-[98%]'>
                        <button onClick={clearFilter} className={`${!FilterOpen && 'hidden'} text-gray-700 active:bg-gray-300 bg-white border border-black float-right rounded-xl h-8 w-3/12 right-0 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center shadow-md`}>
                            Clear Filters
                        </button>
                    </div>



                    {/* Transactions Rows */}
                    <ul>
                        {[...(filteredTransactions ?? [])].reverse().map((transaction) => (
                            <li key={transaction.id} className='last:mb-3'>
                                <button type='button'
                                        className={`flex flex-row ${colorSwitch(transaction.id)} text-black h-6 ml-3 mr-3 w-[98%] mt-2 rounded font-bold shadow`}
                                        onClick={() => setupDetails(transaction.name, transaction.action, transaction.category, transaction.amount, transaction.date, transaction.id)}>
                                    <p className='ml-3 w-[55px] text-left'>{transaction.id}</p>
                                    <p className='w-[150px] text-left'>{shorten(transaction.name.charAt(0).toUpperCase() + transaction.name.slice(1), 15)}</p>
                                    <p className='w-[140px] text-left'>{transaction.category?.charAt(0).toUpperCase() + transaction.category?.slice(1)}</p>
                                    <p className='w-[100px] text-left'>{transaction.action.charAt(0).toUpperCase() + transaction.action.slice(1)}</p>
                                    <p className='w-[100px] text-left'>{transaction.action === 'withdraw' && `-$${shorten(transaction.amount, 6)}`} {transaction.action === 'deposit' && `+$${shorten(transaction.amount, 6)}`}</p>
                                    <p className='text-left'>{formatDate(transaction.date)}</p>
                                </button>
                            </li>
                        ))}
                    </ul>

                </div>
                {/* Delete input */}
                <div className={' flex flex-row '}>
                    <input type={'number'}
                           value={deleteID}
                           onChange={((evN) =>setDeleteID(evN.target.value))}
                           placeholder={'ID #'}
                           className={'text-gray-700 appearance-none ml-24  text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none rounded-lg shadow-md border-black h-11'}
                    />

                    {/* Delete Button */}
                    <button onClick={deleteTransactions} className="text-gray-700  bg-white mr-20 border border-black ml-auto rounded-xl h-11 w-5/12 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center shadow-md">
                        Delete Transaction
                    </button>
                    
                    {/* Confirmation for deletion */}
                    {DeleteConfirmation && (
                        <div className="absolute bg-gray-800 opacity-100 inset-0 z-50 flex justify-center items-center">
                            <div className="bg-white p-4 rounded shadow-lg">
                                <p>Are you sure you want to delete transaction #{deleteID}?</p>
                                <div className="flex mt-2">
                                    <button className="mr-2 text-red-500" onClick={() => {setDeleteConfirmation(false); }}>Cancel</button>
                                    <button className="ml-64 text-blue-500" onClick={deleteTransactions}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    )}


                </div>
            </div>

            {/*details*/}
            <div className='flex flex-col h-[95%] w-[30%] mt-5 ml-2 items-center justify-center'>
                <div className='flex flex-col bg-gray-100 mb-5 overflow-x-hidden shadow-md overflow-y-hidden rounded-xl h-[31%] w-full p-4'>
                    <h1 className='text-black font-bold w-full text-center'>Transaction Details</h1>
                    <p className='w-full text-left'>Transaction ID: #{TransId}</p>
                    <p className='w-full text-left'>Name of Transaction: {TransName.charAt(0).toUpperCase() + TransName.slice(1)}</p>
                    <p className='w-full text-left'>Category: {TransCategory?.charAt(0).toUpperCase() + TransCategory?.slice(1)}</p>
                    <p className='w-full text-left'>Action: {TransAction.charAt(0).toUpperCase() + TransAction.slice(1)}</p>
                    <p className='w-full text-left'>Amount: {TransAction === 'withdraw' && "-"}{TransAction === 'deposit' && "+"}${TransAmount}</p>
                    <p className='w-full text-left'>Date of Transaction: {TransDate !== '' && formatDate(TransDate)}</p>

                </div>

                {/* Add Transactions */}
                <AddTransactions />
            </div>
        </>
    )
        ;
}
