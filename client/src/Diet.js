import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Diet() {


    const navigate = useNavigate();



    //Get the user's id stored in session storage
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log(tokenString);



    //Form for submitting a meal
    const [form, setForm] = useState({
        user_id: tokenString,
        name: "",
        mealType: "",
        food: "",
        foodAmount: "",
        drink: "",
        drinkAmount: ""
    });


    //Gonna get a list of foods from DB
    const [food, setFood] = useState([]);


    const getFood = () => {
        fetch("http://localhost:3001/api/getFood", {
            method: "POST",
            body: JSON.stringify({userToken}),
            headers: {
                "Content-Type": "application/json",
            },

        })
            .then((response) => response.json())

            .then((data) => {
                 
                //May need to be updated to another page
                if (data) {
                    
                    setFood(data);
                    
                } else {
                    alert("Cannot get food");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };




    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(form);
        fetch("http://localhost:3001/api/recordMeal", {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json",
            },

        })
            .then((response) => response.json())

            .then((data) => {
                //May need to be updated to another page
                if (data) {
                    alert("Recorded successfully!");
                    navigate("/Account");
                    
                } else {
                    alert("Failed to record.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("ERROR");
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
        <div id="pageContainer">
            <h1> DIET PAGE </h1>


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



            <label htmlFor="food">Food:</label>
            <select name="food" type="number" value={form.food} onChange={(event) =>
                    setForm({ ...form, food: parseInt(event.target.value) })
                }>
                    
                    <option disabled value="">Select</option>

                    {/*Gets ALL the activities and maps them in a list*/}
                    {food.map(food => (
                        <option key={food.id} value={food.id}>
                        {food.name}
                    </option>
                     ))}


            </select>        


            <br/>
            <button type="submit">Record Meal</button>

        </form>
            
        </div>
    );





    
}
