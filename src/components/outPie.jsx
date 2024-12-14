import {Pie} from 'react-chartjs-2'
import {Chart as ChartJS, Tooltip, Legend, ArcElement} from "chart.js";
import React from 'react'
ChartJS.register(Tooltip, Legend, ArcElement);

 const entertainmentArray = await db.transactionLogs.where('category').equals('entertainment').toArray();





export const PieChart = () =>{
    const options = {}
    const data = {
        labels: ['Entertainment', 'Food', 'Bills', 'Shopping'],
        datasets: [
            {
                label: 'money spent',
                data:[100, 50, 20],
                backgroundColor: [
                    "rgba(255,99,132,0.7)",
                    "rgba(54,162,235,0.7)",
                    "rgba(34,84,135,0.7)"
                ],
                hoverOffset: 4,
            }
        ]
    }
    return <Pie options={options} data={data} />
}