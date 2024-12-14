import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db.js";
import React from "react";

export function TransWidget() {
    const transactions = useLiveQuery(() => db.transactionLog.toArray());

    return (
        <ul className='space-y-9'>
            {transactions?.map((transaction) => (
                <li key={transaction.id} className='flex items-center text-center text-xl content-center'>
                    <p className='font-bold items-center text-white text-center'>name: {transaction.name}
                        <br/> action: {transaction.action}
                        <br/> amount: ${transaction.amount}
                        <br/> category: {transaction.category}
                        <br/> date: {transaction.date}
                        <br/> time: {transaction.time}</p>
                </li>
            ))}
        </ul>
    );
}