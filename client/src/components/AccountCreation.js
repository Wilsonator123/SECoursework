import React, { useState } from "react";


//Create a general form CSS file!

function AccountCreation({ setToken }) {
    //Used to push the user to the home page on a valid account creation

    //All data needed for account creation (could be split up?)
    const [form, setForm] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",

        gender: "",
        dob: "",
        height: "",
        weight: "",
        tweight: "",
    });

    //Used to show error messages for invalid data
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");

    //Handles submission of a new account - will need a
    // createUser method for this!
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(form);
        fetch("http://localhost:3001/api/createUser", {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json",
            },

            //Will need to change the body here as it's not just string stuff!
        })
            .then((response) => response.json())

            .then((data) => {
                //May need to be updated to another page
                if (data) {
                    setToken(data.id);
                    //Used to store when they last entered their weight, and the frequency that they need to input their weight in
                    localStorage.setItem("lastWeighIn", new Date());
                    localStorage.setItem("waitInterval", 1);
                    window.location.reload();
                    
                } else {
                    alert("Invalid account creation details.");
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

    //Checks if email is unique after a user
    //clicks OFF the email part of the form - need a checkEmail backend function

    //checkEmail should return a value for 'valid', either true or false
    const checkEmail = (event) => {
        event.preventDefault();
        console.log(form.email);

        fetch("http://localhost:3001/api/checkEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: form.email }),
        })
            .then((response) => response.json())

            //Check if this is correct? Will need to be updated to notify user
            .then((data) => {
                if (data) {
                    console.log("Unique and valid email:", form.email);
                    setEmailError("");
                } else {
                    setEmailError("Invalid email, please enter another");
                    console.log("Invalid email:", form.email);

                    setForm({ ...form, email: "" });
                }
            })

            .catch((error) => {
                console.error("Error:", error);
            });
    };
    const checkUsername = (event) => {
        event.preventDefault();
        console.log(form.username);

        fetch("http://localhost:3001/api/checkUsername", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: form.username }),
        })
            .then((response) => response.json())

            //Check if this is correct? Will need to be updated to notify user
            .then((data) => {
                if (data) {
                    console.log("Unique username:", form.username);
                    setUsernameError("");
                } else {
                    setUsernameError(
                        "Username already taken, please enter another"
                    );
                    console.log("Invalid username:", form.username);
                    setForm({ ...form, username: "" });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    //Returns the account creation form that we need
    return (
        <form class="account-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                onBlur={checkUsername}
            />

            {usernameError && <p>{usernameError}</p>}

            <br />

            <label htmlFor="firstname">First Name:</label>
            <input
                type="text"
                id="firstname"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
            />

            <br />

            <label htmlFor="lastname">lastname:</label>
            <input
                type="text"
                id="lastname"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
            />

            <br />

            <label htmlFor="email">Email:</label>
            <input
                type="text"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={checkEmail}
            />

            {emailError && <p>{emailError}</p>}

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
            <br />
            <br />
            <br />

            <label htmlFor="gender">Gender:</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
                <option disabled value="">
                    Select
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other/Prefer not to say</option>
            </select>

            <br />

            <label htmlFor="dob">Date of Birth:</label>
            <input
                type="date"
                id="dob"
                name="dob"
                value={form.dob}
                onChange={handleChange}
            />

            <br />

            <label htmlFor="height">Height (cm):</label>
            <input
                type="number"
                id="height"
                name="height"
                value={form.height}
                //The tallest person ever was 272cm. I'm playing it safe here just in
                // case we get a record beater using our website (very, VERY unlikely)
                min="0"
                max="300"
                onChange={(event) =>
                    setForm({ ...form, height: parseInt(event.target.value) })
                }
            />

            <br />

            <label htmlFor="weight">Weight (kg):</label>
            <input
                type="number"
                id="weight"
                name="weight"
                value={form.weight}
                //Apparently the heaviest person in the world was 635kg? So I guess this
                //has to be our max?
                min="0"
                max="635"
                onChange={(event) =>
                    setForm({ ...form, weight: parseInt(event.target.value) })
                }
            />

            <br />

            <label htmlFor="tweight">Ideal Weight (kg):</label>
            <input
                type="number"
                id="tweight"
                name="tweight"
                value={form.tweight}
                min="0"
                max="635"
                onChange={(event) =>
                    setForm({
                        ...form,
                        tweight: parseInt(event.target.value),
                    })
                }
            />

            <br />
            <br />
            <br />

            <button class="create-account-btn" type="submit">Create Account</button>
        </form>
    );
}

export default AccountCreation;
