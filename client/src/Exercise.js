import React from "react";
import { useState } from "react";
import RecordExercise from "./components/RecordExercise";
import "./css/Exercise.css";

export default function Home() {
    const [showForm, setShowForm] = useState(false);

    const renderForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div id="pageContainer">
            {showForm ? <RecordExercise onClose={renderForm} /> : null}
            <h1> EXERCISE PAGE </h1>
            <div class=".grid-container-exercise ">
                <button class="exercise-button" onClick={renderForm}>
                    New Exercise
                </button>
                <div id="exerciseForm" />
                <div id="exerciseGrid"></div>
            </div>
        </div>
    );
}
