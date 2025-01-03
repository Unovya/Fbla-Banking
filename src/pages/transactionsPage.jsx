import React from "react";
import SideNavbar from "../components/sideNavbar.jsx";
import {HiOutlinePaperClip} from "react-icons/hi2";
import {TransWidget} from "../components/DBComponents/transTestWid.jsx";

export default function TransactionsPage() {
    return (
        <div className="flex overflow-x-hidden w-screen h-screen overflow-y-hidden bg-gray-100">
            <SideNavbar />
            {/* Main Container */}
            <div className="w-full ml-12 pt-[1.9rem]">
                {/* Dashboard and report Gen container */}
                <div className="text-black bg-white text-3xl font-normal flex mb-4 items-center justify-between">
                    <h3 className="flex">Transactions</h3>
                </div>
                {/* End */}
                {/* Transactions scroll area*/}
                <div className='flex flex-col  rounded-xl w-fit'>
                    <div className=' h-[90vh]  overflow-y-auto p-4 md:p-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300'>
                        <TransWidget />
                    </div>
                </div>
            </div>
        </div>
    )}