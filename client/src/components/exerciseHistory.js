import react from "react";
import { useState, useEffect } from "react";

function RecordExercise() {
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

    useEffect(() => {
        getExercise();
    }, []);

    return (
        <div>
            <h1>Exercise</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Activity</th>
                        <th>Time</th>
                        <th>Distance</th>
                    </tr>
                </thead>
                <tbody>
                    {exercise.map((exercise) => (
                        <tr key={exercise.id}>
                            <td>{exercise.name}</td>
                            <td>{exercise.type}</td>
                            <td>{exercise.time}</td>
                            <td>{exercise.distance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RecordExercise;
