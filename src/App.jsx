import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
// Import all the pages
import Home from './pages/home.jsx';
import Pg2 from './pages/pg2.jsx';


const App = () => {
    return (
        <Router>
            <Routes>
                {/* If going to main window make sure not to do "./home". do "/" */}
                <Route path="/" element={<Home />} />
                <Route path="/pg2" element={<Pg2 />} />
            </Routes>
        </Router>
    );
};

export default App;