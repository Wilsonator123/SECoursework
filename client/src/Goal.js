import React, { useState, useEffect } from "react";
import GoalView from "./components/goalView";
import "./css/goal.css";
import "./css/index.css";

export default function Home() {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);

    const [form, setForm] = useState({
        user_id: tokenString,
        name: "",
        goalType: "",
        current: "",
        target: "",
        start: new Date().toISOString().slice(0, 10),
        end: "",
        notes: "",
    });


    //Group goal stuff
    const [groupGoalForm, setGroupGoalForm] = useState({
        goal_id: ""
    });

    const [showGroupGoalForm, setShowGroupGoalForm] = useState(false);


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

    //For adding a group goal by email
    const addGoalViaEmail = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const groupGoalID = urlParams.get("id");
        

        if (groupGoalID !== null) {
            console.log(groupGoalID);

            fetch("http://localhost:3001/api/addGoalViaEmail", {
                method: "POST",
                body: JSON.stringify({
                    goal_id: groupGoalID,
                    user_id: userToken
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())

                .then((data) => {
                    console.log(data);
                    if (typeof data === "boolean" && data) {
                        alert("Goal Added!");
                        getGoals();
                    } else {
                        alert(data.error);
                    }
                })
                .catch((error) => {
                    alert("Error in adding goal.");
                });
        }
    };

    async function getGoals() {
        const response = await fetch(
            "http://localhost:3001/api/getActiveGoals",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: tokenString }),
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
        fetch("http://localhost:3001/api/checkGoals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userToken }),
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
    };

    const handleExerciseGoalClick = () => {
        setForm({ ...form, goalType: "exercise", target: "" });
        setShowDietGoalForm(false);
        setShowGroupGoalForm(false);
        setShowExerciseGoalForm((prev) => !prev);
    };

    const handleDietGoalClick = () => {
        setForm({ ...form, goalType: "diet", target: "" });
        setShowExerciseGoalForm(false);
        setShowGroupGoalForm(false);
        setShowDietGoalForm((prev) => !prev);
    };


    const handleGroupGoalClick = () => {
        setShowExerciseGoalForm(false);
        setShowDietGoalForm(false);
        setShowGroupGoalForm((prev) => !prev);
    };


    const handleChange = (event) => {
        console.log(event.target.name);
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };


    const handleGroupGoalChange = (event) => {
        console.log(event.target.name);
        setGroupGoalForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowDietGoalForm(false);
        setShowExerciseGoalForm(false);
        if (form.goalType === "diet") {
            setShowWeight(true);
            document.getElementById("weight-modal").style.display = "flex";
        } else {
            // Handle exercise goal form submission
            fetch("http://localhost:3001/api/createGoal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            })
                .then((res) => res.json())
                .then((data) => console.log(data));
            getGoals();
        }
    };

    const handleDietSubmit = () => {
        console.log(form);
        // Handle diet goal form submission
        fetch("http://localhost:3001/api/createGoal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err));

        setShowWeight(false);
        document.getElementById("weight-modal").style.display = "none";

        getGoals();
    };



    const handleGroupGoalSubmit = () => {
        console.log(groupGoalForm);
        // Handle diet goal form submission
        if (groupGoalForm.goal_id !== null) {
            fetch("http://localhost:3001/api/addGoalViaEmail", {
                method: "POST",
                body: JSON.stringify({
                    goal_id: groupGoalForm.goal_id,
                    user_id: userToken
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())

                .then((data) => {
                    console.log(data);
                    if (typeof data === "boolean" && data) {
                        alert("Goal Added!");
                        getGoals();
                    } else {
                        alert(data.error);
                    }
                })
                .catch((error) => {
                    alert("Error in adding goal.");
                });
        } else {
            alert("Group Goal form not filled in. Fill in and try again");
        }

    };

    useEffect(() => {
        checkGoals();
        getGoals();
        addGoalViaEmail();
    }, []);

    return (
        <div id="pageContainer">
            <h1> GOAL PAGE </h1>
            <div className="grid-container-goal">
                <div id="weight-modal">
                    {showWeight && (
                        <form onSubmit={handleDietSubmit} id="weight-form">
                            <label className="weight-modal">
                                Enter current weight
                            </label>
                            <input
                                type="number"
                                id="current"
                                name="current"
                                min="1"
                                value={form.current}
                                onChange={handleChange}
                            />
                            <button class="submit-btn"type="submit">Submit</button>
                        </form>
                    )}
                </div>
                <div className="goalBox1">
                    <div className="goalBox-header">
                        <h2>Diet</h2>
                        <button
                            onClick={handleDietGoalClick}
                            className="form-btn"
                        >
                            {showDietGoalForm ? "-" : "+"}
                        </button>
                    </div>
                    {showDietGoalForm && (
                        <form onSubmit={handleSubmit} className="goal-form">
                            <label>
                                Goal Name:
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    onChange={handleChange}
                                    value={form.name}
                                />
                            </label>
                            <label>
                                Start Date:
                                <input
                                    type="date"
                                    id="start"
                                    name="start"
                                    onChange={handleChange}
                                    value={form.start}
                                />
                            </label>
                            <label>
                                End Date:
                                <input
                                    type="date"
                                    id="end"
                                    name="end"
                                    onChange={handleChange}
                                    value={form.end}
                                />
                            </label>
                            <label>
                                Target Weight (kg):
                                <input
                                    type="number"
                                    id="target"
                                    name="target"
                                    min="1"
                                    value={form.target}
                                    onChange={handleChange}
                                />
                            </label>
                            <button class="submit-btn" type="submit">Submit goal</button>
                        </form>
                    )}
                </div>
                <div className="goalBox2">
                    <div className="goalBox-header">
                        <h2>Exercise</h2>
                        <button
                            onClick={handleExerciseGoalClick}
                            className="form-btn"
                        >
                            {showExerciseGoalForm ? "-" : "+"}
                        </button>
                    </div>
                    {showExerciseGoalForm && (
                        <form onSubmit={handleSubmit} className="exercisegoal-form">
                            <label>
                                Goal Name:
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    onChange={handleChange}
                                    value={form.name}
                                />
                            </label>
                            <label>
                                Start Date
                                <input
                                    type="date"
                                    id="start"
                                    name="start"
                                    onChange={handleChange}
                                    value={form.start}
                                />
                            </label>
                            <label>
                                End Date
                                <input
                                    type="date"
                                    id="end"
                                    name="end"
                                    onChange={handleChange}
                                    value={form.end}
                                />
                            </label>
                            <label>
                                Distance (m):
                                <input
                                    type="number"
                                    id="target"
                                    name="target"
                                    value={form.target}
                                    min="1"
                                    onChange={handleChange}

                                />
                            </label>
                            <button class="submit-btn" type="submit">Submit goal</button>
                        </form>
                    )}
                </div>
            </div>

            <br/>

            <div className="goalBox1">
                    <div className="goalBox-header">
                        <h2>Group Goal</h2>
                        <button
                            onClick={handleGroupGoalClick}
                            className="form-btn"
                        >
                            {showGroupGoalForm ? "-" : "+"}
                        </button>
                    </div>
                    {showGroupGoalForm && (
                        <form onSubmit={handleGroupGoalSubmit} className="goal-form">
                            <label>
                                Goal Code:
                                <input
                                    type="number"
                                    id="goal_id"
                                    name="goal_id"
                                    value={groupGoalForm.goal_id}
                                    onChange={handleGroupGoalChange}
                                />
                            </label>
                            <button class="submit-btn"type="submit">Add Group Goal</button>
                        </form>
                    )}
                </div> 
                <h1 className="goals-title"> Your Goals </h1>

            <div className="goal-Grid">
                <GoalView goal={goal} props={getGoals} />
            </div> 
    
        </div>
    );
}
