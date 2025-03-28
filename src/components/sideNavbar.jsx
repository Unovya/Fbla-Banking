import React from "react";
import {BsArrowLeftShort, BsBezier2, BsBoxSeam, BsBracesAsterisk} from "react-icons/bs"
import { TbAlignBoxLeftStretch } from "react-icons/tb";
import {RiDashboardFill} from "react-icons/ri";
import {Link} from "react-router-dom";

const SideNavbar = () => {
    //Define Colors
    const BGColor = "bg-violet-800"
    // stop

    const [open, setOpen] = React.useState(true);
    const Menus = [
        {title: "Dashboard", icon: <RiDashboardFill />, link: "/"},
        {title: "Transactions", icon: <TbAlignBoxLeftStretch />, link: "/transactionPg"},

        // {title: "Example1", icon: <BsBoxSeam />, link: "/example1", spacing: true},
        // {title: "Example2", icon: <BsBracesAsterisk />, link: "/example2"},
    ]

    return (
        //Make the Side Box
        <div className={`${BGColor} h-screen p-5 pt-8 ${open ? "w-52" : "w-20"  } duration-300 w-1/6 left-0 relative`}>
            <BsArrowLeftShort className={`bg-white text-gray-800 text-3xl rounded-full absolute -right-3 top-9 border border-gray-800 cursor-pointer hover:bg-gray-300 duration-300 ${open && "rotate-180"}`} onClick={() => setOpen(!open)} />

            <div className={"inline-flex"}>
                <Link to="/">
                    <BsBezier2 className={`${BGColor} text-white text-4xl cursor-pointer block float-left ${open && "rotate-[360deg] duration-700"} ${!open && "rotate-[-360deg] duration-700"}`} />
                </Link>
                <h1 className={` origin-left font-medium text-2xl text-white duration-300 ${!open && "scale-0"} `}>SpendWise</h1>
            </div>

            <ul className="pt-2">
                {Menus.map((menu, index) => (
                    <Link key={index} to={menu.link}>
                        <>
                            <li className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md mt-2 ${menu.spacing ? "mt-9" : "mt-2"}`} >
                                <span className="text-2xl block float-left"> {menu.icon} </span>
                                <span className={`text-base font-medium flex-1 duration-200 ${!open && "hidden"}`}>{menu.title}</span>
                            </li>
                        </>
                    </Link>
                ))}
            </ul>
        </div>
    );
}

export default SideNavbar;
