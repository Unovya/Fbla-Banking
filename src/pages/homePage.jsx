import React from "react";
import SideNavbar from "../components/sideNavbar.jsx";
import { HiOutlinePaperClip } from "react-icons/hi2";
import { BalWidget } from "../scripts/database-Stuff/DBComponents/balWidget.jsx";
import { GrMoney } from "react-icons/gr";
import {InfoCard} from "../components/infoCard.jsx";
import {PieChart} from "../components/outPie.jsx";


export default function HomePage() {
    return (
        <div className="flex overflow-x-hidden bg-gray-100">
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
                    <div className="w-full sm:w-80 md:w-96">
                        <InfoCard title="Balance" content=<BalWidget/> borderColor="border-green-600" icon=<GrMoney className='text-3xl ml-44'/>/>
                    </div>
                    <div className="w-full sm:w-80 md:w-96">
                        <InfoCard title="PlaceHolder" content="PlaceHolder" borderColor="border-violet-600" icon=<GrMoney className='text-3xl ml-44'/>/>
                    </div>
                    <div className="w-full sm:w-80 md:w-96">
                        <InfoCard title="PlaceHolder 2" content="PlaceHolder 2" borderColor="border-red-600" icon=<GrMoney className='text-3xl ml-44'/>/>
                    </div>
                    <div className="w-full sm:w-80 md:w-96">
                        <InfoCard title="PlaceHolder 3" content="PlaceHolder 3" borderColor="border-blue-600" icon=<GrMoney className='text-3xl ml-44'/>/>
                    </div>
                </div>
                {/* End */}


            </div>
            {/* End */}
        </div>
    );
}
