import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import "../css/group.css";

function GroupCreationForm(props) {
    

    //Get the user's id stored in session storage
    const tokenString = localStorage.getItem("token");

    //Form for submitting a meal
    const [form, setForm] = useState({
        user_id: tokenString,
        name: "",
    });


    const [error, setError] = useState("");


    //Used to create a new group
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(form);
        fetch("http://localhost:3001/api/createGroup", {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
                if (data) {
                    alert("Group Created Successfully!");
                    setError("")

                    window.location.reload();
                } else {
                    setError("Your group name is already taken. Please enter another.")
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
        console.log(form.name);

    };


    return ReactDom.createPortal(
        <div
            id="groupPageContainer"
        >
            <div class="grid-container-group">
                <div class="groupBox1">
                    <button className="close-button" onClick={props.onClose}>
                    <i class="fa-solid fa-xmark fa-xl"></i></button> 
                    <h2>Create Group</h2>
                    <form class="group-form" onSubmit={handleSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input className="input-box2"
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />

                        <br/>
                        {error && <p id="groupCreationError">{error}</p>}
                        <br />

                        <button class="group-btn" type="submit">
                            Create Group
                        </button>
                    </form>


                </div>
                </div>
        </div>,
        document.getElementById("groupCreationForm")
    );
}

export default GroupCreationForm;