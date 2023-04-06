import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//Used on the Exercise page to record a new exercise
export default function RecordExercise() {

    const navigate = useNavigate();

    //Get the user's id stored in session storage
    const tokenString = localStorage.getItem('token');
    
    const userToken = JSON.parse(tokenString);
    console.log(tokenString);

    const [form, setForm] = useState({
        id: tokenString,
        name: "",
        activity: "",
        quantity: "",
        measurement: ""
    });

    //Gonna get a list of activities from DB to put in form
    const [activities, setActivities] = useState([]);

    //At creatiom of form, get all activities in here!
    useEffect(() => {
        fetch("http://localhost:3001/api/getActivities")
          .then(response => response.json())
          .then(data => setActivities(data));
      }, []);



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
                    navigate("/Account");
                    
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



    return (
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
            <select name="activity" type="number" value={form.activity} onChange={(event) =>
                    setForm({ ...form, activity: parseInt(event.target.value) })
                }>
                    
                    <option disabled value="">Select</option>

                    {/*Gets ALL the activities and maps them in a list*/}
                    {activities.map(activity => (
                        <option key={activity.id} value={activity.id}>
                        {activity.name}
                    </option>
                     ))}


            </select>        


            <br />
            <label htmlFor="quantity">Quantity:</label>
            <input
                type="number"
                id="quantity"
                name="quantity"
                value={form.quantity}
                min="0"
                onChange={(event) =>
                    setForm({ ...form, quantity: parseInt(event.target.value) })
                }
            />

            <br/>
            <label htmlFor="measurement">Measurement:</label>
            <select name="measurement" value={form.measurement} onChange={handleChange}>
                <option disabled value="">
                    Select
                </option>
                <option value="m">Metres</option>
                <option value="mins">Minutes</option>
            </select>


            <br/>
            <button class="exercise-btn" type="submit">Record Exercise</button>

        </form>
            )
}