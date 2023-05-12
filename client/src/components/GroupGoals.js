import React, { useState, useEffect } from "react";
import GoalView from "./goalView";
import "../css/goal.css";

export default function GroupGoals(props) {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);

    const [form, setForm] = useState({
        user_id: tokenString,
        name: "",
        goalType: "",
        group_id: props.group_id,
        current: "",
        target: "",
        start: new Date().toISOString().slice(0, 10),
        end: "",
        notes: "",
    });
    const [showExerciseGoalForm, setShowExerciseGoalForm] = useState(false);
    const [showDietGoalForm, setShowDietGoalForm] = useState(false);
    const [showWeight, setShowWeight] = useState(false);
    const [goal, setGoal] = useState([
        {
            id: "",
            user_id: tokenString,
            name: "",
            goalType: "",
            current: "",
            target: "",
            start: "",
            end: "",
        },
    ]);
    const [loading, setLoading] = useState(false);

    async function getGoals() {
        const response = await fetch(
            "http://localhost:3001/api/getActiveGroupGoals",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: tokenString, group_id: props.group_id }),
            }
        );
        const data = await response.json();
        if (data) {
            setGoal(data);
        } else {
            setGoal([]);
        }
    }




    const checkGoals = () => {
        fetch("http://localhost:3001/api/checkGroupGoals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userToken, group_id: props.group_id}),
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
    };




    const handleExerciseGoalClick = () => {
        setForm({ ...form, goalType: "exercise", target: "" });
        setShowDietGoalForm(false);
        setShowExerciseGoalForm((prev) => !prev);
    };

    const handleDietGoalClick = () => {
        setForm({ ...form, goalType: "diet", target: "" });
        setShowExerciseGoalForm(false);
        setShowDietGoalForm((prev) => !prev);
    };

    const handleChange = (event) => {
        console.log(event.target.name);
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowExerciseGoalForm(false);

        // Handle exercise goal form submission
            fetch("http://localhost:3001/api/createGroupGoal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            })
                .then((res) => res.json())
                .then((data) => console.log(data));
            getGoals();
        
    };


    useEffect(() => {
        checkGoals();
        getGoals();
    }, []);

    return (
        <div><div id="pageContainer2">

            <div className="goalBox2">
            {props.owner && (<div className="goalBox-header">
                    <h2>Exercise</h2>
                    <button
                        onClick={handleExerciseGoalClick}
                        className="form-btn"
                    >
                        {showExerciseGoalForm ? "-" : "+"}
                    </button>
                </div>)}
                {showExerciseGoalForm && (
                    <form onSubmit={handleSubmit} className="exercisegoal-form">
                        <label>
                            Goal Name:
                            <input
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleChange}
                                value={form.name} />
                        </label>
                        <label>
                            Start Date
                            <input
                                type="date"
                                id="start"
                                name="start"
                                onChange={handleChange}
                                value={form.start} />
                        </label>
                        <label>
                            End Date
                            <input
                                type="date"
                                id="end"
                                name="end"
                                onChange={handleChange}
                                value={form.end} />
                        </label>
                        <label>
                            Distance:
                            <input
                                type="number"
                                id="target"
                                name="target"
                                value={form.target}
                                onChange={handleChange} />
                        </label>
                        <button className="submit-btn" type="submit">Submit goal</button>
                    </form>
                )}
            </div>
        </div><div className="goal-Grid">
                <GoalView goal={goal} props={getGoals} />
            </div></div>
        
        
    );
}
