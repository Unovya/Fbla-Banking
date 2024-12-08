import React from "react";
import SideNavbar from "../components/sideNavbar.jsx";
import { HiOutlinePaperClip } from "react-icons/hi2";
import {BalWidget} from "../scripts/database-Stuff/DBComponents/balWidget.jsx";
import {BalTest} from "../scripts/database-Stuff/DBComponents/balTest.jsx";
import {GrMoney} from "react-icons/gr";


export default function HomePage() {
    return (
        <div className="flex  bg-gray-100">
            <SideNavbar/>
            {/* Main Container*/}
            <div className='container pl-8 pt-[1.9rem]'>
                {/* Dashboard and report Gen container */}
                <div className="text-black text-3xl font-normal flex mb-4 items-center justify-between">
                    <h3 className='flex'>Dashboard</h3>
                    <button
                        className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-base text-white font-semibold py-1 px-2 mr-4 mt-2 border border-gray-400 flex rounded-lg shadow items-center duration-100">
                        <HiOutlinePaperClip/> Generate Report
                    </button>
                </div>
                {/* End */}

                {/* Balance Card */}
                <BalWidget />
                {/* End */}
            </div>
            {/* End */}

        </div>
    );
}