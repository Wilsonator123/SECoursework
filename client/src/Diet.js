import { useState } from "react";
import DietForm from "./components/DietForm";
import "./css/diet.css";

/**
 *
 * Show all meals stored
 * Change date to show meals for that day
 * Change length to see meals for that length of time
 *
 */

export default function Diet() {
    const [showForm, setShowForm] = useState(false);

    const renderForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div>
            <h1>Diet</h1>
            <div className="dietHeader">
                <h2>Record Meal</h2>
                <button onClick={renderForm}>Click me</button>
                {showForm ? <DietForm /> : null}
            </div>
            <div id="dietForm" />
        </div>
    );
}
