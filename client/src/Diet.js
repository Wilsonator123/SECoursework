import { useState, useEffect } from "react";
import DietForm from "./components/DietForm";
import "./css/diet.css";

/**
 *
 * Show all meals stored
 * Change date to show meals for that day
 * Change length to see meals for that length of time
 *
 */

export default function Diet() {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);

    const [showForm, setShowForm] = useState(false);
    const [meals, setMeals] = useState([
        {
            user_id: tokenString,
            name: "",
            mealType: "",
            calories: "",
            date: "",
        },
    ]);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [size, setSize] = useState(1);

    useEffect(() => {
        getMeals();
    }, [date, size]);

    const getMeals = () => {
        fetch("http://localhost:3001/api/getUserMeals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: tokenString, date: date, size: size }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setMeals(data);
            });
    };

    const renderForm = () => {
        setShowForm(!showForm);
        getMeals();
    };

    const handleChange = (e) => {
        if (e.target.name === "date")
            setDate(e.target.value, () => {
                getMeals();
            });
        else
            setSize(e.target.value, () => {
                getMeals();
            });
    };

    return (
        <div>
            {showForm ? <DietForm onClose={renderForm} /> : null}
            <div>
                <h1>Diet</h1>
                <div className="dietHeader">
                    <h2>Record Meal</h2>
                    <button onClick={renderForm}>Click me</button>
                </div>
                <div id="dietForm" />

                <div id="meals">
                    <form className="dietFilter">
                        <label for="date">Date: </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            onChange={(e) => handleChange(e)}
                            defaultValue={date}
                        />
                        <label for="size">Size</label>
                        <select
                            id="size"
                            name="size"
                            onChange={(e) => handleChange(e)}
                            defaultValue={size}
                        >
                            <option value="1">1 Day</option>
                            <option value="7">1 Week</option>
                            <option value="30">1 Month</option>
                        </select>
                    </form>
                    <table id="dietTable">
                        <thead>
                            <tr>
                                <th>Meal</th>
                                <th>Tag</th>
                                <th>Calories</th>
                                <th>Date</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meals.map((meal) => {
                                return (
                                    <tr id={meal.id}>
                                        <td>{meal.name}</td>
                                        <td className={meal.mealType}>
                                            {meal.mealType}
                                        </td>
                                        <td>{meal.calories}</td>
                                        <td>
                                            {new Date(
                                                meal.date
                                            ).toLocaleDateString("en-GB")}
                                        </td>
                                        <td>
                                            <button className="viewMeal">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr>
                                <td>Total</td>
                                <td>{meals.length}</td>
                                <td>
                                    {meals.reduce((a, b) => {
                                        return a + b.calories;
                                    }, 0)}
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
