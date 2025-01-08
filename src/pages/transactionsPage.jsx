import React from "react";
import SideNavbar from "../components/sideNavbar.jsx";
import {HiOutlinePaperClip} from "react-icons/hi2";
import {TransWidget} from "../components/DBComponents/transTestWid.jsx";





export default function TransactionsPage() {




    return (
        <div className="flex overflow-x-hidden w-screen h-screen overflow-y-hidden bg-gray-100">
            <SideNavbar />
            {/* Main Container */}
            <div className="w-screen ml-[5.5rem] pt-[1.9rem]">
                {/* Title container */}
                <div className="text-black text-3xl font-normal flex mb-4 items-center space-x-10">
                    <h3 className="flex">My Transactions</h3>
                </div>
                {/* Filter container */}

                {/* Transactions scroll area*/}
                <div className=" bg-gray-800 text-3xl align-text-top font-normal flex mb-[-20px]  pb-[30px] mt-20 items-center w-11/12 h-14 rounded-lg ">
                    <p className='text-white ml-5 mt-2 text-[19px]'>My Transactions</p>
                </div>
                <div className='flex flex-col bg-white rounded-xl h-72 w-11/12'>

                </div>
            </div>
        </div>
    )}