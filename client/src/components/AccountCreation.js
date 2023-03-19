import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

//Create a general form CSS file!



function AccountCreation() {

    //Used to push the user to the home page on a valid account creation
    const navigate = useNavigate();

    //All data needed for account creation (could be split up?)
    const [form, setForm] = useState({
        username: "",
        firstname: "",
        surname: "",
        email: "",
        password: "",


        gender: "",
        dob: "",
        height: "",
        weight: "",
        idealweight: ""
    });


    //Handles submission of a new account - will need a 
    // createUser method for this!
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(form);
        fetch("http://localhost:3001/api/createUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            //Will need to change the body here as it's not just string stuff!
            body: JSON.stringify(form),
        })
            .then((response) => response.json())

            .then((data) => {
                console.log("Successful Account Creation");
                
                //May need to be updated to another page
                navigate('http://localhost:3001/home');

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
            body: JSON.stringify(form.email),
        })
            .then((response) => response.json())


            //Check if this is correct? Will need to be updated to notify user
            .then((data) => {
                if (data.valid){
                    console.log("Unique and valid email:", form.email);
                }
                else {
                    console.log("Invalid email:", form.email)
                }
            })

            .catch((error) => {
                console.error("Error:", error);
            });
    };





        //Checks if username is unique - need a checkUsername backend function
        const checkUsername = (event) => {
            event.preventDefault();
            console.log(form.username);
            fetch("http://localhost:3001/api/checkUsername", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form.username),
            })


                .then((response) => response.json())
                .then((data) => {
                    if (data.valid){
                        console.log("Unique username: ", form.username);
                    } else {
                        console.log("Invalid username: ", form.username);
                    }
                })
                .catch((error) => {
                    console.error("Invalid username:", error);
                });
        };









    //Returns the account creation form that we need
    return (
        <form onSubmit={handleSubmit}>

            <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={form.username}
                    onChange={handleChange}
                    onBlur={checkUsername}
                    />

            <br />

            <label htmlFor="firstname">First Name:</label>
                    <input type="text" id="firstname" name="firstname" value={form.firstname}
                    onChange={handleChange}
                    />


            <br />


            <label htmlFor="surname">Surname:</label>
                    <input type="text" id="surname" name="surname" value={form.surname}
                    onChange={handleChange}
                    />


            <br />

       
            <label htmlFor="email">Email:</label>
                    <input type="text" id="email" name="email" value={form.email}
                    onChange={handleChange}
                    onBlur={checkEmail}
                    />


            <br />     


            <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={form.password}
                    onChange={handleChange}
                    />


            <br />
            <br />
            <br />
            <br />




            <label htmlFor="gender">Gender:</label>
                    <select name="gender" value={form.gender} onChange={handleChange}>
                            <option disabled value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other/Prefer not to say</option>
                    </select>


            <br />  


            <label htmlFor="dob">Date of Birth:</label>
                    <input type="date" id="dob" name="dob" value={form.dob}
                    onChange={handleChange}

                    /> 

            <br /> 


            <label htmlFor="height">Height (cm):</label>
                    <input type="number" id="height" name="height" value={form.height}
                    //The tallest person ever was 272cm. I'm playing it safe here just in
                    // case we get a record beater using our website (very, VERY unlikely)
                    min="0" max="300"
                    onChange={(event) =>
                        setForm({ ...form, height: parseInt(event.target.value) })
                      }
                    />  

            <br />    


            <label htmlFor="weight">Weight (kg):</label>
                    <input type="number" id="weight" name="weight" value={form.weight}
                    //Apparently the heaviest person in the world was 635kg? So I guess this
                    //has to be our max?
                    min="0" max="635"
                    onChange={(event) =>
                        setForm({ ...form, weight: parseInt(event.target.value) })
                      }
                    />  

            <br />



            <label htmlFor="idealweight">Ideal Weight (kg):</label>
                    <input type="number" id="idealweight" name="idealweight" value={form.idealweight}
                    min="0" max="635"
                    onChange={(event) =>
                        setForm({ ...form, idealweight: parseInt(event.target.value) })
                      }
                    />  

            <br />
            <br /> 
            <br />         
                    

        <button type="submit">Create Account</button>
        </form>
    );
}

export default AccountCreation;