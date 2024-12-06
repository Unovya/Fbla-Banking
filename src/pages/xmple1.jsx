import React from "react";
import TimeChecker from '../components/timeChecker.jsx';
import {Link} from "react-router-dom";
import Twline from "../components/line.jsx";
import SideNavbar from "../components/sideNavbar.jsx";


export default function Xmple1() {
    return (
        <>
            <div className="left-0 fixed">
                <SideNavbar/>
            </div>
            <div className="grid h-screen/2 items-center grid-col-1 text-2xl w-full text-center align justify-center bg-white">

                <div
                    className="grid h-auto pt-10 items-center grid-col-1 text-2xl w-full text-center align justify-center bg-white">
                    <div
                        className="block justify-center text-center p-6 w-80 h-40 items-center bg-black border border-gray-200 rounded-lg shadow hover:bg-darkGray ">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">Basic example of page
                            switching</h5>
                        <Link to="/example2" className="text-blue-500 hover:underline"> Go to page 2</Link>
                    </div>
                </div>
                <Twline/>
                <div
                    className="block justify-center text-center p-6 w-80 h-40 items-center bg-black border border-gray-200 rounded-lg shadow hover:bg-darkGray ">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white ">Basic example of components</h5>
                    <p id="timeTracker" className="text-lg font-bold tracking-tight text-white">Time update</p>
                    <TimeChecker/>
                </div>
            </div>
            </>
    );
}