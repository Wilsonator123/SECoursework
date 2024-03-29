import React from "react";
import "./css/footer.css";
import { Link } from "react-router-dom";
import "./css/index.css";

function Footer() {
    return (
        <div className="footer-container">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                    integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
                    crossorigin="anonymous"
                    referrerpolicy="no-referrer"
                />
            </head>
            <section className="footer">
                <div className="social">
                    <a href="#">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                </div>
                <ul className="list">
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
                        <Link to="/">Terms</Link>
                    </li>
                    <li>
                        <Link to="/">Privacy Policy</Link>
                    </li>
                </ul>
                <p className="copyright">Team 101 &copy; 2023</p>

                <div class="logo">
                    <img className="logo" src="./logo5.png" alt="" />
                </div> 
                
            </section>
        </div>
    );
}

export default Footer;
