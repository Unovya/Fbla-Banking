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
import {MonthlyIncome} from "../components/DBComponents/monthlyIncome.jsx";
import OnboardingModal from "../components/onboardingModal.jsx";






export default function HomePage() {

    const [isModalOpen, setIsModalOpen] = useState(false);

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
    }, [isDashboardFirstRun]);





    return (
        <div className="flex overflow-x-hidden overflow-y-hidden bg-gray-100">
            <SideNavbar />
            {/* Main Container */}

            <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={"Welcome To the Dashboard! Here you can see your Balance, How much you have spent, and how much you've made!" +
                " If you click The 'Generate Report' Button at the top right, You can download a CSV File of all your transactions! If you ever need to see this again," +
                " you can find me also at the top right of your screen at the ? button!"} />

            <div className="w-full ml-12 pt-[1.9rem]">
                {/* Dashboard and report Gen container */}
                <div className="text-black text-3xl font-normal flex mb-4 items-center justify-between">
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
                        <DashCard title="Income This Month" content=<MonthlyIncome /> borderColor="border-violet-600" icon=<GrMoney className='text-3xl '/>/>
                    </div>
                </div>
                {/* End */}

                {/*Charts Container*/}
                <div className='w-full h-[800px] flex'>
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
        </div>
    );
}
