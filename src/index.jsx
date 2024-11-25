import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Home from "./pages/home.jsx";
import { HashRouter as Router, Routes, Route} from "react-router-dom";
import "./index.css";

const root = createRoot(document.body);
root.render(<Home />);