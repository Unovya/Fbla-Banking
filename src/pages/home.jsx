import React from "react";
import TimeChecker from '../components/timeChecker.jsx';
import {Link} from "react-router-dom";

export default function Home() {
    return (
        <div className="grid h-screen/2 items-center grid-col-1 text-2xl w-full text-center align justify-center bg-white">
            <div className="grid h-auto items-center grid-col-1 text-2xl w-full text-center align justify-center bg-white">
                <div className="block justify-center text-center p-6 w-80 h-40 items-center bg-black border border-gray-200 rounded-lg shadow hover:bg-darkGray dark:bg-grey-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">Basic example of page
                        switching</h5>
                    <Link to="./app2" className="text-blue-500 hover:underline"> Go to page 2</Link>
                </div>
            </div>
            <line className="bg-white"/>
            <div
                className="block justify-center text-center p-6 w-80 h-40 items-center bg-black border border-gray-200 rounded-lg shadow hover:bg-darkGray dark:bg-grey-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-white ">Basic example of components</h5>
                <p id="timeTracker" className="text-lg font-bold tracking-tight text-white">Time update</p>
                <TimeChecker />

            </div>
        </div>
    );
}