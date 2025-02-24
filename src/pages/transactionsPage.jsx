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

    const modalHeadings = [
        'Welcome To Your Transactions',
        'Filtering and Deleting Transactions',
        'Adding New Transactions',
        'Managing Your Budget',
        'Editing Transactions',
        'If you have any questions!'
    ]

    const modalData = [
        'Welcome to the transactions page! Here you can view all of your transactions in one place. You can see the id, date, name, amount, type, and category, of each transaction. You can also click on a transaction to view more details about it in the details area.',
        "In the transactions area, you can filter by pressing the white bar at the top where it says 'ID#    Name    Category....'. You can filter by any of the categories, and you can also delete any transaction by going beneath the transactions area, entering the ID of the transaction you wish to delete, and clicking the 'Delete' button.",
        "You can also add new transactions! When you open this page, youy should be able to add your transactions under the details area. You can also click the 'Add Transaction' button right below the details area! You can add a new transaction by entering the id, date, name, amount, type, and category of the transaction. Optionally, you can leave the date empty to use the today's date.",
        "Right next to the 'Add Transaction' button, you can see the 'Manage Budget' button. Clicking this button will take you to the budget page where you can manage your budget. You can set a budget, view it, or update it, and we'll let you know if you're at risk of passing it.",
        "Below the transactions and budgeting area, there's a 'Edit Transactions' button. Clicking this button will take you to the edit transactions page where you can edit any transaction you want. Just enter in the ID then enter the new data. After that, We'll handle the rest!",
        'If you ever need a refresher, you can click the "?" button at the top right of the screen to view this onboarding modal again. Happy budgeting!'
    ]




    return (
        <div className="flex overflow-x-hidden w-screen h-screen overflow-y-hidden bg-gray-100">
            <SideNavbar />
            {/* Main Container */}

            <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} steps={modalData} headings={modalHeadings} />

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
