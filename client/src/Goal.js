import React, { useState } from "react";
import "./css/goal.css";

export default function Home() {
    const [showExerciseGoalForm, setShowExerciseGoalForm] = useState(false);
    const [showDietGoalForm, setShowDietGoalForm] = useState(false);

    const handleExerciseGoalClick = () => {
        setShowExerciseGoalForm((prev) => !prev);
    };

    const handleDietGoalClick = () => {
        setShowDietGoalForm((prev) => !prev);
    };

    const handleExerciseFormSubmit = (event) => {
        event.preventDefault();
        // Handle exercise goal form submission
    };

    const handleDietFormSubmit = (event) => {
        event.preventDefault();
        // Handle diet goal form submission
    };

    return (
        <div id="pageContainer">
            <h1> GOAL PAGE </h1>
            <div className="grid-container-goal">
                <div className="goalBox1">
                    <h2>Diet</h2>
                    <button onClick={handleDietGoalClick}>
                        {showDietGoalForm ? "-" : "+"}
                    </button>
                    {showDietGoalForm && (
                        <form onSubmit={handleDietFormSubmit}>
                            <label>
                                Goal Name:
                                <input type="text" />
                            </label>
                            <label>
                                Date Begun:
                                <input type="date" />
                            </label>
                            <label>
                                Date Due:
                                <input type="date" />
                            </label>
                            <label>
                                Weight:
                                <input type="number" />
                            </label>
                            <button type="submit">Submit goal</button>
                        </form>
                    )}
                </div>
                <div className="goalBox2">
                    <h2>Exercise</h2>
                    <button onClick={handleExerciseGoalClick}>
                        {showExerciseGoalForm ? "-" : "+"}
                    </button>
                    {showExerciseGoalForm && (
                        <form onSubmit={handleExerciseFormSubmit}>
                            <label>
                                Goal Name:
                                <input type="text" />
                            </label>
                            <label>
                                Date Begun:
                                <input type="date" />
                            </label>
                            <label>
                                Date Due:
                                <input type="date" />
                            </label>
                            <label>
                                Time:
                                <input type="number" />
                            </label>
                            <label>
                                Distance:
                                <input type="number" />
                            </label>
                            <button type="submit">Submit goal</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
