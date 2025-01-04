import React from "react";
import SideNavbar from "../components/sideNavbar.jsx";
import {HiOutlinePaperClip} from "react-icons/hi2";
import {TransWidget} from "../components/DBComponents/transTestWid.jsx";





export default function TransactionsPage() {

    const [filterOpen, setFilterOpen] = React.useState(false)



    return (
        <div className="flex overflow-x-hidden w-screen h-screen overflow-y-hidden bg-gray-100">
            <SideNavbar />
            {/* Main Container */}
            <div className="w-full ml-12 pt-[1.9rem]">
                {/* Title and add Filter container */}
                <div className="text-black ml-10 text-3xl font-normal flex mb-4 items-center space-x-10">
                    <h3 className="flex">Transactions</h3>
                    <button className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-base text-white font-semibold py-1 px-5 mr-4 mt-2 border border-gray-400 flex rounded-2xl shadow items-center duration-100" onClick={() => setFilterOpen(!filterOpen)}>
                         Add Filter
                    </button>
                </div>
                {/* Filter container */}
                {/* Add Actual Filter thing later*/}
                <div className={`text-black ml-10 text-lg ${!filterOpen && "hidden"} font-normal flex mb-4 items-center space-x-10`}>test</div>

                {/* End */}

                {/* Transactions scroll area*/}
                <div className='flex flex-col  rounded-xl w-fit'>
                    <div
                        className=' h-[90vh]  overflow-y-auto p-4 md:p-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300'>
                        <TransWidget />
                    </div>
                </div>
            </div>
        </div>
    )}