import React from "react";
import { useState, useEffect } from "react";

import Chart from "./components/exerciseChart";

import RecordExercise from "./components/RecordExercise";
import "./css/Exercise.css";

export default function Home() {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    const [days, setDays] = useState([]);

    const [showForm, setShowForm] = useState(false);

    async function getDays() {
        const response = await fetch(
            "http://localhost:3001/api/getWeeklyExercise",
            {
                method: "POST",
                body: JSON.stringify({ id: tokenString }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await response.json();
        console.log("test" + data.days);
        if (data) {
            setDays(data.days);
        } else {
            alert("Failed to get exercise data.");
        }
    }

    const renderForm = () => {
        setShowForm(!showForm);
    };

    useEffect(() => {
        getDays();
    }, []);

    return (
        <div id="pageContainer">
            {showForm ? <RecordExercise onClose={renderForm} /> : null}
            <h1> EXERCISE PAGE </h1>
            <div className=".grid-container-exercise ">
                <button className="exercise-button" onClick={renderForm}>
                    New Exercise
                </button>
                <div id="exerciseForm" />
                <div id="exerciseGrid">
                    <Chart {...days} />
                </div>
            </div>
        </div>
    );
}
