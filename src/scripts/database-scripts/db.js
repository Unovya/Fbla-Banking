import Dexie from "dexie";

export const db = new Dexie('UnovianDB');
db.version(1).stores({
    currentBal: '++id, balance',
    transactionLog: 'id, name, action, amount, category, date, time',
    currentBudget: '++id, amount',
    reoccurringCosts: '++id, name, amount, date'
});

db.open().catch((error) => {
    console.error('Failed to open DB: ', error);
});


const isFirstRun = localStorage.getItem('isFirstRun') === null;

if (isFirstRun){
    console.log('First time running app, initializing DB');

    async function initializeDB() {
        try {
            await db.currentBal.add({ balance: 0 });

            console.log('DB initialized');

            // Set the flag so this doesn't run again
            localStorage.setItem('isFirstRun', 'false');
        } catch (error) {
            console.error('Error initializing DB: ', error);
        }
    }
    initializeDB();
}else {
    console.log('App opened before, no initialization needed.');
}