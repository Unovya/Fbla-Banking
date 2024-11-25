import React, { useState, useEffect } from 'react';

const TimeChecker = () => {
    const [time, setTime] = useState(''); // Make sure `time` is always a string

    useEffect(() => {
        const intervalId = setInterval(() => {
            const cTime = new Date().toLocaleTimeString(); // Get current time
            setTime(cTime.toString()); // Set time as a string
        }, 1000);


        // Clean up on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, []); // Empty dependency array to run the effect only once

    return <p className="text-white">{time}</p>;
};

export default TimeChecker;
