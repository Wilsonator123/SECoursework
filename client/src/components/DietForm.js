import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactDom from "react-dom";
import NewFood from "./NewFood";
import NewDrink from "./NewDrink";
import "../css/diet.css";

function DietForm({ onClose }) {
    const navigate = useNavigate();

    //Get the user's id stored in session storage
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);

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
    const [foodError, setFoodError] = useState("");
    const [drinkError, setDrinkError] = useState("");

    //Update the foods when food changes (will be used when a new one added)

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
                if (data.length) {
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
                if (data.length) {
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
                    onClose();
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
    const handleFoodChange = (event) => {
        event.preventDefault();
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
        fetch("http://localhost:3001/api/getFood", {
            method: "POST",
            body: JSON.stringify({ id: userToken, food: event.target.value }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
                if (data.length != 0) {
                    console.log(data);
                    setFood(data);
                    setFoodError("");
                } else {
                    setFoodError("Select Valid Food");
                    setFood([]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    const handleDrinkChange = (event) => {
        event.preventDefault();
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
        fetch("http://localhost:3001/api/getDrink", {
            method: "POST",
            body: JSON.stringify({ id: userToken, drink: event.target.value }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
                if (data.length != 0) {
                    setDrink(data);
                    setDrinkError("");
                } else {
                    setDrinkError("Select Valid Drink");
                    setDrink([]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleClose = () => {
        onClose();
    };

    return ReactDom.createPortal(
        <div
            id="dietPageContainer"
            onClick={() => {
                setFood([]);
                setDrink([]);
            }}
        >
            <div class="grid-container-diet">
                < div class="dietBox1"> 
                    <button className="close-btn" onClick={handleClose}>
                        <i class="fa-solid fa-xmark fa-xl"></i>
                    </button> 
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
                            class="mealType"
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
                            type="text"
                            id="food"
                            name="food"
                            value={form.food}
                            onChange={handleFoodChange}
                        ></input>
                        {foodError && <p id="foodError">{foodError}</p>}
                        <div class="fdResults">
                            {food.map((value, key) => {
                                return (
                                    <a
                                        key={key}
                                        class="fdResult"
                                        onClick={() => {
                                            setForm({
                                                ...form,
                                                food: value.name,
                                            });
                                            setFood([]);
                                        }}
                                    >
                                        {value.name}
                                    </a>
                                );
                            })}
                        </div>
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
                        <input
                            type="text"
                            id="drink"
                            name="drink"
                            value={form.drink}
                            onChange={handleDrinkChange}
                        ></input>

                        {drinkError && <p id="drinkError">{drinkError}</p>}

                        <div class="fdResults">
                            {drink.map((value, key) => {
                                return (
                                    <a
                                        class="fdResult"
                                        onClick={() => {
                                            setForm({
                                                ...form,
                                                drink: value.name,
                                            });
                                            setDrink([]);
                                        }}
                                    >
                                        {value.name}
                                    </a>
                                );
                            })}
                        </div>

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
                        <div className="center-btn">
                        <button class="meal-btn" type="submit">
                            Record Meal
                        </button> 
                        </div>
                    </form>
                </div>
                <div class="dietBox2">
                    <NewFood getFood={getFood} />
                </div>
                <div class="dietBox3">
                    <NewDrink getDrink={getDrink} />
                </div>
            </div>
        </div>,
        document.getElementById("dietForm")
    );
}

export default DietForm;
