import React from "react";
import {Link} from "react-router-dom";
import SideNavbar from "../components/sideNavbar.jsx";
import {TransTest} from "../components/DBComponents/transTest.jsx";
import {TransWidget} from "../components/DBComponents/transTestWid.jsx";

export default function Xmple2() {
    return (
        <div className="flex bg-gray-100">
            <div className="left-0">
                <SideNavbar/>
            </div>
            <div
                className="grid h-screen items-center grid-col-1 text-2xl w-full text-center align justify-center bg-white">


                <div
                    className="block justify-center text-center p-6 w-80 h-40 items-center bg-black border border-gray-200 rounded-lg shadow hover:bg-darkGray dark:bg-grey-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <p className="mb-2 text-2xl font-bold tracking-tight text-white">2nd page</p>
                    <Link to="/" className="text-blue-500 hover:underline"> Go back to home</Link>
                </div>

                <div
                    className="block justify-center text-center p-6 w-80 h-auto items-center bg-black border border-gray-200 rounded-lg shadow hover:bg-darkGray dark:bg-grey-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <p className="mb-2 text-2xl font-bold tracking-tight text-white">Admin Transaction creator</p>
                    <TransTest/>
                </div>

                <div
                    className="block justify-center text-center p-6 w-80 h-auto items-center bg-black border border-gray-200 rounded-lg shadow hover:bg-darkGray dark:bg-grey-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <p className="mb-2 text-2xl font-bold tracking-tight text-white">Admin Transactions</p>
                    <TransWidget />
                </div>
            </div>
        </div>
    );
}