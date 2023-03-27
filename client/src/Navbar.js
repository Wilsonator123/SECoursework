import React from "react";
import ReactDOM from "react-dom/client";
import "./Navbar";
import { Outlet, Link } from "react-router-dom";
import "./css/header.css";

export default function Navbar() {
    return (
        <>
            TEST
            <nav>
                <ul>
                    <li>
                        <Link exac to="/">
                            LOGO
                        </Link>
                    </li>

                    <li>
                        <Link to="/Meal">Record Meal</Link>
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
                </ul>
            </nav>
            <Outlet />
        </>
    );
}
