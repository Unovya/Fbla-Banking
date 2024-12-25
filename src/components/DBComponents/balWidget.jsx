import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../scripts/database-Stuff/db.js";
import React from "react";

export function BalWidget() {
    const Cbalance = useLiveQuery(() => db.currentBal.toArray());

    return (
        <ul>
            {Cbalance?.map((bal) => (
                <li key={bal.id} className='flex items-center text-center text-xl content-center'>
                    <p className='font-bold items-center text-center'>${bal.balance}</p>
                </li>
            ))}
        </ul>
    );
}