
import React, { useState, useEffect } from "react";

export default function MealHistory() {

    //Used to get meals from a specific date
    const [meals, setMeals] = useState([]);
    const [date, setDate] = useState(new Date());


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
            setMeals(data);
            console.log(meals);       
            } else {
                    alert("Could not find mealsfor this user.")
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            
        }, []);





        return (

            <div>
                      
                {/*Gets ALL the meals for the current day and maps them in divs*/}
                {meals.map(meal=> (
                    <div key={meal.id}>
                        <p>{meal.name}</p>
                        <p>{meal.activity_name}: {meal.quantity} {meal.measurement}</p>
                        <p>Date: {date}</p>
                        <br/>
                    </div>
                ))}
                 
    
            </div>
        );

}