import React, {useEffect, useState} from "react";
import SideNavbar from "../components/sideNavbar.jsx";
import { HiOutlinePaperClip } from "react-icons/hi2";
import { BalWidget } from "../components/DBComponents/balWidget.jsx";
import { GrMoney } from "react-icons/gr";
import {DashCard} from "../components/DashCard.jsx";
import {OutPie} from "../components/graphs/outPie.jsx";
import {IncomeLine} from "../components/graphs/incomeLine.jsx";
import CSVDownloader from "../components/generateCSV.jsx";
import {MonthlyExpenses} from "../components/DBComponents/monthlyExpenses.jsx";
import {BudgetWidget} from "../components/DBComponents/budgetWidget.jsx";
import OnboardingModal from "../components/onboardingModal.jsx";






export default function HomePage() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if this is the first time running the app
    const isDashboardFirstRun = localStorage.getItem('isDashboardFirstRun') === null;

    useEffect(() => {
        if (isDashboardFirstRun) {
            console.log('First time running app, opening modal');
            setIsModalOpen(true); // Show modal on first run
            localStorage.setItem('isDashboardFirstRun', 'false');

        } else {
            console.log('App opened before, no onboarding needed.');
        }

        setIsLoading(false);
    }, [isDashboardFirstRun]);

    const modalHeadings = [
        'Welcome to the Dashboard',
        'Track Your Expenses',
        'Visualize Your information',
        'If you have any questions!'
    ];

    const modalData = [
        'Hello! Welcome to the dashboard. Here you can track your expenses, check your budget, and view your financial data in a clean and organized way.',
        'At the top of the dashboard, you can see your balance, expenses for the month, and your monthly budget. You can also download your financial data as a CSV file.',
        'Below the top cards, you can see two charts. The first chart shows your income over time, and the second chart shows your expenses in a pie chart. You can hover over the charts to see more information, and even click the legend to hide certain data.',
        'If you ever need a refresher, you can click the "?" button at the top right of the screen to view this onboarding modal again. Enjoy using the dashboard!'

    ]



    return (

        <div className="flex overflow-x-hidden overflow-y-hidden bg-gray-100">
            <SideNavbar />

            {isLoading ? (
                <div className="w-full flex justify-center items-center">Loading...</div>
            ) : (
                <>
                    <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} steps={modalData} headings={modalHeadings} />

                    <div className="w-full ml-12 pt-[1.9rem]">
                        {/* Dashboard and report Gen container */}
                        <div className="text-black text-3xl font-normal w-[calc(100%-170px)] flex mb-4 items-center justify-between">
                            <h3 className="flex">Dashboard</h3>

                            <div className="flex items-center gap-5">
                                <button className={`px-3 bg-white text-gray-700 border border-black rounded-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black hover:bg-violet-500 hover:text-white`} onClick={() => setIsModalOpen(!isModalOpen)}>
                                    ?
                                </button>
                                <CSVDownloader />
                            </div>
                        </div>
                        {/* End */}

                        {/* Top Cards container */}
                        <div className="flex flex-wrap justify-start space-x-5 gap-5">
                            {/* Top Cards */}
                            <div className="w-fit">
                                <DashCard title="Balance" content=<BalWidget/> borderColor="border-green-600" icon=<GrMoney className='text-3xl '/>/>
                            </div>
                            <div className="w-fit">
                                <DashCard title="Expenses This Month" content=<MonthlyExpenses/> borderColor="border-red-600" icon=<GrMoney className='text-3xl '/>/>
                            </div>
                            <div className="w-fit">
                                <DashCard title="Monthly Budget" content=<BudgetWidget /> borderColor="border-violet-600" icon=<GrMoney className='text-3xl '/>/>
                            </div>
                        </div>
                        {/* End */}

                        {/*Charts Container*/}
                        <div className='w-[calc(100%-150px)] h-[800px] flex'>
                            <div className=' items-center flex flex-row space-x-32 justify-between w-full mt-10 pr-20 mr-9'>
                                <div className='w-[600px] h-[500px]'>
                                    <IncomeLine />
                                </div>

                                <div className='w-[500px]  mb-44 h-[500px]'>
                                    <OutPie/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End */}
                </>
            )}

            {/* Main Container */}

        </div>
    );
}
