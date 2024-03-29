import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./Navbar";
import { Outlet, Link } from "react-router-dom";
import "./css/header.css";
import "./css/index.css";

export default function Navbar() {
    useEffect(() => {
        const hamburger = document.querySelector(".hamburger");
        const nav = document.querySelector("nav");

        hamburger.addEventListener("click", function () {
            nav.classList.toggle("active");
        });
    }, []);

    //Action to logout a user
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <>
            <header>
                <div class="header-left">
                    <div class="logo">
                        <div class="logo">
                            <img className="logo" src="./logo5.png" alt="" />
                        </div>
                    </div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/Diet">Record Meal</Link>
                            </li>
                            <li>
                                <Link to="/Exercise">Record Exercise</Link>
                            </li>
                            <li>
                                <Link to="/Goal">Goals</Link>
                            </li>
                            <li>
                                <Link to="/Group">Groups</Link>
                            </li>
                            <li>
                                <Link to="/Account">Account</Link>
                            </li>
                            <li>
                                <Link id="logout" onClick={handleLogout}>
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="header-right">
                    <div class="hamburger">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </header>

            <Outlet />
        </>
    );
}
