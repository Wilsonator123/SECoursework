import "./css/App.css";
import { useState } from "react";
import AccountCreation from "./components/AccountCreation";
import Login from "./components/LogIn";

function App() {

    //Used to toggle between whether the user sees the Login form
    //Or the Account Creation form
    const [currentForm, setCurrentForm] = useState(true);

    //On pressing the button the form changes
    function toggleForm(){
        setCurrentForm(!currentForm);
    }

    return (
        <div id="pageContainer">

            {/*Header dependent on which form you are on */}
            <h1>{currentForm ? "CREATE ACCOUNT" : "LOG IN"}</h1>
            <br/>


            {currentForm ? <AccountCreation /> : <Login /> }


            <br/>
            <br/>

            <p>{currentForm ? "Already have an account?" : "Don't have an account yet?"}</p>

            <button onClick = {toggleForm}>
                {currentForm ? "Login" : "Sign Up" }
            </button>


        </div>
    );
}

export default App;
