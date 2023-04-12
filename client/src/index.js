import React, { useState } from "react";
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
import Footer from "./Footer";

//------------------------REFERENCE-----------------------------//
//Login authentication and storing user ID tokens adapted from tutorial:
// https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

function Index() {
    //Gets the token (i.e. the userID from the session storage)
    const getToken = () => {
        const tokenString = localStorage.getItem("token");
        console.log("tokenString");
        console.log(tokenString);
        console.log(typeof tokenString);
        if (typeof tokenString === undefined) {
            console.log("falsy");
            return null;
        }
        console.log(tokenString);
        console.log("hello! tokenString is truthy");
        const userToken = JSON.parse(tokenString);
        console.log("userToken: ");
        console.log(userToken);
        return userToken;
    };

    //use state stuff that is used on all the pages, really
    const [token, setToken] = useState(getToken());

    //saves the token (userID) to session storage
    const saveToken = (userToken) => {
        localStorage.setItem("token", JSON.stringify(userToken));
        setToken(userToken);
        console.log(userToken.token);
        //We need to refresh as otherwise it stays on the login page?
        //And cause the App component isnt in a browser router with the
        //others we can't use navigate to move between them.

        //If anyone has a better idea on how to do this fix it pls
        window.location.reload(false);
    };

    //If token ISN'T falsy i.e. user has logged in! We need to show them everything
    if (token) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navbar />}>
                        {/*Default to account page on refresh after login! */}
                        <Route index element={<Account />} />

                        <Route path="Diet" element={<Meal />} />
                        <Route
                            path="Account"
                            element={<Account userID={getToken} />}
                        />
                        <Route path="Exercise" element={<Exercise />} />
                        <Route path="Goal" element={<Goal />} />
                        <Route path="Group" element={<Group />} />
                        <Route path="History" element={<History />} />
                        <Route
                            path="*"
                            element={
                                <h1>
                                    <br />
                                    <br />
                                    404: No pages here!
                                </h1>
                            }
                        />
                    </Route>
                </Routes>
                <Footer />
            </BrowserRouter>
        );
    }

    //We have to pass saveToken so the login and account creation stuff
    //can set the token when the user logs in.
    else {
        return <App setToken={saveToken} />;
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Index />);
