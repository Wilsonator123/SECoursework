import React, { useState } from "react";

export default function Login({ setToken }) {
    //Used to push the user to the home page on a valid login

    //All data needed for account creation (could be split up?)
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [usernameError, setUsernameError] = useState("");

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
                    setToken(data.id);
                    console.log(data.id);
                    console.log("We can set the token correctly!");
                } else {
                    alert("Incorrect Password. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("No account found with that username. Please try again.");
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
        <form class="account-form" onSubmit={handleSubmit}>
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

            <br />
            <button class="create-account-btn" type="submit">
                Log In
            </button>
        </form>
    );
}
