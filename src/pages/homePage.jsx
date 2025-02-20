import React from "react";
import SideNavbar from "../components/sideNavbar.jsx";
import { HiOutlinePaperClip } from "react-icons/hi2";
import { BalWidget } from "../components/DBComponents/balWidget.jsx";
import { GrMoney } from "react-icons/gr";
import {DashCard} from "../components/DashCard.jsx";
import {OutPie} from "../components/graphs/outPie.jsx";
import {IncomeLine} from "../components/graphs/incomeLine.jsx";
import CSVDownloader from "../components/generateCSV.jsx";
import HelpButton from "../components/helpButton.jsx";
import {MonthlyExpenses} from "../components/DBComponents/monthlyExpenses.jsx";
import {MonthlyIncome} from "../components/DBComponents/monthlyIncome.jsx";


export default function HomePage() {
    return (
        <div className="flex overflow-x-hidden overflow-y-hidden bg-gray-100">
            <SideNavbar />
            {/* Main Container */}
            <div className="w-full ml-12 pt-[1.9rem]">
                {/* Dashboard and report Gen container */}
                <div className="text-black text-3xl font-normal flex mb-4 items-center justify-between">
                    <h3 className="flex">Dashboard</h3>
                    <HelpButton content={'Test'}  />
                    <CSVDownloader />
                </div>
                {/* End */}

                {/* Top Cards container */}
                <div className="flex flex-wrap justify-start grid-cols-4 space-x-5 gap-5">
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
                    <div className="w-fit">
                        <DashCard title="PlaceHolder 3" content="PlaceHolder 3" borderColor="border-blue-600" icon=<GrMoney className='text-3xl '/>/>
                    </div>
                </div>
                {/* End */}

                {/*Charts Container*/}
                <div className='w-full h-[800px] flex'>
                    <div className=' items-center flex flex-row space-x-32 justify-between w-full mt-10 pr-20 mr-9'>
                        <div className='w-[600px] h-[500px]'>
                            <IncomeLine />
                        </div>

                        <div className='w-[400px]  mb-44 h-[400px]'>
                            <OutPie/>
                        </div>
                    </div>
                </div>


            </div>
            {/* End */}
        </div>
    );
}
