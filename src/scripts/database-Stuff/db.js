import Dexie from "dexie";

export const db = new Dexie('UnovianDB');
db.version(1).stores({
    currentBal: '++id, balance, date',
    transactionLog: '++id, name, action, amount, category, date',
    reoccurringCosts: '++id, name, amount, date'
});