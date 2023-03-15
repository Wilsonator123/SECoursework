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
                        <Link to="/Diet">Diet</Link>
                    </li>

                    <li>
                        <Link to="/Exercise">Exercise</Link>
                    </li>

                    <li>
                        <Link to="/Goal">Goal</Link>
                    </li>

                    <li>
                        <Link to="/Group">Group</Link>
                    </li>
                    <li>
                        <Link to="/History">History</Link>
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
