

# 💸 SpendWise - The Money Management App for Students! 💸

---
Are you a student who struggles to manage your money? Do you find yourself spending too much on things you don't need? If so, then SpendWise is the app for you! SpendWise is a money management app designed specifically for students. It allows you to track your spending, visualize it, and save money. With SpendWise, you can take control of your finances and make smarter decisions about how you spend your money. So why wait? Download SpendWise today and start managing your money like a pro!

<img src="./src/public/images/FemtanylLogo.jpg" alt="Femtanyl Logo" title="Femtanyl Logo" style="margin-left: auto; margin-right: auto; display: block; max-width: 100%;">

## ❓ Prompt
***
Create a program that helps students manage their personal finances by tracking account
balances, income and expenses. The program should allow users to input details about their
income sources and expenses, including the amount, category, and date of each transaction.
It should provide features to view the current balance, generate summaries of income and
expenses over specified periods (e.g., weekly, monthly), and categorize expenses to show
spending patterns. Additionally, the program should include functionality to update or delete
existing entries and offer search and filter options to easily find specific transactions.

## ✔️ Setup 
***

### Installation

1. Download the latest Release from https://github.com/Unovya/Fbla-Banking/releases

2. Run the executable file and follow the installation instructions.

3. Running the executable file will install the app on your computer.

4. And that's it! You're all set up!

### Building from Source code

1. Download Node.js from https://nodejs.org/en/download/

2. Download the source code from [This Repository](https://github.com/Unovya/Fbla-Banking)

3. Open the terminal and navigate to the source code directory.

4. Run ```npm install``` to install the dependencies.

5. Once all dependencies are installed, run ```npm run build```

6. This will create a new folder named ```dist``` in the source code directory containing the executable file.

## 📜 Docs
***

### File Structure

| File/Folder                   | Description                                          |
|-------------------------------|------------------------------------------------------|
| src/                          | Container For main Files                             | |
| src/components/               | Contains all of the components used in the App       |
| src/components/DBComponents/  | Contains any components that manipulate the Database |
| src/pages/                    | Contains all the individual pages                    |
| src/public/                   | Contains all the static files such as images         |
| src/scripts/database-scripts/ | Contains any non component scripts                   |
| src/main.js                   | Main process ran when app starts                     |
| src/renderer.js               | Renderer process ran when app starts                 |
| src/App.jsx                   | Controls the routes                                  |
| src/index.jsx                 | Shows App.jsx                                        |

### Features

- **Add Transactions** - Create transactions tot know when and how much your spending.
- **Remove Transactions** - Remove transactions that are no longer needed or incorrect.
- **Visualize Your Spending** - See your spending in a graph to better understand your spending habits.
- **Filter Transactions** - Filter transactions by date, category, or amount to find specific transactions.
- **Generate a CSV File** - Export your transactions to a CSV file for easy sharing and backup.

## 📰 Sources
***

| Library       | Purpose                                            |
|---------------|----------------------------------------------------|
| NextJS        | Frontend framework used for rendering the frontend | |
| Electron      | Used to create the desktop app                     |
| React         | Used to create the frontend                        |
| Tailwind      | Used for styling the frontend                      |
| Dexie         | Used for the database / Persistent storage         |
| Chart.js      | Used for creating any graphs                       |
| React Icons   | Used for any icons in the app                      |
 | framer-motion | Used for animations in the app                     |