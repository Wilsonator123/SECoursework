import React, { useState } from "react";

export default function Login({ setToken }) {
    //Used to push the user to the home page on a valid login

    //All data needed for account creation (could be split up?)
    const [form, setForm] = useState({
        login: "",
        password: "",
    });

    const [loginError, setLoginError] = useState("");

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
                alert(error);
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
            <label htmlFor="login">Email or Password:</label>
            <input
                type="text"
                id="login"
                name="login"
                value={form.login}
                onChange={handleChange}
            />

            {loginError && <p>{loginError}</p>}

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
            <button type="submit">Log In</button>
        </form>
    );
}
