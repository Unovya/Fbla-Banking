import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../scripts/database-Stuff/db.js";
import React from "react";
import {useEffect} from "react";

function colorSwitch(num) {
    if (num % 2 === 0) return "bg-gray-200";
    else return "bg-white";
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
    const [Popup, setOpenPopup] = React.useState(false);

    function setupPopup(name, action, category, amount, date, id) {
        setTransId(id);
        setTransName(name);
        setTransDate(date);
        setTransCategory(category);
        setTransAction(action);
        setTransAmount(amount);
        console.log(id)
    }

    function openPopup(name, action, category, amount, date, id){
        setupPopup(name, action, category, amount, date, id);
        setOpenPopup(!Popup);
    }

    const closePopup = () => {
        setOpenPopup(false)
    }



    return (
        <> {/* Make it a row*/}
            <div className='flex flex-row'>
                {/* Blurring div and gray area */}
                <div className={`flex flex-col ml-5 mt-5 mb-5 mr-1 bg-gray-100 overflow-x-hidden overflow-y-auto drop-shadow rounded-xl h-[95%] w-[67%] ${Popup ? 'backdrop-blur-sm' : ''}`}>
                    {/* Scroll Area */}
                    <div className='flex flex-col m-5 bg-gray-100 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 rounded-xl h-[90%] w-[95%]'>
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
                                            className={`flex flex-row ${colorSwitch(transaction.id)} text-black h-6 ml-3 mr-3 w-[98%] mt-2 rounded font-bold shadow`} onClick={() => openPopup(transaction.name, transaction.action, transaction.category, transaction.amount, transaction.date, transaction.id)}>
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
            </div>
            {Popup && <div className='fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm' onClick={closePopup}>
                <div
                    className={`fixed bg-gray-200 mt-10 top-[205px] left-0 bottom-0  right-0 w-[30%] justify-center items-center h-fit mx-auto backdrop-blur rounded-xl`} onClick={(e) => e.stopPropagation()}>
                    <div className='m-auto text-2xl ml-auto mr-auto w-fit font-semibold'>
                        <div className=''>
                            <hr className="h-2 my-1 bg-white border w-full rounded"/>
                            <button
                                className='float-right text-red-700 font-medium justify-center items-center text-center'
                                onClick={() => closePopup()}>X
                            </button>
                            <p className='font-bold justify-center items-center text-center'>#{TransId}</p>
                        </div>
                        <p className=''>Name of Transaction: {TransName}</p>
                        <p>Category: {TransCategory}</p>
                        <p>Action: {TransAction}</p>
                        <p>Amount: {TransAction === 'withdraw' && "-"}{TransAction === 'deposit' && "+"}${TransAmount}</p>
                        <p>Date of Transaction: {TransDate}</p>
                        <hr className="h-2 my-1 bg-white border w-full rounded"/>
                    </div>
                </div>
            </div>
            }

        </>
    )
        ;
}
