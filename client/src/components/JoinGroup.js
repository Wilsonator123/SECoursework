import "../css/group.css";
import ReactDom from "react-dom";
import { useState, useEffect } from "react";


export default function JoinGroup(props) {
    //Used to get users id from session storage
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);

    const [joinGroupError, setJoinGroupError] = useState("");

    const [joinGroupForm, setJoinGroupForm] = useState({
        user_id: tokenString,
        group_id: ""
    });

    const handleJoinGroupSubmit = (event) => {
        event.preventDefault();
        fetch("http://localhost:3001/api/addUserViaCode", {
            method: "POST",
            body: JSON.stringify(joinGroupForm),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
                console.log(data);
                if (typeof data === "boolean" && data) {
                    alert("Joined Group!");
                    window.location.reload();
                } else {
                    setJoinGroupError(data.error);
                }
            })
            .catch((error) => {
                alert("Error in joining group.");
            });
    };


    const handleJoinGroupChange = (event) => {
        setJoinGroupForm({
            ...joinGroupForm,
            [event.target.name]: event.target.value,
        });
        
    };


    useEffect(() => {
        //getUserGroups();
        //addMemberViaEmail();
    }, []);


    return ReactDom.createPortal(
        <div
            id="groupPageContainer"
        >
        <div class="groupBox1">
        <button  className="close-button" onClick={props.onClose}> <i class="fa-solid fa-xmark fa-xl"></i></button>
        <h2>Join Group</h2>
        <form class="group-form" onSubmit={handleJoinGroupSubmit}>
        <label htmlFor="email">Group Code:</label>
        <input className="input-box"
            type="number"
            id="group_id"
            name="group_id"
            value={joinGroupForm.group_id}
            onChange={handleJoinGroupChange}
        />

        <br/>
        {joinGroupError && <p id="joinGroupError">{joinGroupError}</p>}
        <br />

        <button class="group-btn" type="submit">
            Join
        </button>
    </form>
    </div>
    </div>
    ,document.getElementById("joinGroupForm")
    );
}