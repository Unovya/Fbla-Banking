import React from 'react';
import {TransWidget} from "./DBComponents/transTestWid.jsx";


const Transactions = () => {
    return (
        <>
            <div
                className=" bg-violet-800 text-3xl flex flex-row align-text-top font-normal mb-[-20px]  pb-[30px] mt-9 items-center w-[95%] h-14 rounded-lg ">
                <p className='text-white ml-5 mt-2 text-[19px]'>My Transactions</p>
                <p className="text-white ml-44 mt-2 text-[19px]">Click on a Transaction to View its Details</p>
            </div>
            <div className='flex flex-row bg-white rounded-xl h-[85%] shadow w-[95%]'>
                <TransWidget />
            </div>
        </>
)};

export default Transactions;
