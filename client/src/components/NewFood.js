import React, { useState, useEffect } from "react";


//Used on the Record Meal page to add a new food item
export default function NewFood({getFood}) {

    //Get the user's id stored in session storage
    const tokenString = localStorage.getItem('token');
    
    const userToken = JSON.parse(tokenString);
    console.log(tokenString);


    const [foodMessage, setFoodMessage] = useState();

    const [form, setForm] = useState({
        id: tokenString,
        name: "",
        calories: ""
    });




    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(form);
        fetch("http://localhost:3001/api/recordNewFood", {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json",
            },

        })
            .then((response) => response.json())

            .then((data) => {
        
                
                if (data) {
                    setFoodMessage("Added new food item!");
                    getFood();
                    setForm({
                        name: "",
                        calories: ""
                    });
                    
                    
                } else {
                    setFoodMessage("Failed to add new food item.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setFoodMessage("An error has occurred.");
            });
    };



    
    //Handles updates to all of the data in the form
    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };



    return (
        <div>
            <br/>
            <h2>Add New Food:</h2>
        <form onSubmit={handleSubmit}>


            <label htmlFor="name">Name:</label>
            <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
            />
            
            <br />
  


            <label htmlFor="calories">Calories per 100g:</label>
            <input
                type="number"
                id="calories"
                name="calories"
                value={form.calories}
                min="0"
                onChange={(event) =>
                    setForm({ ...form, calories: parseInt(event.target.value) })
                }
            />

            <br/>

            <button class="food-btn" type="submit">Add Food</button>

            <p>{foodMessage}</p>

        </form>
        </div>
            )
}