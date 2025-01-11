import React from 'react';
import {TransWidget} from "./DBComponents/transTestWid.jsx";


const Transactions = () => {
    return (
        <>
            <div
                className=" bg-gray-800 text-3xl align-text-top font-normal flex mb-[-20px]  pb-[30px] mt-20 items-center w-11/12 h-14 rounded-lg ">
                <p className='text-white ml-5 mt-2 text-[19px]'>My Transactions</p>
            </div>
            <div className='flex flex-col bg-white rounded-xl h-96 shadow w-11/12'>
                <TransWidget />
            </div>
        </>
)
};

export default Transactions;
