import "./css/App.css";
import { useState } from "react";
import AccountCreation from "./components/AccountCreation";
import Login from "./components/LogIn";
import PropTypes from "prop-types";

//Inspiration for authentication code taken from
//https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

export default function App({ setToken }) {
    //used to set the ID for a user on a login

    //Used to toggle between whether the user sees the Login form
    //Or the Account Creation form
    const [currentForm, setCurrentForm] = useState(true);

    //On pressing the button the form changes
    function toggleForm() {
        setCurrentForm(!currentForm);
    }

    return (
        <div id="pageContainer">
            {/*Header dependent on which form you are on */}
            <h1>{currentForm ? "CREATE ACCOUNT" : "LOG IN"}</h1>
            <br />
            <div class="grid-container-account">
                <div class="account-box">
                    <div class="form-box">
                        {currentForm ? (
                            <AccountCreation setToken={setToken} />
                        ) : (
                            <Login setToken={setToken} />
                        )}
                    </div>
                    <div class="kms">
                        <p class="create-para">
                            {currentForm
                                ? "Already have an account?"
                                : "Don't have an account yet?"}
                        </p>

                        <button class="login-btn" onClick={toggleForm}>
                            {currentForm ? "Login" : "Sign Up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
