import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
// Import all the pages
import Home from './pages/home.jsx';
import Pg2 from './pages/app2.jsx';


const App = () => {
    return (
        <Router>
            <Routes>
                {/* Define routes, Make sure to add "/main_window/" before anything else as shown below */}
                <Route path="/main_window" element={<Home />} />
                <Route path="/main_window/app2" element={<Pg2 />} />
            </Routes>
        </Router>
    );
};

export default App;