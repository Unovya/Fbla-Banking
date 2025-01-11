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
    const [Transcategory, setTranscategory] = React.useState('');
    const [TransDate, setTransDate] = React.useState('');
    const [TransId, setTransId] = React.useState('');
    const [Popup, setOpenPopup] = React.useState(false);

    function setupPopup(name, action, category, date, id) {
        setTransId(id);
        setTransName(name);
        setTransDate(date);
        setTranscategory(category);
        setTransAction(action);
    }
    function openPopup(name, action, category, date, id){
        setupPopup(name, action, category, date, id);
        setOpenPopup(!Popup);

    }

    return (
        <>
            <div className='flex flex-col m-5 bg-gray-100 drop-shadow rounded-xl h-[90%] w-[69%]'>
                <div className='flex flex-row bg-white h-6 ml-3 mr-3 mt-3 mb-1 rounded font-bold shadow'>
                    <p className='ml-3 w-[55px] text-left'>ID #</p>
                    <p className='w-[150px] text-left'>Name</p>
                    <p className='w-[140px] text-left'>Category</p>
                    <p className='w-[100px] text-left'>Action</p>
                    <p className='w-[100px] text-left'> Amount</p>
                    <p className=''>Date</p>
                </div>


                <ul>
                    {[...(transactions ?? [])].reverse().map((transaction) => (
                        <li key={transaction.id} className='last:mb-3'>
                            <button type='button'
                                    className={`flex flex-row ${colorSwitch(transaction.id)} text-black h-6 ml-3 mr-3 mt-2 rounded font-bold shadow`} onClick={() => openPopup(transaction.name, transaction.action, transaction.category, transaction.date, transaction.id)}>
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
            {Popup && <div className='fixed bg-white/80 mt-10 top-[205px] left-0 bottom-0 right-0 w-2/6 h-2/6 mx-auto backdrop-blur rounded-xl'>
                    <div className='m-auto '>

                    </div>
                </div>}

</>
)
;
}
