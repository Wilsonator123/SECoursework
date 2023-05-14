import HealthDetails from "./components/HealthDetails";
import RecordWeight from "./components/RecordWeight";
import "./css/Account.css";
import "./css/index.css";

import React, { useState, useEffect } from "react";

export default function Account({ userID }) {
    //Used to get all exercises a user has done

    const [userExercises, setUserExercises] = useState([]);
    const [userMeals, setUserMeals] = useState([]);
    const [user, setUser] = useState([[]]);

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
                size: 1,
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

    const getUser = () => {
        fetch("http://localhost:3001/api/getUser", {
            method: "POST",
            body: JSON.stringify({ id: userToken }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
                if (data) {
                    console.log(data[0].username);
                    setUser(data);
                } else {
                    alert("Could not find user.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    useEffect(() => {
        getUser();
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
            <div class="grid-container-accountpage">
                <div class="profile-box">
                    <h1>
                    <img className="jerry" src="./jerry2.png" alt="" /> 
                        Welcome {user[0].username} 
                        <img className="jerry" src="./jerry.png" alt="" /> 
                    </h1> 
                               
                </div>

                <div class="bmi-box">
                    <h2>Health Details</h2>
                    <HealthDetails userID={userID} />
                </div>

                <div class="group-box">
                    <RecordWeight />
                </div>
                <br />
                <br />

                <div class="date-box">
                <h2>
                    <a id="prev" value="prev" onClick={goToPrevDay}>
                        <i value="prev" className="fa-light fa-less-than" />
                    </a>
                    {"  "}
                    {date.toLocaleDateString("en-GB")}
                    <a id="next" data-value="next" onClick={goToNextDay}>
                        <i value="next" className="fa-light fa-greater-than" />
                    </a>
                </h2>
                </div>

                <br />
                <br />

                <div class="exerciseHistory-box">
                    <h2>Exercise History:</h2>

                    {/*Gets the exercises and maps them in divs*/}
                    {userExercises.map((userExercise) => (
                        <div key={userExercise.id}>
                            <br />
                            <p>{userExercise.name}</p>
                            <p>
                                {userExercise.activity_name}:{" "}
                                {userExercise.time} {"mins"}
                            </p>
                        </div>
                    ))}
                </div>

                <div class="mealHistory-box">
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
                            ((userMeal.foodAmount / 100) *
                                userMeal.food_calories +
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
        </div>
    );
}
