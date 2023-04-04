import "./css/App.css";
import { useState } from "react";
import AccountCreation from "./components/AccountCreation";

function App() {
    return (
        <div id="pageContainer">
            <h1> CREATE ACCOUNT </h1> 
            <div class="grid-container-app">
            <div class="app-box">
                <div class="form-box-app">
                    <AccountCreation />  
                </div>
            </div>
            </div>
        </div>
    );
}

export default App;
