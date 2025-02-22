import React, { useState } from "react";
import { motion } from "framer-motion";

// Modal Component
export default function OnboardingModal({ isOpen, onClose, steps, headings }) {
    const [currentStep, setCurrentStep] = useState(0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white rounded-2xl shadow-lg p-6 w-[550px] border border-t-[25px] border-violet-800"
            >

                <button className="absolute top-4 right-4 text-red-500 text-2xl font-bold hover:text-red-700 transition duration-200 transform hover:scale-110" onClick={onClose}>
                    ✕
                </button>


                {/* Modal Body */}
                <h3 className="text-center text-xl font-semibold mt-4 mb-1">{headings[currentStep]}</h3>

                <div className="mt-4 text-black">
                    {steps[currentStep]} {/* Display current step */}
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    {/* Back Button*/}
                    {currentStep > 0 && (
                        <button
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 duration-300 rounded-lg"
                            onClick={() => setCurrentStep(currentStep - 1)}
                        >
                            Back
                        </button>
                    )}

                    {/* Next Button*/}
                    {currentStep < steps.length - 1 && (
                        <button
                            className="px-4 py-2 bg-violet-800 hover:bg-violet-950 duration-300 text-white rounded-lg ml-auto"
                            onClick={() => setCurrentStep(currentStep + 1)}
                        >
                            Next
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
