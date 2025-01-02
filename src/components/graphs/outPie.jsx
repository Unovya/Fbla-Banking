import {Doughnut} from 'react-chartjs-2'
import {Chart as ChartJS, Tooltip, Legend, ArcElement} from "chart.js";
import React, {useEffect, useState} from 'react'
import {db} from "../../scripts/database-Stuff/db.js";
ChartJS.register(Tooltip, Legend, ArcElement);

export const OutPie = () => {
    const [entertainmentAmount, setEntertainmentAmount] = useState(0);
    const [foodAmount, setFoodAmount] = useState(0);
    const [billsAmount, setBillsAmount] = useState(0);
    const [shoppingAmount, setShoppingAmount] = useState(0);

    // grab all the transaction data on page load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const entertainmentArray = await db.transactionLog.where({category: 'entertainment'}).and(data => data.action === 'withdraw').toArray();
                const foodArray = await db.transactionLog.where({category: 'food'}).and(data => data.action === 'withdraw').toArray();
                const billsArray = await db.transactionLog.where({category: 'bills'}).and(data => data.action === 'withdraw').toArray();
                const shoppingArray = await db.transactionLog.where({category: 'shopping'}).and(data => data.action === 'withdraw').toArray();

                // add the transactions together
                setEntertainmentAmount(entertainmentArray.reduce((cAmount, item) => cAmount + parseFloat(item.amount.toFixed(2)), 0));
                setFoodAmount(foodArray.reduce((cAmount, item) => cAmount + parseFloat(item.amount.toFixed(2)), 0));
                setBillsAmount(billsArray.reduce((cAmount, item) => cAmount + parseFloat(item.amount.toFixed(2)), 0));
                setShoppingAmount(shoppingArray.reduce((cAmount, item) => cAmount + parseFloat(item.amount.toFixed(2)), 0));
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, []);

    // Chart data
    const data = {
        labels: ['Entertainment', 'Food', 'Bills', 'Shopping'],
        datasets: [
            {
                label: 'Money Spent',
                data: [entertainmentAmount, foodAmount, billsAmount, shoppingAmount],
                backgroundColor: [
                    "rgba(255,99,132,0.7)",
                    "rgba(54,162,235,0.7)",
                    "rgba(34,84,135,0.7)",
                    "rgba(75,192,192,0.7)"
                ],
                hoverOffset: 4,
            }
        ]
    };

    const options = {};

    return (
        <div>
            <Doughnut options={options} data={data} />
        </div>
    );
};