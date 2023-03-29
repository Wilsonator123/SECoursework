
import React, { useState, useEffect } from "react";

export default function HealthDetails({ userID }) {



    const [BMI, setBMI] = useState('3');

    const getBMI = () => {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        console.log("userToken in account page: ");
        console.log(JSON.stringify(tokenString));

        fetch("http://localhost:3001/api/getBMI", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userToken })
        })
            .then((response) => response.json())

            //Check if this is correct? Will need to be updated to notify user
            .then((data) => {
                if (data) {
                    console.log(data);
                    setBMI(data);
                } else {

                }
            })

            .catch((error) => {
                console.error("Error:", error);
            });
        };
    
    //Calls this once to get BMI at loading of page
    useEffect(() => {
        getBMI();
    }, []);


    return (
        <div>
        <p>BMI: {BMI}</p>
        </div>
    );
}