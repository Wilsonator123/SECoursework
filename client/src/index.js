import React, { StrictMode, useState } from "react";
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


//Login authentication and storing user ID tokens adapted from
// https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications


function Index() {

    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        console.log("userToken: ");
        console.log(userToken);
        console.log("getting token: ")
        console.log(userToken);
        return userToken;
      };


    const [token, setToken] = useState(getToken());
    


    const saveToken = (userToken) => {
        sessionStorage.setItem("token", JSON.stringify(userToken));
        setToken(userToken.token);
        console.log("Set Token has been called!");
        console.log("User Token in save Token");
        console.log(userToken.token);
      };

    

    console.log("userID = ");
    
    if (token){
        console.log("should be showing everything else!");
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="" element={<Navbar />}>
                    <Route path="/" element={<Account />}>
                        <Route path="Meal" element={<Meal />} />
                        <Route path="/Account" element={<Account />} />
                        <Route path="Exercise" element={<Exercise />} />
                        <Route path="Goal" element={<Goal />} />
                        <Route path="Group" element={<Group />} />
                        <Route path="History" element={<History />} />
                        <Route path="*" element={<h1>No pages here!</h1>} />
                    </Route>
                    </Route>
                    
                </Routes>
            </BrowserRouter>
        );
    }

    else {
        console.log("should only be showing sign in page");
        console.log("user ID not found");
        return <App setToken={saveToken}/>

    } 


}



//Get our root element and put the paths for the account creation page and
//all other pages there
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Index />);

 
