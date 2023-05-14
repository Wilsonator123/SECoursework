import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactDom from "react-dom";
import "../css/exercise.css";

//Used on the Exercise page to record a new exercise
function RecordExercise({ onClose }) {
    const navigate = useNavigate();

    //Get the user's id stored in session storage
    const tokenString = localStorage.getItem("token");

    const userToken = JSON.parse(tokenString);
    console.log(tokenString);

    const [form, setForm] = useState({
        id: tokenString,
        name: "",
        activity: "",
        time: "",
        distance: "",
    });

    //Gonna get a list of activities from DB to put in form
    const [activities, setActivities] = useState([]);
    const [showDistance, setShowDistance] = useState(false);

    //At creatiom of form, get all activities in here!
    useEffect(() => {
        fetch("http://localhost:3001/api/getActivities")
            .then((response) => response.json())
            .then((data) => setActivities(data));
    }, []);

    const getActivity = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
        fetch("http://localhost:3001/api/getActivity", {
            method: "POST",
            body: JSON.stringify({ name: event.target.value }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    console.log("Here" + data.type);
                    if (data[0].type == 1) {
                        setShowDistance(true);
                    } else {
                        setShowDistance(false);
                    }
                } else {
                    alert("Failed to get activity.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("ERROR");
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(form);
        fetch("http://localhost:3001/api/recordExercise", {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
                //May need to be updated to another page
                if (data) {
                    alert("Recorded successfully!");
                    handleClose();
                } else {
                    alert("Failed to record.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("ERROR");
            });
    };

    //Handles updates to all of the data in the form
    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    //Handles the closing of the modal
    const handleClose = () => {
        onClose();
    };

    return ReactDom.createPortal(
        <div className="exercise-box">
            <button className="close-btn" onClick={handleClose}>
                <i class="fa-solid fa-xmark fa-xl"></i>
            </button> 
            <form class="exercise-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                />

                <br />

                <label htmlFor="activity">Activity:</label>
                <select
                    name="activity"
                    type="number"
                    value={form.activity}
                    onChange={getActivity}
                >
                    <option disabled value="">
                        Select
                    </option>

                    {/*Gets ALL the activities and maps them in a list*/}
                    {activities.map((activity) => (
                        <option key={activity.id} value={activity.id}>
                            {activity.name}
                        </option>
                    ))}
                </select>

                <br />
                <label htmlFor="time">Time (m):</label>
                <input
                    type="number"
                    id="time"
                    name="time"
                    value={form.time}
                    min="0"
                    onChange={(event) =>
                        setForm({
                            ...form,
                            time: parseInt(event.target.value),
                        })
                    }
                />

                <br />
                {showDistance && (
                    <div>
                        <label htmlFor="distance">Distance (km):</label>
                        <input
                            type="number"
                            id="distance"
                            name="distance"
                            value={form.distance}
                            min="0"
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    distance: parseInt(event.target.value),
                                })
                            }
                        />
                    </div>
                )}

                <br /> 
                <div className="center-btn">
                <button class="exercise-btn" type="submit">
                    Record Exercise
                </button>  
                </div>

            </form>
        </div>,

        document.getElementById("exerciseForm")
    );
}

export default RecordExercise;
