import "./css/group.css";
import { useState, useEffect } from "react";
import GroupCreationForm from "./components/GroupCreationForm";



export default function Home() {

    const [showGroupCreationForm, setShowGroupCreationForm] = useState(false);


    const renderGroupCreationForm = () => {
        setShowGroupCreationForm(!showGroupCreationForm);
    };

    return (
        <div>
        {showGroupCreationForm ? <GroupCreationForm onClose={renderGroupCreationForm} /> : null}

            <div id="pageContainer">
                <h1> GROUP PAGE </h1>
                <button onClick={renderGroupCreationForm}>Create Group</button>
                <div id="groupCreationForm" />

                <h2>Your Groups</h2>
                
            </div>
        </div>
    );
}
