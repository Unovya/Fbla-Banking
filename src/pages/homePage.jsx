import React from "react";
import SideNavbar from "../components/sideNavbar.jsx";



export default function HomePage() {
    return (
        <div className="flex  bg-gray-100">
            <SideNavbar/>
            <div className='container pl-8 pt-[1.9rem]'>
                <div className="text-black text-3xl font-normal flex mb-4 items-center justify-between">
                    <h3>Dashboard</h3>
                </div>
            </div>


        </div>
    );
}