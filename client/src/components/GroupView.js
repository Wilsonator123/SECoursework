import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import "../css/group.css";

function GroupView(props) {
    

    //Get the user's id stored in session storage
    const tokenString = localStorage.getItem("token");

    const [owner, setOwner] = useState(false);
    const [error, setError] = useState("");
    const [users, setUsers] = useState([]);
    const [addUserError, setAddUserError] = useState("");

    const [newUserForm, setNewUserForm] = useState({
        group_id: props.group_id,
        email: "",
    });


    //Used to create a new group
    const handleAddUserSubmit = (event) => {
        event.preventDefault();
        console.log(newUserForm);
        fetch("http://localhost:3001/api/addUserToGroup", {
            method: "POST",
            body: JSON.stringify(newUserForm),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
                if (data) {
                    setAddUserError("Email sent to user!")
                    //props.onClose();
                } else {
                    setAddUserError(data.error);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("ERROR");
            });
    };


        //Handles updates to all of the data in the form
        const handleAddUserChange = (event) => {
            setNewUserForm({
                ...newUserForm,
                [event.target.name]: event.target.value,
            });
            
        };


    //Checks if the user is owner of the group
        const checkOwner = () => {

            fetch("http://localhost:3001/api/checkOwner", {
                method: "POST",
                body: JSON.stringify({group_id: props.group_id, user_id: tokenString}),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
    
                .then((data) => {
                    if (data) {
                        setOwner(true);
                    } else {
                        setOwner(false);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("ERROR");
                });
        };
    




    useEffect(() => {
        getUsers();

        checkOwner();
    }, []);



    const getUsers = () => {

        fetch("http://localhost:3001/api/getGroupUsers", {
            method: "POST",
            body: JSON.stringify({ id: props.group_id}),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
                if (data) {
                    setUsers(data);
                } else {
                    alert("Could not find users.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };



    return ReactDom.createPortal(
        <div
            id="groupPageContainer"
        >
            <div class="grid-container-group">


                    <div class="groupBox1">
                        <button onClick={props.onClose}>Close</button>
                        <h2>{props.name}</h2>

                        <h3>Members:</h3>
                        {/*Gets the group members and maps them in divs*/}
                        {users.map((user) => (
                            <div key={user.id}>
                                <p>{user.firstname} {user.lastname}:    {user.username}</p>
                            </div>
                        ))}



                    </div>
                    <br />
                    <div class="groupBox1">
                        <h3>Goals</h3>
                    </div>


                    

                    {owner && ( <div class="groupBox1">
                        <h3>Add User</h3>
                        <form class="group-form" onSubmit={handleAddUserSubmit}>
                        <label htmlFor="email">User Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={newUserForm.email}
                            onChange={handleAddUserChange}
                        />

                        <br/>
                        {addUserError && <p id="addUserError">{addUserError}</p>}
                        <br />

                        <button class="group-btn" type="submit">
                            Add User
                        </button>
                    </form>
                    </div>)}



                    {owner && (<div class="groupBox1">
                        <h3>Create Goal</h3>
                    </div>)}

                    {!owner && (<div class="groupBox1">
                        <h3>Leave Group</h3>
                    </div>)}


                </div>
        </div>,
        document.getElementById("groupCreationForm")
    );
}

export default GroupView;