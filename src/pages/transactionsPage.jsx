import React from "react";
import SideNavbar from "../components/sideNavbar.jsx";
import Transactions from "../components/transactions.jsx";






export default function TransactionsPage() {



    return (
        <div className="flex overflow-x-hidden w-screen h-screen overflow-y-hidden bg-gray-100">
            <SideNavbar />
            {/* Main Container */}
            <div className="w-screen ml-[2.5rem] pt-[1.9rem]">
                {/* Title container */}
                <div className="text-black text-3xl font-normal  grid grid-cols-2 mb-4 items-center">
                    <h3 className="flex">My Transactions</h3>

                    <div className="pr-10 w-fit">
                        {/*
                        <HelpButton
                            content={
                            "Welcome To Your Transactions! Here you can add, delete, and view your transactions! " +
                            "If you want to filter your Transactions all you have to do is press where it says 'ID # Name ...' Right above your transactions!" +
                            "You can also delete any transactions right below the transactions table! "
                        } />
                        */}
                    </div>
                </div>
                {/* Transactions area*/}
                <Transactions />
            </div>
        </div>
    )}