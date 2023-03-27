import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//All of our pages we will use later!
import App from "./App";
//Not sure if we will be using this page?
//import Home from "./Home";
import Account from "./Account";
import Meal from "./Diet";
import Exercise from "./Exercise";
import Goal from "./Goal";
import Group from "./Group";
import History from "./History";
import Navbar from "./Navbar";


//Get our root element and put the paths for the account creation page and
//all other pages there
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

    <BrowserRouter>
        <Routes>

            {/*On the Account Creation, no other pages should be accessed */}
            <Route index element={<App />} />



            {/*Normal NavBar links (will need to be updated!) */}
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
    </BrowserRouter>
);

 
