import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Account from "./Account";
import Meal from "./Diet";
import Exercise from "./Exercise";
import Goal from "./Goal";
import Group from "./Group";
import History from "./History";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./css/index.css";


// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navbar />}>
                <Route index element={<App />} />
                <Route path="Meal" element={<Meal />} />
                <Route path="Account" element={<Account />} />
                <Route path="Exercise" element={<Exercise />} />
                <Route path="Goal" element={<Goal />} />
                <Route path="Group" element={<Group />} />
                <Route path="History" element={<History />} />
            </Route>
        </Routes>
        <Footer />
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
