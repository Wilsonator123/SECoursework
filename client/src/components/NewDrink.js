import React, { useState, useEffect } from "react";


//Used on the Record Meal page to add a new drink item
export default function NewFood({getDrink}) {

    //Get the user's id stored in session storage
    const tokenString = localStorage.getItem('token');
    
    const userToken = JSON.parse(tokenString);
    console.log(tokenString);


    const [drinkMessage, setDrinkMessage] = useState();

    const [form, setForm] = useState({
        id: tokenString,
        name: "",
        calories: ""
    });




    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(form);
        fetch("http://localhost:3001/api/recordNewDrink", {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json",
            },

        })
            .then((response) => response.json())

            .then((data) => {
        
                
                if (data) {
                    setDrinkMessage("Added new food item!");
                    getDrink();
                    setForm({
                        name: "",
                        calories: ""
                    });
                    
                    
                } else {
                    setDrinkMessage("Failed to add new food item.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setDrinkMessage("An error has occurred.");
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
            <h2>Add New Drink:</h2>
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
  


            <label htmlFor="calories">Calories per 100ml:</label>
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

            <button class="drink-btn" type="submit">Add Drink</button>

            <p>{drinkMessage}</p>

        </form>
        </div>
            )
}