import React from "react";

export function DashCard({ title, content, borderColor, icon }) {
    return (
        <div
            className={`w-full sm:w-80 md:w-96 flex flex-col bg-white border border-t-4 ${borderColor} shadow-sm rounded-xl mt-6`}>
            <div className="p-4 md:p-5">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <div className="text-center flex items-center justify-between">
                    <p className="font-bold">{content}</p>
                    {icon}
                </div>
            </div>
        </div>
    );
}