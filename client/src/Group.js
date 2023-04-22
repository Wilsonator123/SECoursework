import "./css/group.css";
import { useState, useEffect } from "react";
import GroupCreationForm from "./components/GroupCreationForm";
import GroupView from "./components/GroupView";
import { useNavigate } from "react-router-dom";

export default function Group() {
    //Used to get users id from session storage
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);

    const navigate = useNavigate();

    //If a link to add a user to a group is done, get the attributes and add them
    const addMemberViaEmail = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const groupID = urlParams.get("groupId");
        const email = urlParams.get("email");

        if (groupID !== null && email !== null) {
            console.log(groupID);
            console.log(email);

            fetch("http://localhost:3001/api/addUserViaEmail", {
                method: "POST",
                body: JSON.stringify({
                    group_id: groupID,
                    email: email,
                    user_id: userToken,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())

                .then((data) => {
                    console.log(data);
                    if (typeof data === "boolean" && data) {
                        alert("Joined Group!");
                        getUserGroups();
                    } else {
                        alert(data.error);
                    }
                })
                .catch((error) => {
                    alert("Error in joining group.");
                });
        }
    };

    //Used to get all groups for a user
    const [userGroups, setUserGroups] = useState([]);

    const [showGroupCreationForm, setShowGroupCreationForm] = useState(false);
    const [showGroupView, setShowGroupView] = useState(false);

    const renderGroupCreationForm = () => {
        setShowGroupCreationForm(!showGroupCreationForm);
    };

    const renderGroupView = () => {
        setShowGroupView(!showGroupView);
    };

    useEffect(() => {
        getUserGroups();
        addMemberViaEmail();
    }, []);

    const getUserGroups = () => {
        fetch("http://localhost:3001/api/getUserGroups", {
            method: "POST",
            body: JSON.stringify({ id: userToken }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
                if (data) {
                    setUserGroups(data);
                } else {
                    alert("Could not find groups.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <div>
            {showGroupCreationForm ? (
                <GroupCreationForm onClose={renderGroupCreationForm} />
            ) : null}

            <div id="pageContainer">
                <h1> GROUP PAGE </h1>
                <button onClick={renderGroupCreationForm}>Create Group</button>
                <div id="groupCreationForm" />

                <h2>Your Groups</h2>

                {/*Gets the groups and maps them in divs*/}
                {userGroups.map((userGroup) => (
                    <div key={userGroup.id}>
                        <br />
                        <button onClick={() => setShowGroupView(userGroup.id)}>
                            {userGroup.name}
                        </button>
                        {showGroupView === userGroup.id ? (
                            <GroupView
                                onClose={() => setShowGroupView(null)}
                                group_id={userGroup.id}
                                name={userGroup.name}
                            />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}
