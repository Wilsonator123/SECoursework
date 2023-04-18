import React from "react";
import { useState, useEffect } from "react";

import Chart from "./components/exerciseChart";

import RecordExercise from "./components/RecordExercise";
import ExerciseHistory from "./components/exerciseHistory";
import "./css/Exercise.css";

export default function Home() {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    const [days, setDays] = useState();
    const [date, setDate] = useState(new Date());

    const [showForm, setShowForm] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [body, setBody] = useState({ SOW: "", EOW: "" });

    const getWeek = () => {
        let today = date;
        let startOfWeek = new Date(
            today.getTime() - today.getDay() * 24 * 60 * 60 * 1000
        );
        let temp = new Date(startOfWeek);

        let day = temp.getDate().toString().padStart(2, "0");
        let month = (temp.getMonth() + 1).toString().padStart(2, "0");
        let SOW = day + "/" + month;
        temp = new Date(temp.setDate(temp.getDate() + 6));
        day = temp.getDate().toString().padStart(2, "0");
        month = (temp.getMonth() + 1).toString().padStart(2, "0");
        let EOW = day + "/" + month;
        setBody({ ...body, SOW, EOW });
        console.log(body.SOW);
    };

    async function getDays(event) {
        console.log("Date: " + date);
        if (event !== undefined) {
            const target = event.target;
            const attribute = target.getAttribute("value");

            if (attribute === "prev") {
                setDate(new Date(date.setDate(date.getDate() - 7)));
            } else if (attribute === "next") {
                setDate(new Date(date.setDate(date.getDate() + 7)));
            }
        }
        const response = await fetch(
            "http://localhost:3001/api/getWeeklyExercise",
            {
                method: "POST",
                body: JSON.stringify({ id: tokenString, date: date }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await response.json();
        console.log("test " + data);
        if (data) {
            setDays(data);
            getWeek();
        } else {
            alert("Failed to get exercise data.");
        }
    }

    const renderForm = () => {
        setShowForm(!showForm);
    };

    const renderHistory = () => {
        setShowHistory(!showHistory);
    };

    useEffect(() => {
        getDays();
        getWeek();
    }, []);

    return (
        <div id="pageContainer">
            {showForm ? <RecordExercise onClose={renderForm} /> : null}
            {showHistory ? <ExerciseHistory onClose={renderHistory} /> : null}
            <h1> EXERCISE PAGE </h1>
            <div className=".grid-container-exercise ">
                <div className="exerciseButtons">
                    <button className="exercise-btn" onClick={renderForm}>
                        New Exercise
                    </button>
                    <button className="exercise-btn" onClick={renderHistory}>
                        Audit Log
                    </button>
                </div>
                <div id="exerciseForm" />
                <h1>
                    <a id="prev" value="prev" onClick={getDays}>
                        <i value="prev" className="fa-light fa-less-than" />
                    </a>
                    {"  "}
                    {body.SOW + "-" + body.EOW + " "}{" "}
                    <a id="next" data-value="next" onClick={getDays}>
                        <i value="next" className="fa-light fa-greater-than" />
                    </a>
                </h1>
                <div id="exerciseGrid">
                    <Chart {...days} />
                </div>
            </div>
        </div>
    );
}
