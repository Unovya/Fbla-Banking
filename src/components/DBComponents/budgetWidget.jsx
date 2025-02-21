
import {db} from "../../scripts/database-scripts/db.js";
import React, {useEffect} from "react";

export function BudgetWidget() {


    const [budget, setBudget] = React.useState('');

    useEffect(() => {
        const fetchData = async () => {

            const getBudget = await db.currentBudget.toCollection().last();
            if (getBudget === undefined) {
                setBudget('No budget set');
            } else {
                setBudget(getBudget.amount);
            }

        };

        fetchData();
    }, []);



    return (

        <div className='flex items-center text-center text-xl content-center'>
            <p className='font-bold items-center flex text-black text-center'>{budget}</p>
        </div>
    );
}