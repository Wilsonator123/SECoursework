import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewFood from "./components/NewFood";
import NewDrink from "./components/NewDrink";
import "./css/diet.css";

export default function Diet() {
    const navigate = useNavigate();

    //Get the user's id stored in session storage
    const tokenString = localStorage.getItem("token");
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
        drinkAmount: "",
    });

    //Gonna get a list of foods from DB
    //And also the list of drinks
    const [food, setFood] = useState([]);
    const [drink, setDrink] = useState([]);

    //Update the foods when food changes (will be used when a new one added)
    useEffect(() => {
        getFood();
        getDrink();
    }, []);

    const getFood = () => {
        fetch("http://localhost:3001/api/getFood", {
            method: "POST",
            body: JSON.stringify({ userToken }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
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

    const getDrink = () => {
        fetch("http://localhost:3001/api/getDrink", {
            method: "POST",
            body: JSON.stringify({ userToken }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
                if (data) {
                    setDrink(data);
                } else {
                    alert("Cannot get drink");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    //Used to record a new meal
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
    const handleFoodChange = (event) => {};

    return (
        <div id="pageContainer">
            <h1> DIET PAGE </h1>
            <div class="grid-container-diet">
                <div class="dietBox1">
                    <h2>Record Meal</h2>
                    <form class="meal-form" onSubmit={handleSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />

                        <br />

                        <label htmlFor="mealType">Meal Type: </label>
                        <select
                            name="mealType"
                            value={form.mealType}
                            onChange={handleChange}
                        >
                            <option disabled value="">
                                Select
                            </option>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                        </select>

                        <br />

                        <label htmlFor="food">Food:</label>
                        <input
                            name="food"
                            type="text"
                            value={form.food}
                            onChange={handleFoodChange}
                        ></input>

                        <br />

                        <label htmlFor="quantity">Quantity (grams):</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={form.foodAmount}
                            min="0"
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    foodAmount: parseInt(event.target.value),
                                })
                            }
                        />

                        <br />

                        <label htmlFor="drink">Drink:</label>
                        <select
                            name="drink"
                            type="number"
                            value={form.drink}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    drink: parseInt(event.target.value),
                                })
                            }
                        >
                            <option disabled value="">
                                Select
                            </option>

                            {/*Gets ALL the activities and maps them in a list*/}
                            {drink.map((drink) => (
                                <option key={drink.id} value={drink.id}>
                                    {drink.name}
                                </option>
                            ))}
                        </select>

                        <br />

                        <label htmlFor="quantity">Quantity (ml):</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={form.drinkAmount}
                            min="0"
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    drinkAmount: parseInt(event.target.value),
                                })
                            }
                        />

                        <br />

                        <button class="meal-btn" type="submit">
                            Record Meal
                        </button>
                    </form>
                </div>
                <div class="dietBox2">
                    <NewFood getFood={getFood} />
                </div>
                <div class="dietBox3">
                    <NewDrink getDrink={getDrink} />
                </div>
            </div>
        </div>
    );
}
