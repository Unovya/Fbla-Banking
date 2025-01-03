import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../scripts/database-Stuff/db.js";
import React from "react";

// These are all placeholder colors
function transColorPicker(category){
    switch (category){
        case 'food': return 'border-yellow-400'
        case 'work': return 'border-blue-700'
        case 'bills': return 'border-violet-600'
        case 'entertainment': return 'border-red-700'
        case 'shopping': return 'border-rose-500'
        default: return "border-black"
    }
}


export function TransWidget() {
    const transactions = useLiveQuery(() => db.transactionLog.toArray());
    return (
                <ul className='space-x-4  flex mt-6 flex-wrap'>
                    {transactions?.reverse().map((transaction) => (
                        <li key={transaction.id} className='flex  items-center w-fit text-center min-h-fit text-xl content-center m-4 first:space-x-0 first:space-y-0'>
                            <div className={`w-full m-0 sm:w-80 md:w-96 flex flex-col bg-white border ${transColorPicker(transaction.category)} border-t-4 shadow-sm rounded-xl`}>
                                <div className='p-0 md:p-1'>
                                    <p className='font-bold items-center text-black text-center'>
                                        name: {transaction.name}
                                        <br/> action: {transaction.action}
                                        <br/> amount: ${transaction.amount}
                                        <br/> category: {transaction.category}
                                        <br/> date: {transaction.date}
                                        <br/> time: {transaction.time}
                                    </p>
                                </div>
                            </div>
                        </li>
                        ))}
                </ul>
);
}