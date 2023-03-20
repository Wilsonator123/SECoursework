import "./css/App.css";
import { useState } from "react";
import AccountCreation from "./components/AccountCreation";

function App() {

    return (
        <div id="pageContainer">
            <h1> CREATE ACCOUNT </h1>
            <AccountCreation />
        </div>
    );
}

export default App;
