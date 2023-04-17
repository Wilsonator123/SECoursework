import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import "../css/group.css";

function GroupView(props) {
    

    //Get the user's id stored in session storage
    const tokenString = localStorage.getItem("token");


    const [error, setError] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
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

                        <br/>
                        <br/>
                        <button>Add Member</button>
                        <button>Create Goal</button>
                        <button>Leave Group</button>


                    </div>


                </div>
        </div>,
        document.getElementById("groupCreationForm")
    );
}

export default GroupView;