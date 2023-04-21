import React, { useInsertionEffect } from "react";
import { useState, useEffect } from "react";
import "../css/goal.css";

export default function Home() {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);

    const [goal, setGoal] = useState([
        {
            id: tokenString,
            name: "",
            goalType: "",
            current: "",
            target: "",
            start: "",
            end: "",
        },
    ]);

    const getGoals = () => {
        fetch("http://localhost:3001/api/getActiveGoals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: tokenString }),
        })
            .then((res) => res.json())
            .then((data) => setGoal(data));
    };

    useEffect(() => getGoals(), []);

    return (
        <div className="goal-container">
            {console.log(goal)}
            {goal.map((goal) => {
                return (
                    <div className={`goal-display ${goal.status}`}>
                        <div className="goal-header">
                            <div className="goal-name">{goal.name}</div>
                            <div>-</div>
                            <div className="goal-type">{goal.goalType}</div>
                        </div>
                        <div className="goal-icon">
                            <img src={goal.goalType + ".png"}></img>
                        </div>
                        <div className="goal-progress">
                            Progress:
                            {" " + goal.current + " "}
                            ->
                            {" " + goal.target}
                        </div>
                        <div className="goal-date">
                            {new Date(goal.end).toLocaleDateString("en-GB")}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
