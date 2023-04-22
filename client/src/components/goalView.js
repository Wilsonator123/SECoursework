import React from "react";
import useState from "react";
import "../css/goal.css";

export default function Home(data, props) {
    const reActivate = (reActivate, goal_id) => {
        fetch("http://localhost:3001/api/reActivateGoal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reactivate: reActivate,
                goalID: goal_id,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                props.getGoals();
            });
    };

    const goal = data.goal;
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
                        {goal.status === "EXPIRED" && (
                            <div className="expired-btn">
                                <button
                                    onClick={() => reActivate(true, goal.id)}
                                >
                                    Reactivate Goal
                                </button>
                                <button
                                    onClick={() => reActivate(false, goal.id)}
                                >
                                    Delete Goal
                                </button>
                            </div>
                        )}
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
