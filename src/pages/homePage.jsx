import React from "react";
import SideNavbar from "../components/sideNavbar.jsx";
import { HiOutlinePaperClip } from "react-icons/hi2";
import {BalWidget} from "../scripts/database-Stuff/DBComponents/balWidget.jsx";
import {GrMoney} from "react-icons/gr";



export default function HomePage() {
    return (
        <div className="flex  bg-gray-100">
            <SideNavbar/>
            {/* Main Container*/}
            <div className='container ml-12 pt-[1.9rem]'>
                {/* Dashboard and report Gen container */}
                <div className="text-black text-3xl font-normal flex mb-4 items-center justify-between">
                    <h3 className='flex'>Dashboard</h3>
                    <button
                        className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-base text-white font-semibold py-1 px-2 mr-4 mt-2 border border-gray-400 flex rounded-lg shadow items-center duration-100">
                        <HiOutlinePaperClip/> Generate Report
                    </button>
                </div>
                {/* End */}

                {/* Top Cards */}
                <div className='flex space-x-28'>
                    {/* Balance Card */}
                    <BalWidget/>
                    {/* Card 2 (Will Specify later */}
                    <div className="max-w-xs flex flex-col bg-white border border-t-4 border-t-green-600 shadow-sm rounded-xl mt-12">
                        <div className="p-4 md:p-5">
                            <h3 className="text-lg font-bold text-gray-800 ">PlaceHolder</h3>
                            <div className='text-center flex'>
                                <p className='font-bold items-center text-center'>PlaceHolder</p>
                                <GrMoney className='text-3xl ml-40'/>
                            </div>
                        </div>
                    </div>

                {/* Card 3 (Will Specify later */}
                    <div className="max-w-xs flex flex-col bg-white border border-t-4 border-t-green-600 shadow-sm rounded-xl mt-12">
                        <div className="p-4 md:p-5">
                            <h3 className="text-lg font-bold text-gray-800 ">PlaceHolder 2</h3>
                            <div className='text-center flex'>
                                <p className='font-bold items-center text-center'>PlaceHolder 2</p>
                                <GrMoney className='text-3xl ml-40'/>
                            </div>
                        </div>
                    </div>
                    {/* Card 4 (Will Specify later */}
                    <div className="max-w-xs flex flex-col bg-white border border-t-4 border-t-green-600 shadow-sm rounded-xl mt-12">
                        <div className="p-4 md:p-5">
                            <h3 className="text-lg font-bold text-gray-800 ">PlaceHolder 3</h3>
                            <div className='text-center flex'>
                                <p className='font-bold items-center text-center'>PlaceHolder 3</p>
                                <GrMoney className='text-3xl ml-40'/>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End */}


                {/* End */}
            </div>
            {/* End */}

        </div>
    );
}