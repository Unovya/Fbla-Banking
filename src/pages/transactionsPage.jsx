import React from "react";
import SideNavbar from "../components/sideNavbar.jsx";
import Transactions from "../components/transactions.jsx";





export default function TransactionsPage() {




    return (
        <div className="flex overflow-x-hidden w-screen h-screen overflow-y-hidden bg-gray-100">
            <SideNavbar />
            {/* Main Container */}
            <div className="w-screen ml-[5.5rem] pt-[1.9rem]">
                {/* Title container */}
                <div className="text-black text-3xl font-normal flex mb-4 items-center space-x-10">
                    <h3 className="flex">My Transactions</h3>
                </div>
                {/* Filter container */}

                {/* Transactions scroll area*/}
                <Transactions />
            </div>
        </div>
    )}