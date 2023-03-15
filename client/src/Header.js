import React from "react";
import ReactDOM from "react-dom/client";
import "./Header";

export default function Header() {
    return (
        <nav>
            <ul>
                <li>
                    <span class="Desktop">
                        <a href="reportJob">Report Job</a>
                    </span>
                </li>
                <li>
                    <span class="Desktop">
                        <a href="findJob">Find Job</a>
                    </span>
                </li>
                <li>
                    <span class="Desktop">
                        <a href="aboutUs">About Us</a>
                    </span>
                </li>
                <li>
                    <span class="Desktop">
                        <a href="howTo">How To</a>
                    </span>
                </li>
            </ul>

            <div class="mobile-menu">
                <a href="reportJob">Report Job</a>
                <a href="findJob">Find Job</a>
                <a href="aboutUs">About Us</a>
                <a href="howTo">How To</a>
            </div>
        </nav>
    );
}
