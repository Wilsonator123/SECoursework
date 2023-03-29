import React, { useState } from "react";


//Used on the Exercise page to record a new exercise
export default function RecordExercise() {

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [usernameError, setUsernameError] = useState("");

    //Need to put the code to get all activities in here!
   


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(form);
        fetch("http://localhost:3001/api/login", {
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

                    
                } else {

                }
            })
            .catch((error) => {
                console.error("Error:", error);
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
        <form onSubmit={handleSubmit}>


            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
            />

            {usernameError && <p>{usernameError}</p>}
            
            <br />

            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
            />

            <br/>
            <button type="submit">Log In</button>

        </form>
            )
}