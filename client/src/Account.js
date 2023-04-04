
import HealthDetails from "./components/HealthDetails";
import MealHistory from "./components/MealHistory";

import React, { useState, useEffect } from "react";

export default function Account({ userID }) {

    //Used to get all exercises a user has done
    const [userExercises, setUserExercises] = useState([]);


    //Used to get users id from session storage
    const tokenString = localStorage.getItem('token');
    
    const userToken = JSON.parse(tokenString);


    //Fetch a list of all the exercises
    useEffect(() => {
        fetch("http://localhost:3001/api/getUserExercises", {
            method: "POST",
            body: JSON.stringify({userToken}),
            headers: {
                "Content-Type": "application/json",
            },

        })

        .then((response) => response.json())

        .then((data) => {

        if (data) {
            console.log(data);
            setUserExercises(data);
            console.log(userExercises);       
            } else {
                    alert("Could not find exercises for this user.")
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            
        }, []);











    return (
        <div id="pageContainer">
            <h1> ACCOUNT PAGE </h1>

            <div>
                <h2>Health Details</h2>
                <HealthDetails userID={userID}/>
            </div>

            <br/><br/>





            <div>
                <h2>Exercise History:</h2>

                {/*Gets ALL the exercises and maps them in divs*/}
                {userExercises.map(userExercise => 
                (
                    <div key={userExercise.id}>
                        <p>{userExercise.name}</p>
                        <p>{userExercise.activity_name}: {userExercise.quantity} {userExercise.measurement}</p>
                        <p>Date: {userExercise.date}</p>
                        <br/>
                    </div>
                ))}
                
            </div>


            <br/><br/>

            <div>
                <h2>Meal History</h2>
                {/*<MealHistory />*/}

            </div>   

        </div>
    );
}
