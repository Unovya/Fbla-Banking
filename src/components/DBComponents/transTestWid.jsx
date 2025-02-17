import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../scripts/database-Stuff/db.js";
import React, {useEffect, useRef, useState} from "react";
import AddTransactions from "./addTransactions.jsx";

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


export function TransWidget() {
    const transactions = useLiveQuery(() => db.transactionLog.toArray());

    const [TransAction, setTransAction] = React.useState('');
    const [TransName, setTransName] = React.useState('');
    const [TransCategory, setTransCategory] = React.useState('');
    const [TransDate, setTransDate] = React.useState('');
    const [TransId, setTransId] = React.useState('');
    const [TransAmount, setTransAmount] = React.useState(0);
    const [FilterOpen, setFilterOpen] = React.useState(false);






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
    const [FilterCategory, setFilterCategory] = React.useState('');
    const [FilterAction, setFilterAction] = React.useState('');
    const [FilterAmount, setFilterAmount] = React.useState('');
    const [FilterDate, setFilterDate] = React.useState('');
    const [filterErrorStatus, setFilterErrorStatus] = React.useState('');
    const [categoryDropDownToggle, setCategoryDropDownToggle] = useState(false);
    const [actionDropDownToggle, setActionDropDownToggle] = useState(false);
    const categoryDropdownRef = useRef(null);
    const actionDropdownRef = useRef(null);


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
        if (FilterAction !== 'deposit' && FilterAmount !== 'withdraw'){
            setFilterErrorStatus('You must select an action before a category')
        }
        else {
            setCategoryDropDownToggle(!categoryDropDownToggle);
            setFilterErrorStatus('')
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
                    <button onClick={filterControls} className='flex flex-row bg-white h-6 ml-3 mr-3 mt-3 mb-1 rounded w-[98%] font-bold shadow'>
                        <p className='ml-3 w-[55px] text-left'>ID #</p>
                        <p className='w-[150px] text-left'>Name</p>
                        <p className='w-[140px] text-left'>Category</p>
                        <p className='w-[100px] text-left'>Action</p>
                        <p className='w-[100px] text-left'> Amount</p>
                        <p className=''>Date</p>
                    </button>

                    <button className={`flex flex-row bg-white h-auto ml-3 mr-3 mt-1 mb-1 ${!FilterOpen && 'hidden'} rounded w-[98%] font-bold shadow`}>
                        <input value={FilterID} onChange={(evN) => setFilterID(evN.target.value)} className='w-[55px] text-left h-[24px] border border-gray-300' placeholder="ID #" />
                        <input value={FilterName} className='w-[150px] text-left h-[24px] border border-gray-300' placeholder="Name" />
                        <div className={`flex flex-col`}>
                            <button  className='w-[140px] text-left h-[24px] border border-gray-300 text-gray-500'  onClick={toggleCategoryDropDown}>Category</button>

                            <div ref={categoryDropdownRef} className={`absolute top-full mt-2 w-52 bg-white z-50 divide-y divide-gray-100 rounded-lg shadow-md ${categoryDropDownToggle ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'} transition-all duration-300`}>
                                <ul className={`py-2 text-sm items-center ${FilterAction === 'deposit' ? 'hidden' : ''} text-center text-gray-700`}>
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
                                        <button onClick={(e) => filterCategorySelect('other')}  className="inline-block w-full py-2 hover:bg-gray-100">Other</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={`flex flex-col`}>
                            <input value={FilterAction} className='w-[100px] text-left h-[24px] border border-gray-300' placeholder="Action" />

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

                        <input value={FilterAmount} className='w-[100px] text-left h-[24px] border border-gray-300' placeholder="Amount" />
                        <input value={FilterDate} className='h-[24px] w-[175px] border border-gray-300' placeholder="Date" />
                    </button>

                    <div className='w-[98%]'>
                        <button className={`${!FilterOpen && 'hidden'} text-gray-700 active:bg-gray-300 bg-white border border-black float-right rounded-xl h-8 w-3/12 right-0 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center shadow-md`}>
                            Submit Filter
                        </button>
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
            <div className='flex flex-col h-[95%] w-[30%] mt-5 ml-2 items-center justify-center'>
                <div className='flex flex-col bg-gray-100 mb-5 overflow-x-hidden shadow-md overflow-y-hidden rounded-xl h-[31%] w-full p-4'>
                    <h1 className='text-black font-bold w-full text-center'>Transaction Details</h1>
                    <p className='w-full text-left'>Transaction Id: #{TransId}</p>
                    <p className='w-full text-left'>Name of Transaction: {TransName.charAt(0).toUpperCase() + TransName.slice(1)}</p>
                    <p className='w-full text-left'>Category: {TransCategory.charAt(0).toUpperCase() + TransCategory.slice(1)}</p>
                    <p className='w-full text-left'>Action: {TransAction.charAt(0).toUpperCase() + TransAction.slice(1)}</p>
                    <p className='w-full text-left'>Amount: {TransAction === 'withdraw' && "-"}{TransAction === 'deposit' && "+"}${TransAmount}</p>
                    <p className='w-full text-left'>Date of Transaction: {TransDate.charAt(0).toUpperCase() + TransDate.slice(1)}</p>
            </div>

                {/* Add Transactions */}
                <AddTransactions />
            </div>
        </>
    )
        ;
}
