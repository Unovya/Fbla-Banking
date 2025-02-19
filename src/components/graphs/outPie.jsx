import {Doughnut} from 'react-chartjs-2'
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import React, {useEffect, useState} from 'react'
import {db} from "../../scripts/database-Stuff/db.js";


ChartJS.register(Tooltip, Legend, ArcElement);

export const OutPie = () => {
    const [entertainmentAmount, setEntertainmentAmount] = useState(0);
    const [foodAmount, setFoodAmount] = useState(0);
    const [billsAmount, setBillsAmount] = useState(0);
    const [shoppingAmount, setShoppingAmount] = useState(0);
    const [otherAmount, setOtherAmount] = useState(0);
    const [filter, setFilter] = useState('month'); // 'day', 'month', or 'year'


    // grab all the transaction data on page load
    useEffect(() => {
        const fetchData = async () => {
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

            function noTime(date) {
                return new Date(date.setHours(0, 0, 0, 0));
            }

            function filterData(transaction, part) {
                const transactionDate = new Date(transaction.date);
                const offset = transactionDate.getTimezoneOffset();
                const adjustedTransactionDate = new Date(transactionDate.getTime() - offset * 60000);

                const current = getDateParts();

                if (part === 'week') {
                    // Get start and end of the current week (assuming week starts on Monday)
                    const today = new Date();
                    const todayOffset = today.getTimezoneOffset();
                    const adjustedToday = new Date(today.getTime() - todayOffset * 60000);

                    const dayOfWeek = adjustedToday.getDay(); // 0 (Sunday) to 6 (Saturday)
                    const startOfWeek = new Date(adjustedToday);
                    startOfWeek.setDate(adjustedToday.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Set to Monday

                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Sunday

                    // Strip time from start and end of the week
                    const noTimeStartOfWeek = noTime(startOfWeek);
                    const noTimeEndOfWeek = noTime(endOfWeek);
                    const strippedAdjustedTransactionDate = noTime(adjustedTransactionDate);

                    return strippedAdjustedTransactionDate >= noTimeStartOfWeek && strippedAdjustedTransactionDate <= noTimeEndOfWeek;
                } else if (part === 'month') {
                    return (
                        adjustedTransactionDate.getMonth() + 1 === parseInt(current.month, 10) &&
                        adjustedTransactionDate.getFullYear() === parseInt(current.year, 10)
                    );
                } else if (part === 'year') {
                    return adjustedTransactionDate.getFullYear() === parseInt(current.year, 10);
                }
                return false;
            }

            try {
                const entertainmentArray = await db.transactionLog
                    .where({ category: 'entertainment' })
                    .and(data => data.action === 'withdraw' && filterData(data, filter))
                    .toArray();

                const foodArray = await db.transactionLog
                    .where({ category: 'food' })
                    .and(data => data.action === 'withdraw' && filterData(data, filter))
                    .toArray();

                const billsArray = await db.transactionLog
                    .where({ category: 'bills' })
                    .and(data => data.action === 'withdraw' && filterData(data, filter))
                    .toArray();

                const shoppingArray = await db.transactionLog
                    .where({ category: 'shopping' })
                    .and(data => data.action === 'withdraw' && filterData(data, filter))
                    .toArray();

                const otherArray = await db.transactionLog
                    .where({ category: 'other' })
                    .and(data => data.action === 'withdraw' && filterData(data, filter))
                    .toArray();

                setEntertainmentAmount(entertainmentArray.reduce((cAmount, item) => cAmount + parseFloat(item.amount), 0));
                setFoodAmount(foodArray.reduce((cAmount, item) => cAmount + parseFloat(item.amount), 0));
                setBillsAmount(billsArray.reduce((cAmount, item) => cAmount + parseFloat(item.amount), 0));
                setShoppingAmount(shoppingArray.reduce((cAmount, item) => cAmount + parseFloat(item.amount), 0));
                setOtherAmount(otherArray.reduce((cAmount, item) => cAmount + parseFloat(item.amount), 0));

            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, [filter]);


    // Chart data
    const data = {
        labels: ['Entertainment', 'Food', 'Bills', 'Shopping', 'other'],
        datasets: [
            {
                label: 'Money Spent',
                data: [entertainmentAmount, foodAmount, billsAmount, shoppingAmount, otherAmount],
                backgroundColor: [
                    "rgba(255,99,132,0.7)",
                    "rgba(54,162,235,0.7)",
                    "rgba(34,84,135,0.7)",
                    "rgba(75,192,192,0.7)",
                    "rgba(24,32,175,0.7)"
                ],
                hoverOffset: 4,
            }
        ]
    };

    const options = {};

    return (
        <div className={`flex flex-col relative justify-between`}>
            <div className={``}>
                <Doughnut options={options} data={data} />
            </div>

            <div className="flex space-x-4 mt-5 absolute top-[100%] left-[18%] mb-4">
                <button onClick={() => setFilter('week')} className={`px-4 py-2 ${filter === 'week' ? 'bg-violet-800 text-white ' : 'bg-white'} text-gray-700  border border-black rounded-xl h-11 w-11/12 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-violet-500 hover:text-white transition duration-200 flex items-center justify-center shadow-md`}>Week</button>
                <button onClick={() => setFilter('month')} className={`px-4 py-2 ${filter === 'month' ? 'bg-violet-800 text-white ' : 'bg-white'} text-gray-700  border border-black rounded-xl h-11 w-11/12 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-violet-500 hover:text-white transition duration-200 flex items-center justify-center shadow-md`}>Month</button>
                <button onClick={() => setFilter('year')} className={`px-4 py-2 ${filter === 'year' ? 'bg-violet-800 text-white ' : 'bg-white'} text-gray-700  border border-black rounded-xl h-11 w-11/12 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-violet-500 hover:text-white transition duration-200 flex items-center justify-center shadow-md`}>Year</button>
            </div>
        </div>
    );
};
