import Dexie from "dexie";

export const db = new Dexie('UnovianDB');
db.version(1).stores({
    currentBal: '++id, balance',
    transactionLog: '++id, name, action, amount, category, date, time',
    reoccurringCosts: '++id, name, amount, date'
});