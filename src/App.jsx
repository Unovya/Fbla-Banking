import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
// Import all the pages
import Xmple1 from './pages/xmple1.jsx';
import Xmple2 from './pages/xmple2.jsx';
import HomePage from "./pages/homePage.jsx";
import TransactionsPage from "./pages/transactionsPage.jsx";
// end page import

const App = () => {
    return (
        <Router>
            <Routes>
                {/* If going to main window make sure not to do "./home". do "/" */}
                <Route path="/" element={<HomePage />} />
                <Route path="/transactionPg" element={<TransactionsPage />} />
                <Route path="/example1" element={<Xmple1 />} />
                <Route path="/example2" element={<Xmple2 />} />
            </Routes>
        </Router>
    );
};

export default App;