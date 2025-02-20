import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { db } from "../../scripts/database-Stuff/db.js";
import faker from 'faker';

export const IncomeLine = () => {

    const [filter, setFilter] = useState('month'); // day, month, or year
    const [workDataset, setWorkDataset] = useState([]);
    const [otherDataset, setOtherDataset] = useState([]);
    const [labels, setLabels] = useState([]);

    function getDateParts() {
        const localDate = new Date();
        const offset = localDate.getTimezoneOffset();
        const adjustedDate = new Date(localDate.getTime() - offset * 60000);
        return {
            day: String(adjustedDate.getDate()).padStart(2, '0'),
            month: String(adjustedDate.getMonth() + 1).padStart(2, '0'),
            year: String(adjustedDate.getFullYear())
        };
    }



    const weekLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        // Set labels based on filter
        if (filter === 'week') {
            setLabels(weekLabels);
        } else if (filter === 'month') {
            // 1 through current day
            const currentDay = parseInt(getDateParts().day, 10);
            const monthLabels = Array.from({ length: currentDay }, (_, i) => (i + 1).toString()); // Create labels for 1st to current day
            setLabels(monthLabels);
        } else if (filter === 'year') {
            // From January to the current month
            const currentMonth = parseInt(getDateParts().month, 10); // Get current month
            const yearLabels = monthsLabels.slice(0, currentMonth); // Get months up to the current month
            setLabels(yearLabels);
        }
    }, [filter]);



    useEffect(() => {
        async function fetchData() {
            // make sure time isn't messing up filtering
            function noTime(date) {
                return new Date(date.setHours(0, 0, 0, 0));
            }

            function filterData(transaction, part) {
                const transactionDate = new Date(transaction.date);
                const adjustedTransactionDate = new Date(transactionDate.getTime() - transactionDate.getTimezoneOffset() * 60000);
                const current = getDateParts();

                if (part === 'week') {
                    // Filter by week
                    const today = new Date();
                    const dayOfWeek = today.getDay();
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - dayOfWeek);
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    const noTimeStartOfWeek = noTime(startOfWeek);
                    const noTimeEndOfWeek = noTime(endOfWeek);
                    const strippedAdjustedTransactionDate = noTime(adjustedTransactionDate);

                    return strippedAdjustedTransactionDate >= noTimeStartOfWeek && strippedAdjustedTransactionDate <= noTimeEndOfWeek;
                } else if (part === 'month') {
                    // Filter by month
                    return adjustedTransactionDate.getMonth() + 1 === parseInt(current.month, 10) && adjustedTransactionDate.getFullYear() === parseInt(current.year, 10);
                } else if (part === 'year') {
                    // Filter by year
                    return adjustedTransactionDate.getFullYear() === parseInt(current.year, 10);
                }
                return false;
            }



            try {
                const workArray = await db.transactionLog
                    .where({ category: 'work' })
                    .and(data => data.action === 'deposit')
                    .toArray();



                // group data based on filter
                const workGroupedData = {};
                workArray
                    .filter(transaction => filterData(transaction, filter)) // Apply the filter
                    .forEach(transaction => {
                        const transactionDate = new Date(transaction.date);
                        let key;

                        if (filter === 'week') {
                            key = weekLabels[transactionDate.getDay()];
                        } else if (filter === 'month') {
                            key = String(transactionDate.getDate()+1); // Use day of month for month filter
                        } else if (filter === 'year') {
                            key = monthsLabels[transactionDate.getMonth()]; // Use month for year filter
                        }

                        if (!workGroupedData[key]) workGroupedData[key] = 0;
                        workGroupedData[key] += parseFloat(transaction.amount);
                    });

                console.log("Grouped Data:", workGroupedData);



                const otherArray = await db.transactionLog
                    .where({ category: 'other' })
                    .and(data => data.action === 'deposit')
                    .toArray();

                const otherGroupedData = {};
                otherArray
                    .filter(transaction => filterData(transaction, filter)) // Apply the filter
                    .forEach(transaction => {
                        const transactionDate = new Date(transaction.date);
                        let key;

                        if (filter === 'week') {
                            key = weekLabels[transactionDate.getDay()];
                        } else if (filter === 'month') {
                            key = String(transactionDate.getDate()+1); // Use day of month for month filter
                        } else if (filter === 'year') {
                            key = monthsLabels[transactionDate.getMonth()]; // Use month for year filter
                        }

                        if (!otherGroupedData[key]) otherGroupedData[key] = 0;
                        otherGroupedData[key] += parseFloat(transaction.amount);
                    });

                console.log("Grouped Data:", workGroupedData);


                // give grouped data labels
                const workDatasetValues = labels.map(label => workGroupedData[label] || 0);
                const otherDatasetValues = labels.map(label => otherGroupedData[label] || 0);

                // Update the datasets
                setWorkDataset(workDatasetValues);
                setOtherDataset(otherDatasetValues);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        if (labels.length > 0) {
            fetchData();
        }

    }, [labels, filter]);

    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: `Income Based on This ${filter.charAt(0).toUpperCase() + filter.slice(1)}`
            },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Work Income',
                data: workDataset,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Other Income',
                data: otherDataset,
                borderColor: 'rgb(23, 99, 132)',
                backgroundColor: 'rgba(23, 99, 132, 0.5)',
            }
        ],
    };

    return (
        <div className="flex flex-col relative justify-between">
            <div>
                <Line options={options} data={data} />
            </div>

            <h3 className="text-center text-xl font-semibold mt-4 mb-1">Filter By?</h3>
            <div className="flex justify-center space-x-4 mt-5 mb-4">
                <button onClick={() => setFilter('week')} className={`px-6 py-2 ${filter === 'week' ? 'bg-violet-800 text-white' : 'bg-white'} text-gray-700 border border-black rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black hover:bg-violet-500 hover:text-white`}>
                    This Week
                </button>

                <button onClick={() => setFilter('month')} className={`px-6 py-2 ${filter === 'month' ? 'bg-violet-800 text-white' : 'bg-white'} text-gray-700 border border-black rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black hover:bg-violet-500 hover:text-white`}>
                    This Month
                </button>

                <button onClick={() => setFilter('year')} className={`px-6 py-2 ${filter === 'year' ? 'bg-violet-800 text-white' : 'bg-white'} text-gray-700 border border-black rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black hover:bg-violet-500 hover:text-white`}>
                    This Year
                </button>
            </div>
        </div>
    );
};
