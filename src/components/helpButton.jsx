import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function HelpButton({content, extraContent = null}) {
    const [isOpen, setIsOpen] = useState(false);
    const helpRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (helpRef.current && !helpRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex flex-col mt-5" ref={helpRef}>
            <button
                className="px-3 bg-white text-gray-700 border border-black rounded-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black hover:bg-violet-500 hover:text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                ?
            </button>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-3 bg-gray-800 text-white rounded-lg shadow-lg w-64 text-sm z-50"
                    >
                        {content}
                    </motion.div>
                    {extraContent}
                </>


            )}
        </div>
    );
}
