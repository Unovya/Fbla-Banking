import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Modal Component
export default function OnboardingModal({ isOpen, onClose, data }){
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white rounded-2xl shadow-lg p-6 w-[550px] border border-t-[25px] border-violet-800">


                {/* Modal Body */}
                <div className="mt-4 text-black">
                    {data}
                </div>
            </motion.div>
        </div>
    );
};