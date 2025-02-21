import React from "react";
import SideNavbar from "../components/sideNavbar.jsx";
import Transactions from "../components/transactions.jsx";
import { useState, useEffect } from "react";
import OnboardingModal from "../components/onboardingModal.jsx";





export default function TransactionsPage() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Check if this is the first time running the app
    const isTransactionsFirstRun = localStorage.getItem('isTransactionsFirstRun') === null;

    useEffect(() => {
        if (isTransactionsFirstRun) {
            console.log('First time running Transactions, opening modal');
            setIsModalOpen(true); // Show modal on first run
            localStorage.setItem('isTransactionsFirstRun', 'false');

        } else {
            console.log('Transactions opened before, no onboarding needed.');
        }
    }, [isTransactionsFirstRun]);

    return (
        <div className="flex overflow-x-hidden w-screen h-screen overflow-y-hidden bg-gray-100">
            <SideNavbar />
            {/* Main Container */}

            <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={"Welcome To Your Transactions! Here you can add, delete, and view your transactions! " +
                "If you want to filter your Transactions all you have to do is press where it says 'ID # Name ...' Right above your transactions and then enter your filters! " +
                "You can also delete any transactions right below the transactions table. If you wish to see a transaction in better detail, " +
                "then you can click it and It'll popup in your 'Transaction Details'! " +
                "If you ever want to see me again, You can find me at the top Right in the '?' Button"} />

            <div className="w-screen ml-[2.5rem] pt-[1.9rem]">
                {/* Title container */}
                <div className="text-black text-3xl font-normal flex flex-row w-[calc(100%-170px)] justify-between mb-4 items-center">
                    <h3 className="flex">My Transactions</h3>

                    <button className={`px-3 bg-white text-gray-700 border border-black rounded-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black hover:bg-violet-500 hover:text-white`} onClick={() => setIsModalOpen(!isModalOpen)}>
                        ?
                    </button>
                </div>
                {/* Transactions area*/}
                <Transactions />
            </div>
        </div>
    )}