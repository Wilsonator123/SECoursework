
import React from "react";
import HealthDetails from "./components/HealthDetails";


export default function Account({ userID }) {

    

    return (
        <div id="pageContainer">
            <h1> ACCOUNT PAGE </h1>

            <div>
                <h2>Health Details</h2>
                <HealthDetails userID={userID}/>
            </div>
        </div>
    );
}
