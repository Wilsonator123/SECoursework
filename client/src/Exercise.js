import React from "react";
import RecordExercise from "./components/RecordExercise";
import "./css/exercise.css";

export default function Home() {
    return (
        <div id="pageContainer">
            <h1> EXERCISE PAGE </h1>
            <RecordExercise />
        </div>
    );
}
