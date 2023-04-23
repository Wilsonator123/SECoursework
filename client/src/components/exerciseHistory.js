import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactDom from "react-dom";
import "../css/exercise.css";

function RecordExercise({ onClose }) {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);

    const [exercise, setExercise] = useState([]);

    const getExercise = () => {
        fetch("http://localhost:3001/api/getExercises", {
            method: "POST",
            body: JSON.stringify({ id: userToken }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setExercise(data);
            });
    };
    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        getExercise();
    }, []);

    return ReactDom.createPortal(
        <div id="exerciseHistory">
            <table id="exerciseTable">
                <button className="close-btn" onClick={handleClose}>
                    <i class="fa-solid fa-xmark fa-xl"></i>
                </button>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Activity</th>
                        <th>Time</th>
                        <th>Distance</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {exercise.map((exercise) => (
                        <tr key={exercise.id}>
                            <td>{exercise.name}</td>
                            <td>{exercise.type}</td>
                            <td>{exercise.time}</td>
                            <td>{exercise.distance}</td>
                            <td>{exercise.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>,
        document.getElementById("exerciseHistoryDisp")
    );
}

export default RecordExercise;
