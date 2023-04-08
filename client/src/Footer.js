import React from "react"
import "./css/footer.css";
import {Link} from "react-router-dom";

function Footer(){
    return (
        <div className = 'footer-container'> 
            <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            </head>
            <section className="footer"> 
                <div className="social">
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                </div> 
                <ul className="list">    
                    <li><Link to="/Meal">Record Meal</Link></li>
                    <li><Link to="/Exercise">Record Exercise</Link></li>
                    <li><Link to="/Goal">Goals</Link></li>
                    <li><Link to="/Group">Groups</Link></li>
                    <li><Link to="/Account">Account</Link></li> 
                    <li><Link to="/">Terms</Link></li> 
                    <li><Link to="/">Privacy Policy</Link></li> 
                </ul>
                <p className="copyright">Team Name &copy; 2023</p>
                
            </section>
    
        </div>

    
    )
} 

export default Footer