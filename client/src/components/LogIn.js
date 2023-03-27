import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
    //Used to push the user to the home page on a valid login
    const navigate = useNavigate();

    //All data needed for account creation (could be split up?)
    const [form, setForm] = useState({
        username: "",
        password: ""
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
                    
                    navigate("/account");
                } else {
                    alert("Invalid login details.")
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
export default Login;
