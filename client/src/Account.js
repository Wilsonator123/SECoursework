import HealthDetails from "./components/HealthDetails";

import React, { useState, useEffect } from "react";

export default function Account({ userID }) {
    //Used to get all exercises a user has done
    const [userExercises, setUserExercises] = useState([]);
    const [userMeals, setUserMeals] = useState([]);

    //Used to get the date for which we want to view exercises and meals
    const [date, setDate] = useState(new Date());

    //Used to get users id from session storage
    const tokenString = localStorage.getItem("token");

    const userToken = JSON.parse(tokenString);

    //Fetch a list of all the exercises on the current date
    const getExercise = (date) => {
        fetch("http://localhost:3001/api/getUserExercises", {
            method: "POST",
            body: JSON.stringify({
                id: userToken,
                date: date.toISOString().slice(0, 10),
            }),
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
                    alert("Could not find exercises for this user.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const getMeals = (date) => {
        fetch("http://localhost:3001/api/getUserMeals", {
            method: "POST",
            body: JSON.stringify({
                id: userToken,
                date: date.toISOString().slice(0, 10),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
                if (data) {
                    console.log(data);
                    setUserMeals(data);
                } else {
                    alert("Could not find meals for this user.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    useEffect(() => {
        getExercise(date);
        getMeals(date);
    }, []);

    //Change the date for which we get exercises and meals when
    //arrow buttons are pressed
    //Keep it in the lovely DD-MM-YYYY format
    const goToPrevDay = () => {
        const prevDay = new Date(date.getTime() - 24 * 60 * 60 * 1000);
        setDate(prevDay);
        getExercise(prevDay);
        getMeals(prevDay);
    };

    const goToNextDay = () => {
        const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        setDate(nextDay);
        getExercise(nextDay);
        getMeals(nextDay);
    };

    return (
        <div id="pageContainer">
            <h1> ACCOUNT PAGE </h1>

            <div>
                <h2>Health Details</h2>
                <HealthDetails userID={userID} />
            </div>

            <br />
            <br />

            <div>
                <button onClick={goToPrevDay}> Previous </button>
                <p>Date: {date.toLocaleDateString("en-GB")}</p>
                <button onClick={goToNextDay}> Next </button>
            </div>

            <br />
            <br />

            <div>
                <h2>Exercise History:</h2>

                {/*Gets the exercises and maps them in divs*/}
                {userExercises.map((userExercise) => (
                    <div key={userExercise.id}>
                        <br />
                        <p>{userExercise.name}</p>
                        <p>
                            {userExercise.activity_name}:{" "}
                            {userExercise.quantity} {userExercise.measurement}
                        </p>
                    </div>
                ))}
            </div>

            <br />
            <br />

            <div>
                <h2>Meal History: </h2>

                {userMeals.map((userMeal) => (
                    <div key={userMeal.id}>
                        <br />
                        <p style={{ display: "inline" }}>
                            {userMeal.mealType}: {userMeal.name}
                        </p>
                        <br />
                        <p style={{ display: "inline" }}>
                            {userMeal.food_name}:{" "}
                            {(userMeal.foodAmount / 100) *
                                userMeal.food_calories}{" "}
                            kcals
                        </p>
                        <br />
                        <p style={{ display: "inline" }}>
                            {userMeal.drink_name}:{" "}
                            {(userMeal.drinkAmount / 100) *
                                userMeal.drink_calories}{" "}
                            kcals
                        </p>
                        <br />
                    </div>
                ))}

                {userMeals.reduce(
                    (total, userMeal) =>
                        total +
                        ((userMeal.foodAmount / 100) * userMeal.food_calories +
                            (userMeal.drinkAmount / 100) *
                                userMeal.drink_calories),
                    ""
                ) && (
                    <div>
                        <br />
                        <p>
                            Total:{" "}
                            {userMeals.reduce(
                                (total, userMeal) =>
                                    total +
                                    ((userMeal.foodAmount / 100) *
                                        userMeal.food_calories +
                                        (userMeal.drinkAmount / 100) *
                                            userMeal.drink_calories),
                                0
                            )}{" "}
                            kcals
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
