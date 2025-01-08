import React from "react";
import SideNavbar from "../components/sideNavbar.jsx";
import { HiOutlinePaperClip } from "react-icons/hi2";
import { BalWidget } from "../components/DBComponents/balWidget.jsx";
import { GrMoney } from "react-icons/gr";
import {DashCard} from "../components/DashCard.jsx";
import {OutPie} from "../components/graphs/outPie.jsx";


export default function HomePage() {
    return (
        <div className="flex overflow-x-hidden overflow-y-hidden bg-gray-100">
            <SideNavbar />
            {/* Main Container */}
            <div className="w-full ml-12 pt-[1.9rem]">
                {/* Dashboard and report Gen container */}
                <div className="text-black text-3xl font-normal flex mb-4 items-center justify-between">
                    <h3 className="flex">Dashboard</h3>
                    <button className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-base text-white font-semibold py-1 px-2 mr-4 mt-2 border border-gray-400 flex rounded-lg shadow items-center duration-100">
                        <HiOutlinePaperClip /> Generate Report
                    </button>
                </div>
                {/* End */}

                {/* Top Cards container */}
                <div className="flex flex-wrap justify-start space-x-5 gap-5">
                    {/* Top Cards */}
                    <div className="w-80 sm:w-64 md:w-72">
                        <DashCard title="Balance" content=<BalWidget/> borderColor="border-green-600" icon=<GrMoney className='text-3xl float-right'/>/>
                    </div>
                    <div className="w-80 sm:w-64 md:w-72">
                        <DashCard title="PlaceHolder" content="PlaceHolder" borderColor="border-violet-600" icon=<GrMoney className='text-3xl float-right'/>/>
                    </div>
                    <div className="w-80 sm:w-64 md:w-72">
                        <DashCard title="PlaceHolder 2" content="PlaceHolder 2" borderColor="border-red-600" icon=<GrMoney className='text-3xl float-right'/>/>
                    </div>
                    <div className="w-80 sm:w-64 md:w-72">
                        <DashCard title="PlaceHolder 3" content="PlaceHolder 3" borderColor="border-blue-600" icon=<GrMoney className='text-3xl float-right'/>/>
                    </div>
                </div>
                {/* End */}

                {/*Charts Container*/}
                <div className='w-full h-[500px] flex'>
                    <div className='ml-auto items-center justify-center mt-10 pr-20'>
                        <div className='w-[400px] h-[400px]'>
                            <OutPie/>
                        </div>
                    </div>
                </div>


            </div>
            {/* End */}
        </div>
    );
}
