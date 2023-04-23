import "./css/group.css";

export default function Home() {
    return (
        <div id="pageContainer">
            <h1> GROUP PAGE </h1>
            <div class="grid-container-group">
                <div class="groupBox1">
                    <h2>Achievements</h2>
                </div>
                <div class="groupBox2">
                    <h2>Achievements</h2>
                </div>
                <div class="groupBox3">
                    <h2>Achievements</h2>
                </div>
                <div class="groupBox4">
                    <h2>Achievements</h2>
                </div>
                <div class="groupBox5">
                    <h2>Group Name</h2>
                </div>
                <div class="groupBox6">
                    <h2>Group Name</h2>
                </div>
            </div>
            <button class="createGroup">Create Group</button>
            <button class="joinGroup">Join Group</button>
        </div>
    );
}
