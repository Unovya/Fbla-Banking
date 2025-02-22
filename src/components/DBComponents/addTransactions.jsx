import React, {useEffect, useRef, useState} from 'react';
import {db} from "../../scripts/database-scripts/db";
import {useLiveQuery} from "dexie-react-hooks";
import {motion} from "framer-motion";

const AddTransactions = ({ defaultBal } = { defaultBal: 0 }) => {
    const transactions = useLiveQuery(() => db.transactionLog.toArray(), [], []);

    const [transOrBudgetOrEdit, setTransOrBudgetOrEdit] = useState('transactions');
    const [budget, setBudget] = useState(0);
    const [inputBudget, setInputBudget] = useState('');
    const [budgetStatus, setBudgetStatus] = useState('');
    const [managingBudget, setManagingBudget] = useState(true);
    const [spentThisMonth, setSpentThisMonth] = useState(0);
    const [creatingBudget, setCreatingBudget] = useState(false);
    const [budgetErrorStatus, setBudgetErrorStatus] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [balance, setBal] = useState(defaultBal); // Current balance
    const [inputBal, setInputBal] = useState(""); // Input value for adding (string so we don't get an error with the input)
    const [inputName, setInputName] = useState("");
    const [inputAction, setInputAction] = useState("Choose an Action"); // Deposit or withdraw
    const [inputCategory, setInputCategory] = useState("Choose a Category"); // Category for the transaction
    const [categoryDropDownToggle, setCategoryDropDownToggle] = useState(false);
    const [actionDropDownToggle, setActionDropDownToggle] = useState(false);
    const [transErrorStatus, setTransErrorStatus] = useState('')
    const categoryDropdownRef = useRef(null);
    const actionDropdownRef = useRef(null);
    const [inputDate, setInputDate] = useState(''); // Date of transaction
    const [budgetRerender, setBudgetRerender] = useState(false);
    const [overBudgetModal, setOverBudgetModal] = useState(false);
    const [inputID, setInputID] = useState('')
    const [editing, setEditing] = useState(false)

    const toggleCategoryDropDown = () =>{
        if (inputAction !== 'deposit' && inputAction !== 'withdraw'){
            setTransErrorStatus('You must select an action before a category')
        }
        else {
            setCategoryDropDownToggle(!categoryDropDownToggle);
            setTransErrorStatus('')
        }

    }
    const toggleActionDropDown = () => setActionDropDownToggle(!actionDropDownToggle);

    //click outside category dropdown
    useEffect(() => {
        const clickOutsideDropdown = (e) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
                setCategoryDropDownToggle(false); // Close the dropdown if clicked outside
            }

        };
        // listen for clicks
        document.addEventListener('mousedown', clickOutsideDropdown);

        return () => {
            // stop listening for clicks
            document.removeEventListener('mousedown', clickOutsideDropdown);
        };
    }, [])

    //click outside action dropdown
    useEffect(() => {
        const clickOutsideDropdown = (e) => {
            if (actionDropdownRef.current && !actionDropdownRef.current.contains(e.target)) {
                setActionDropDownToggle(false); // Close the dropdown if clicked outside
            }

        };
        // listen for clicks
        document.addEventListener('mousedown', clickOutsideDropdown);

        return () => {
            // stop listening for clicks
            document.removeEventListener('mousedown', clickOutsideDropdown);
        };
    }, [])

    const categorySelect = (category) =>{
        setInputCategory(category);
        setCategoryDropDownToggle(false);

    }
    const actionSelect = (action) =>{
        setInputAction(action);
        setInputCategory("Choose a Category");
        setActionDropDownToggle(false);

    }


    function clearFields(){
        setInputBal("");
        setInputName("");
        setInputAction("Choose an Action");
        setInputCategory("Choose a Category");
        setTransErrorStatus('')
        console.log('nun atm'); // Change to check values

    }

    // Budget management

    async function manageBudget(){
        setBudgetRerender(!budgetRerender);

        if (creatingBudget){
            if (inputBudget === ''){
                setBudgetErrorStatus('Please enter a budget amount');
                return;
            }

            if (isNaN(parseFloat(inputBudget))){
                setBudgetErrorStatus('Budget must be a number');
                return;
            }

            if (parseFloat(inputBudget) < spentThisMonth){
                setBudgetErrorStatus('You have already bypassed this budget!');
                return;
            }

            if (parseFloat(inputBudget) < 0){
                setBudgetErrorStatus('Budget must be a positive number');
                return;
            }

            try {
                const existingBudget = await db.currentBudget.toCollection().first();
                if (!existingBudget) {
                    await db.currentBudget.add({ amount: parseFloat(inputBudget).toFixed(2) });
                } else {
                    console.error("Budget already exists");
                }

                setBudgetStatus(`Your current budget is $${inputBudget}`);
                setCreatingBudget(false);
            } catch (error) { console.log("Error managing budget:", error); }


            setBudgetErrorStatus('')
            setCreatingBudget(false);
            return;
        }else if (managingBudget){
            console.log('managing budget')
            if (inputBudget === ''){
                setBudgetErrorStatus('Please enter a budget amount');
                return;
            }

            if (isNaN(parseFloat(inputBudget))){
                setBudgetErrorStatus('Budget must be a number');
                return;
            }

            if (parseFloat(inputBudget) < 0){
                setBudgetErrorStatus('Budget must be a positive number');
                return;
            }

            if (parseFloat(inputBudget) < spentThisMonth){
                setBudgetErrorStatus('You have already bypassed this budget!');
                return;
            }

            try {
                const existingBudget = await db.currentBudget.toCollection().first();
                const newBudget = parseFloat(inputBudget).toFixed(2);
                console.log('new budget', newBudget)
                if (existingBudget) {
                    await db.currentBudget.update(existingBudget.id, { amount: newBudget });
                    if (spentThisMonth > newBudget) {
                        setBudgetStatus(`You have exceeded your budget of $${budget}`);
                    }
                    setBudgetRerender(!budgetRerender);
                } else {
                    console.log('test')
                }
                setBudgetErrorStatus('')
                setBudgetStatus(`Your current budget is $${inputBudget}`);

            } catch (error) { console.log("Error managing budget:", error); }

            setBudgetErrorStatus('')
            setManagingBudget(false);
            return;
        }
        setTransErrorStatus('')
        setManagingBudget(true);
        setCreatingBudget(false);


    }

    const deleteBudget = async () => {
        await db.currentBudget.clear();  // Clearing the budget from the database
        setBudgetStatus("You currently don't have a monthly budget");
        setBudgetErrorStatus('');
        setCreatingBudget(true);
        setInputBudget('')
        setBudget(0);
        closeModal();  // Close the modal after confirming
    };

    async function updateBal() {
        try {
            setOverBudgetModal(false)
            if (inputName === '' || inputAction === 'Choose an Action' || inputCategory ==='Choose a Category' || inputBal === ''){
                setTransErrorStatus('*All fields must be completed');
                console.log('must fill all fields');
                return;
            } else {
                setTransErrorStatus('');
            }



            const intInput = parseFloat(inputBal); // Make input a number
            const intBalance = parseFloat(balance); // Current balance

            if (intInput > intBalance && inputAction === 'withdraw'){
                setTransErrorStatus(`You do not have $${intInput}`);
                return;
            }


            if (isNaN(intInput) || isNaN(intBalance)) {
                console.error("Invalid input or balance: not a number");
                return;
            }

            if (intInput < 0.01) {
                console.error("Invalid input or balance: less than 1 cent");
                return;
            }

            const newBalance = inputAction === "deposit"
                ? intBalance + intInput
                : intBalance - intInput; // Subtract if action is 'withdraw'

            const existingBal = await db.currentBal.toCollection().first();


            if (existingBal) {
                await db.currentBal.update(existingBal.id, { balance: newBalance.toFixed(2) }); // To fixed makes sure Balance is at maximum 2 decimal digits.
            } else {
                await db.currentBal.add({ balance: newBalance });
            }


            const latestTransaction = await db.transactionLog.orderBy('id').last();

            let nextID = 1;
            if (latestTransaction && typeof latestTransaction.id === "number") {
                nextID = latestTransaction.id + 1;
                console.log(`Latest id before current addition of ${nextID}, is ${latestTransaction.id}`);
            }

            console.log("Next Transaction ID:", nextID);

            const localDate = inputDate ? new Date(`${inputDate}T00:00:00`) : new Date();
            localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset()); // Offset correction
            const year = localDate.getFullYear();
            const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Ensure "02" format
            const day = String(localDate.getDate()).padStart(2, '0'); // Ensure "02" format
            const dateF = `${year}-${month}-${day}`;

            console.log(dateF);

            await db.transactionLog.add({
                id: nextID,
                name: inputName,
                action: inputAction,
                amount: intInput.toFixed(2),
                category: inputCategory,
                date: dateF,
                time: new Date().toLocaleTimeString(),
            });

            // Reset the input fields
            setBal(newBalance);
            setInputBal("");
            setInputName("");
            setInputAction("Choose an Action");
            setInputCategory("Choose a Category");
            setInputDate('')
        } catch (error) {
            console.log("Error updating balance:", error);
        }
    }

    async function openOverBudgetModal() {

        const haveBudget = await db.currentBudget.toCollection().first();

        console.log('have budget', haveBudget)

        if (!haveBudget){
            console.log('no budget')
            await updateBal();
            return;
        } else{
            const intInput = parseFloat(inputBal); // Make input a number


            const currentBudget = await db.currentBudget.toCollection().first()
            if (currentBudget){
                const intBudget = parseFloat(currentBudget.amount, 2)

                console.log('int budget', intBudget)

                if (inputAction === 'withdraw'){

                    const newSpentThisMonth = spentThisMonth + intInput

                    console.log('newspent', newSpentThisMonth)
                    if (newSpentThisMonth.toFixed(2)  > intBudget){
                        setOverBudgetModal(true);
                    }else{await updateBal();}
                }else {
                    await updateBal()
                }
            }

        }


    }

    function closeOverBudgetModal() {
        setOverBudgetModal(false)
    }

    const openModal = () => setIsDeleteModalOpen(true);
    const closeModal = () => setIsDeleteModalOpen(false);

    function TwoButtonModal({ isOpen, onClose, onConfirm, text1, text2, leftButton, rightButton }) {
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
                    className="relative bg-white rounded-2xl shadow-lg p-6 w-[550px] border border-t-[25px] border-violet-800"
                >
                    {/* Modal Body */}
                    <div className="mt-4 text-black">
                        <h2 className="font-semibold text-xl">{text1}</h2>
                        <p className="mt-2 text-sm">{text2}</p>
                    </div>

                    {/* Modal Actions */}
                    <div className="mt-4 flex justify-between">
                        <button
                            className="bg-gray-300 text-black py-2 px-4 rounded-lg"
                            onClick={onClose}
                        >
                            {leftButton}
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-lg"
                            onClick={onConfirm}
                        >
                            {rightButton}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    async function editTransaction(){
        if (!editing){
            setTransOrBudgetOrEdit('edit')
            setEditing(true);
        }else{

            const localDate = inputDate ? new Date(`${inputDate}T00:00:00`) : new Date();
            localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset()); // Offset correction
            const year = localDate.getFullYear();
            const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Ensure "02" format
            const day = String(localDate.getDate()).padStart(2, '0'); // Ensure "02" format
            const dateF = `${year}-${month}-${day}`;

            if (inputID === '' || inputName === '' || inputAction === 'Choose an Action' || inputCategory ==='Choose a Category' || inputBal === ''){
                setTransErrorStatus('*All fields must be completed');
                console.log('must fill all fields');
                return;
            } else {
                setTransErrorStatus('');
            }

            const intInput = parseFloat(inputBal); // Make input a number
            const intBalance = parseFloat(balance); // Current balance

            if (intInput > intBalance && inputAction === 'withdraw'){
                setTransErrorStatus(`You do not have $${intInput}`);
                return;
            }

            const newBalance = inputAction === "deposit"
                ? intBalance + intInput
                : intBalance - intInput; // Subtract if action is 'withdraw'

            const existingBal = await db.currentBal.toCollection().first();

            const transactionLogs = await db.transactionLog

            if (transactionLogs){
                await db.transactionLog.update(parseInt(inputID), {name: inputName, action: inputAction, amount: intInput.toFixed(2), category: inputCategory, date: dateF})
            }else {console.log('didnt update')}


            if (existingBal) {
                await db.currentBal.update(existingBal.id, { balance: newBalance.toFixed(2) }); // To fixed makes sure Balance is at maximum 2 decimal digits.
            } else {
                await db.currentBal.add({ balance: newBalance });
            }

            setInputID('')
            setBal(newBalance);
            setInputBal("");
            setInputName("");
            setInputAction("Choose an Action");
            setInputCategory("Choose a Category");
            setInputDate('')
        }


    }

    function setTransaction(){
        setTransOrBudgetOrEdit('transactions')
        setEditing(false)
    }
    function setButtonBudget(){
        setTransOrBudgetOrEdit('budget')
        setEditing(false)
    }

    // Check how much was spent this month
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
                    .where({ action: 'withdraw' })
                    .and(data => filterData(data, 'month'))
                    .toArray();

                setSpentThisMonth(expensesArray.reduce((cAmount, item) => cAmount + parseFloat(item.amount), 0));

            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, [transactions]);

    // Grab the balance from the database
    useEffect(() => {
        async function grabBalance() {
            try {
                const existingBal = await db.currentBal.toCollection().first();
                if (existingBal) {
                    setBal(parseFloat(existingBal.balance) || 0); // Ensure balance is a number
                } else {
                    setBal(defaultBal); // Set to default if no balance exists
                }
            } catch (error) {
                console.log("Error grabbing balance:", error);
            }
        }
        grabBalance();
    }, [defaultBal, transactions]);

    // Grab the budget from the database
    useEffect(() => {
        async function grabBudget() {
            try {
                const existingBudget = await db.currentBudget.toCollection().first();
                if (existingBudget) {
                    setBudget(parseFloat(existingBudget.amount) || 0); // Ensure balance is a number
                    setCreatingBudget(false);
                    setBudgetStatus(`Your current monthly budget is $${budget}`);
                    if (spentThisMonth > parseFloat(existingBudget.amount)) {
                        setBudgetStatus(`You have exceeded your budget of $${budget}`);
                    }
                } else {
                    setBudgetStatus("You currently don't have a monthly budget"); // Set to default if no balance exists
                    setCreatingBudget(true)
                }
            } catch (error) {
                console.log("Error grabbing budget:", error);
            }
        }
        grabBudget();
    }, [budget, spentThisMonth, transactions, transOrBudgetOrEdit, budgetRerender]);






    return (
        <>
            <div
                className='flex flex-col shadow-md bg-gray-100 overflow-x-hidden h-[70%] w-[100%] overflow-y-hidden rounded-xl  items-center'>

                { transOrBudgetOrEdit === 'transactions' || transOrBudgetOrEdit === 'edit' && <h1 className={`mt-3 mx-3 text-red-700 ${transErrorStatus === '' && 'hidden'}  font-extrabold w-fit`}>{transErrorStatus}</h1>}
                { transOrBudgetOrEdit === 'budget' && <h1 className={`mt-3 mx-3 text-red-700 ${budgetErrorStatus === '' && 'hidden'}  font-extrabold w-fit`}>{budgetErrorStatus}</h1>}

                <div className='grid grid-cols-2 mb-4'>
                    <button onClick={() =>{setTransaction()}} className={`mt-3 mx-3 text-black bg-white hover:bg-gray-300 hover:text-black rounded-xl ${transOrBudgetOrEdit === 'transactions' && 'bg-gray-700 text-white'}  border border-black p-1 font-bold w-fit`}>Add Transactions</button>
                    <button onClick={() =>{setButtonBudget()}} className={`mt-3 mx-3 text-black bg-white hover:bg-gray-300 rounded-xl border ${transOrBudgetOrEdit === 'budget' && 'bg-gray-700 text-white'} border-black p-1 font-bold w-fit`}>Manage Budget</button>
                </div>

                {transOrBudgetOrEdit === 'transactions' && (
                    <>
                        {/* input fields */}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }} className='justify-center items-center text-center space-y-3'>
                            <div className="text-white font-medium text-lg">
                                <label className='text-black'>Current Balance ${balance}</label>
                            </div>

                            {/* Name input */}
                            <input
                                type="text"
                                value={inputName}
                                onChange={(evN) => setInputName(evN.target.value)}
                                placeholder="Name of Transaction"
                                className="text-gray-700 border-black rounded-xl h-11 text-center"
                            />

                            {/* Action Input */}
                            <div className="relative flex flex-col justify-center items-center text-center">
                                <button
                                    className="text-gray-700 bg-white border border-black rounded-xl h-11 w-52 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center"
                                    type="button"
                                    onClick={toggleActionDropDown}>
                                    {inputAction.charAt(0).toUpperCase() + inputAction.slice(1)}
                                </button>

                                <div ref={actionDropdownRef} className={`absolute top-full mt-2 w-52 bg-white z-50 divide-y divide-gray-100 rounded-lg shadow-md ${actionDropDownToggle ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'} transition-all duration-300`}>
                                    <ul className="py-2 text-sm items-center text-center text-gray-700">
                                        <li>
                                            <button onClick={(e) => actionSelect('deposit')} className="inline-block w-full py-2 hover:bg-gray-100">Deposit</button>
                                        </li>
                                        <li>
                                            <button onClick={(e) => actionSelect('withdraw')} className="inline-block w-full py-2 hover:bg-gray-100">Withdraw</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Category input */}
                            <div className="relative flex flex-col justify-center items-center text-center">
                                <button
                                    className="text-gray-700 bg-white border border-black rounded-xl h-11 w-52 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center"
                                    type="button"
                                    onClick={toggleCategoryDropDown}>
                                    {inputCategory.charAt(0).toUpperCase() + inputCategory.slice(1)}
                                </button>

                                <div ref={categoryDropdownRef} className={`absolute top-full mt-2 w-52 bg-white z-50 divide-y divide-gray-100 rounded-lg shadow-md ${categoryDropDownToggle ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'} transition-all duration-300`}>
                                    <ul className={`py-2 text-sm items-center ${inputAction === 'deposit' ? 'hidden' : ''} text-center text-gray-700`}>
                                        <li>
                                            <button onClick={(e) => categorySelect('entertainment')} className={`inline-block w-full py-2 hover:bg-gray-100`}>Entertainment</button>
                                        </li>
                                        <li>
                                            <button onClick={(e) => categorySelect('food')} className="inline-block w-full py-2 hover:bg-gray-100">Food</button>
                                        </li>
                                        <li>
                                            <button onClick={(e) => categorySelect('shopping')} className="inline-block w-full py-2 hover:bg-gray-100">Shopping</button>
                                        </li>
                                        <li>
                                            <button onClick={(e) => categorySelect('bills')} className="inline-block w-full py-2 hover:bg-gray-100">Bills</button>
                                        </li>
                                        <li>
                                            <button onClick={(e) => categorySelect('other')} className="inline-block w-full py-2 hover:bg-gray-100">Other</button>
                                        </li>
                                    </ul>

                                    <ul className={`py-2 text-sm items-center ${inputAction === 'withdraw' ? 'hidden' : ''} text-center text-gray-700`}>
                                        <li>
                                            <button onClick={(e) => categorySelect('work')} className={`inline-block w-full py-2 hover:bg-gray-100`}>Work</button>
                                        </li>
                                        <li>
                                            <button onClick={(e) => categorySelect('other')} className="inline-block w-full py-2 hover:bg-gray-100">Other</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative flex flex-col justify-center items-center text-center">
                                {/* Amount input */}
                                <input
                                    type="number"
                                    value={inputBal}
                                    onChange={(evN) => setInputBal(evN.target.value)}
                                    placeholder="Transaction Amount"
                                    className="text-gray-700 appearance-none text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none rounded-xl shadow-md border-black h-11"
                                />

                                <input
                                    type="date"
                                    value={inputDate}
                                    onChange={(evN) => setInputDate(evN.target.value)}
                                    className="text-gray-700 border-black rounded-xl h-11 text-center mt-3"
                                />
                            </div>
                        </motion.div>

                        <div className="flex space-x-4 mt-5">
                            <button
                                onClick={openOverBudgetModal}
                                className="text-gray-700 bg-white border border-black rounded-xl h-11 w-11/12 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center shadow-md"
                            >
                                Add Transaction
                            </button>

                            <TwoButtonModal
                                isOpen={overBudgetModal}
                                onClose={closeOverBudgetModal}
                                onConfirm={updateBal}
                                text1="This Transaction Will pass your budget, are you sure you want to continue?"
                                text2={``}
                                leftButton="Cancel"
                                rightButton="Continue"
                            />

                            <button onClick={clearFields} className="text-gray-700 bg-white border border-black rounded-xl h-11 w-11/12 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center shadow-md">
                                Clear Fields
                            </button>

                            {/* Add Selected Delete */}
                        </div>
                    </>
                )}

                {transOrBudgetOrEdit === 'budget' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className='flex flex-col justify-center items-center text-center space-y-3'
                        >
                            <div className=" ">
                                <label className={` font-medium text-lg text-black`}>{budgetStatus}</label>
                            </div>


                            {budgetStatus === "You currently don't have a monthly budget" && (
                                <>

                                    {creatingBudget && (

                                        <>
                                            <motion.button
                                                className="text-gray-700 bg-white border border-black rounded-xl h-11 w-52  px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-100 flex items-center justify-center"
                                                type="button"
                                                onClick={() => manageBudget()}
                                                animate={{ y: creatingBudget ? 110 : 0 }} // Moves down
                                                transition={{ type: "spring", stiffness: 100 }}
                                            >
                                                Set Budget
                                            </motion.button>

                                            <motion.input
                                                type="number"
                                                value={inputBudget}
                                                onChange={(evN) => setInputBudget(evN.target.value)}
                                                placeholder="What's your budget?"
                                                className="text-gray-700 border-black rounded-xl transition duration-500 h-11 text-center mt-3"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                            />
                                        </>

                                    )}
                                </>
                            )}

                            {budgetStatus !== "You currently don't have a monthly budget" && (

                                <>
                                    <label className='text-black font-medium text-lg'>You have spent: ${spentThisMonth}</label>

                                    <div className={`flex flex-col justify-center items-center text-center space-y-6`}>
                                        <label className='text-black font-bold text-lg'>Update Or Delete Budget</label>

                                        <input type="number" value={inputBudget} onChange={(evN) => setInputBudget(evN.target.value)} placeholder="New Budget Amount" className="text-gray-700 border-black rounded-xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none transition duration-500 h-11 text-center mt-3"/>

                                        <div className={`grid grid-cols-2 space-x-3`}>
                                            <button className="text-gray-700 bg-white border border-black rounded-xl h-11 w-fit  px-8 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-100 flex items-center justify-center" type="button" onClick={() => manageBudget()}>
                                                Set Budget
                                            </button>

                                            <button onClick={openModal} className="text-gray-700 bg-white border border-black rounded-xl h-11 w-fit  px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-100 flex items-center justify-center">
                                                Delete Budget
                                            </button>

                                            {/* Confirmation Modal */}
                                            <TwoButtonModal
                                                isOpen={isDeleteModalOpen}
                                                onClose={closeModal}
                                                onConfirm={deleteBudget}
                                                text1="Are you sure you want to delete your budget?"
                                                text2={`This action can not be undone!`}
                                                leftButton="Cancel"
                                                rightButton="Delete"
                                            />
                                        </div>

                                    </div>


                                </>



                            )}


                        </motion.div>


                    </>
                )}

                {transOrBudgetOrEdit === 'edit' && (
                    <>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }} className='justify-center items-center text-center space-y-3'>

                            <label className={` font-bold text-lg text-black`}>Edit Transactions</label>


                            <div className={`flex flex-col space-y-3`}>


                                <input
                                    type="number"
                                    value={inputID}
                                    onChange={(evN) => setInputID(evN.target.value)}
                                    placeholder="ID of transaction"
                                    className="text-gray-700 appearance-none text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none rounded-xl shadow-md border-black h-11"
                                />

                                <input
                                    type="text"
                                    value={inputName}
                                    onChange={(evN) => setInputName(evN.target.value)}
                                    placeholder="Name of Transaction"
                                    className="text-gray-700 border-black rounded-xl h-11 text-center"
                                />

                                {/* Action Input */}
                                <div className="relative flex flex-col justify-center items-center text-center">
                                    <button
                                        className="text-gray-700 bg-white border border-black rounded-xl h-11 w-52 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center"
                                        type="button"
                                        onClick={toggleActionDropDown}>
                                        {inputAction.charAt(0).toUpperCase() + inputAction.slice(1)}
                                    </button>

                                    <div ref={actionDropdownRef} className={`absolute top-full mt-2 w-52 bg-white z-50 divide-y divide-gray-100 rounded-lg shadow-md ${actionDropDownToggle ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'} transition-all duration-300`}>
                                        <ul className="py-2 text-sm items-center text-center text-gray-700">
                                            <li>
                                                <button onClick={(e) => actionSelect('deposit')} className="inline-block w-full py-2 hover:bg-gray-100">Deposit</button>
                                            </li>
                                            <li>
                                                <button onClick={(e) => actionSelect('withdraw')} className="inline-block w-full py-2 hover:bg-gray-100">Withdraw</button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Category input */}
                                <div className="relative flex flex-col justify-center items-center text-center">
                                    <button
                                        className="text-gray-700 bg-white border border-black rounded-xl h-11 w-52 px-4 focus:outline-none focus:ring-2 focus:ring-black hover:bg-gray-100 transition duration-200 flex items-center justify-center"
                                        type="button"
                                        onClick={toggleCategoryDropDown}>
                                        {inputCategory.charAt(0).toUpperCase() + inputCategory.slice(1)}
                                    </button>

                                    <div ref={categoryDropdownRef} className={`absolute top-full mt-2 w-52 bg-white z-50 divide-y divide-gray-100 rounded-lg shadow-md ${categoryDropDownToggle ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'} transition-all duration-300`}>
                                        <ul className={`py-2 text-sm items-center ${inputAction === 'deposit' ? 'hidden' : ''} text-center text-gray-700`}>
                                            <li>
                                                <button onClick={(e) => categorySelect('entertainment')} className={`inline-block w-full py-2 hover:bg-gray-100`}>Entertainment</button>
                                            </li>
                                            <li>
                                                <button onClick={(e) => categorySelect('food')} className="inline-block w-full py-2 hover:bg-gray-100">Food</button>
                                            </li>
                                            <li>
                                                <button onClick={(e) => categorySelect('shopping')} className="inline-block w-full py-2 hover:bg-gray-100">Shopping</button>
                                            </li>
                                            <li>
                                                <button onClick={(e) => categorySelect('bills')} className="inline-block w-full py-2 hover:bg-gray-100">Bills</button>
                                            </li>
                                            <li>
                                                <button onClick={(e) => categorySelect('other')} className="inline-block w-full py-2 hover:bg-gray-100">Other</button>
                                            </li>
                                        </ul>

                                        <ul className={`py-2 text-sm items-center ${inputAction === 'withdraw' ? 'hidden' : ''} text-center text-gray-700`}>
                                            <li>
                                                <button onClick={(e) => categorySelect('work')} className={`inline-block w-full py-2 hover:bg-gray-100`}>Work</button>
                                            </li>
                                            <li>
                                                <button onClick={(e) => categorySelect('other')} className="inline-block w-full py-2 hover:bg-gray-100">Other</button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="relative flex flex-col justify-center items-center text-center">
                                    {/* Amount input */}
                                    <input
                                        type="number"
                                        value={inputBal}
                                        onChange={(evN) => setInputBal(evN.target.value)}
                                        placeholder="Transaction Amount"
                                        className="text-gray-700 appearance-none text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none rounded-xl shadow-md border-black h-11"
                                    />

                                    <input
                                        type="date"
                                        value={inputDate}
                                        onChange={(evN) => setInputDate(evN.target.value)}
                                        className="text-gray-700 border-black rounded-xl h-11 text-center mt-3"
                                    />
                                </div>

                            </div>
                            {/* Name input */}


                        </motion.div>
                    </>
                )}
                <div className='grid grid-cols-1'>
                    <button onClick={() =>{editTransaction()}} className={`${creatingBudget ? 'mt-20' : 'mt-7'} mx-3 text-black hover:bg-gray-300 bg-white rounded-xl border border-black p-2 font-bold w-fit`}>{editing ? 'Confirm Edit' : 'Edit Transactions'}</button>
                </div>
            </div>
        </>
    );
};

export default AddTransactions;