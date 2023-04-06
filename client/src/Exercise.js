
import React from "react";
import RecordExercise from "./components/RecordExercise";
import "./css/Exercise.css";

export default function Home() {
    return (
        <div id="pageContainer">
            <h1> EXERCISE PAGE </h1> 
            <div class=".grid-container-exercise ">
                <div class="exercise-box">
                    <RecordExercise /> 
                </div>
            </div>
        </div>
    );
}
