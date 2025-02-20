
import {db} from "../../scripts/database-Stuff/db.js";
import React, {useEffect} from "react";

export function MonthlyIncome() {


    const [monthlyAmount, setMonthlyAmount] = React.useState(0);

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

            function filterData(transaction, part) {
                const transactionDate = new Date(transaction.date);
                const offset = transactionDate.getTimezoneOffset();
                const adjustedTransactionDate = new Date(transactionDate.getTime() - offset * 60000);

                const current = getDateParts();

                if (part === 'month') {
                    return (
                        adjustedTransactionDate.getMonth() + 1 === parseInt(current.month, 10) &&
                        adjustedTransactionDate.getFullYear() === parseInt(current.year, 10)
                    );
                }
            }

            try {

                const expensesArray = await db.transactionLog
                    .where({ action: 'deposit' })
                    .and(data => filterData(data, 'month'))
                    .toArray();

                setMonthlyAmount(expensesArray.reduce((cAmount, item) => cAmount + parseFloat(item.amount), 0));

            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, []);



    return (

        <div className='flex items-center text-center text-xl content-center'>
            <p className='font-bold items-center flex text-green-500 text-center'>+${monthlyAmount}</p>
        </div>
    );
}