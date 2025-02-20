import React from 'react';
import {db} from "../scripts/database-scripts/db.js";
import {useLiveQuery} from "dexie-react-hooks";

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

const RecentTransactions = () => {

    const transactions = useLiveQuery(() => db.transactionLog.toArray(), [], []);


    return (
        <ul>
            {[...(transactions ?? [])].reverse().map((transaction) => (
                <li key={transaction.id} className='last:mb-3'>
                    {transaction.id <= 10 && (
                        <div className={`flex flex-row ${colorSwitch(transaction.id)} text-black h-6 ml-3 mr-3 w-[98%] mt-2 rounded font-bold shadow`}>
                            <p className='ml-3 w-[55px] text-left'>{transaction.id}</p>
                            <p className='w-[150px] text-left'>{transaction.name.charAt(0).toUpperCase() + transaction.name.slice(1)}</p>
                            <p className='w-[140px] text-left'>{transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</p>
                            <p className='w-[100px] text-left'>{transaction.action.charAt(0).toUpperCase() + transaction.action.slice(1)}</p>
                            <p className='w-[100px] text-left'>{transaction.action === 'withdraw' && `-$${shorten(transaction.amount, 6)}`} {transaction.action === 'deposit' && `+$${shorten(transaction.amount, 6)}`}</p>
                            <p className='text-left'>{formatDate(transaction.date)}</p>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default RecentTransactions;

// Made this so ryan can style later