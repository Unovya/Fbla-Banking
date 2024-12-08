import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db.js";
import React from "react";
import { GrMoney } from "react-icons/gr";

export function BalWidget(){
    const Cbalance = useLiveQuery(()=> db.currentBal.toArray());

    return (
        <div className="max-w-xs flex flex-col bg-white border border-t-4 border-t-green-600 shadow-sm rounded-xl mt-12">
            <div className="p-4 md:p-5">
                <h3 className="text-lg font-bold text-gray-800 ">Balance</h3>
                <div className='text-center'>
                    <ul>
                        {Cbalance?.map((bal) => (
                            <li key={bal.id} className='flex items-center text-center text-xl content-center'>
                                <p className='font-bold items-center text-center'>${bal.balance}</p> <GrMoney className='text-3xl ml-44'/>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
}