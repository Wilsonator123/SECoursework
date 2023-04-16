// React component imports
import React, { useState } from "react";
import "./css/goal.css";

// Dummy data for diet goals
const dietGoals = [
  {
    name: "Lose 5kg",
    dateBegun: "2023-03-01",
    dateDue: "2023-04-30",
    weight: 68,
    notes: "Reduce sugar intake",
    status: "In Progress",
  },
  {
    name: "Maintain weight",
    dateBegun: "2023-05-01",
    dateDue: "2023-08-31",
    weight: 88,
    notes: "Focus on balanced meals",
    status: "Completed",
  },
];

// Dummy data for exercise goals
const exerciseGoals = [
  {
    type: "Running",
    dateBegun: "2023-03-01",
    dateDue: "2023-04-30",
    distance: 100,
    notes: "Run 5km per week",
    status: "In Progress",
  },
  {
    type: "Yoga",
    dateBegun: "2023-05-01",
    dateDue: "2023-08-31",
    time: 120,
    notes: "Practice 30 minutes daily",
    status: "Completed",
  },
];

// Exercise types separated based on time and distance requirements
const timeBasedExercises = [
  "Yoga",
  "Weightlifting",
  "Pilates",
  "Dancing",
  "Martial Arts",
];

const distanceBasedExercises = [
  "Walking",
  "Running",
  "Swimming",
  "Cycling",
  "Hiking",
];
// Home component: Renders the goal page for tracking diet and exercise goals
export default function Home() {
  // State variable to toggle the visibility of the exercise goal form
  const [showExerciseGoalForm, setShowExerciseGoalForm] = useState(false);

  // State variable to toggle the visibility of the diet goal form
  const [showDietGoalForm, setShowDietGoalForm] = useState(false);

  // State variable to store the currently selected exercise type in the exercise goal form
  const [exerciseType, setExerciseType] = useState("");

  // State variable to store the currently selected goal, used to display goal details in a popup
  const [selectedGoal, setSelectedGoal] = useState(null);

  // State variable to toggle the visibility of the diet filter dropdown
  const [showDietFilter, setShowDietFilter] = useState(false);

  // State variable to toggle the visibility of the exercise filter dropdown
  const [showExerciseFilter, setShowExerciseFilter] = useState(false);

  // State variable to toggle the visibility of the overlay (used when a filter dropdown is open)
  const [showOverlay, setShowOverlay] = useState(false);

  // Event handlers
  const handleFilterClick = (type) => {
    if (type === "diet") {
      setShowDietFilter((prev) => !prev);
    } else {
      setShowExerciseFilter((prev) => !prev);
    }
    setShowOverlay((prev) => !prev);
  };

  const handleExerciseGoalClick = () => {
    setShowExerciseGoalForm((prev) => !prev);
  };

  const handleDietGoalClick = () => {
    setShowDietGoalForm((prev) => !prev);
  };

  const handleExerciseFormSubmit = (event) => {
    event.preventDefault();
    // Handle exercise goal form submission
  };

  const handleDietFormSubmit = (event) => {
    event.preventDefault();
    // Handle diet goal form submission
  };

  const handleExerciseTypeChange = (event) => {
    setExerciseType(event.target.value);
  };

  const handleGoalClick = (goal) => {
    setSelectedGoal(goal);
  };

  const closeGoalPopup = () => {
    setSelectedGoal(null);
    setShowOverlay(false);
  };

  const closeFilterDropdown = () => {
    setShowDietFilter(false);
    setShowExerciseFilter(false);
    setShowOverlay(false);
  };

  // Render functions -- if the boolean is true then we get a exercise filter dropdown
  const renderFilterDropdown = (exercise) => (
    <div className="filter-dropdown">
      <h4>Status:</h4>
      <label>
        <input type="checkbox" /> Completed
      </label>
      <label>
        <input type="checkbox" /> In Progress
      </label>
      <h4>Date Range:</h4>
      <label>
        From: <input type="date" />
      </label>
      <label>
        To: <input type="date" />
      </label>
      {exercise && (
        <>
          <h4>Exercise Type:</h4>
          <select>
            <option value="">All</option>
            {timeBasedExercises
              .concat(distanceBasedExercises)
              .map((exercise) => (
                <option key={exercise} value={exercise}>
                  {exercise}
                </option>
              ))}
          </select>
        </>
      )}
    </div>
  );

  // need to rewrite this, this is dog code
  const renderGoalPopup = () => (
    <div className="goal-popup" onClick={closeGoalPopup}>
      <div className="goal-popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>{selectedGoal.type || selectedGoal.name}</h3>
        <p>Date Begun: {selectedGoal.dateBegun}</p>
        <p>Date Due: {selectedGoal.dateDue}</p>
        <p>Status: {selectedGoal.status}</p>
        {selectedGoal.weight && <p>Weight: {selectedGoal.weight}</p>}
        {selectedGoal.time && <p>Time: {selectedGoal.time}</p>}
        {selectedGoal.distance && <p>Distance: {selectedGoal.distance}</p>}
        <p>Notes: {selectedGoal.notes}</p>
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );

  const renderExerciseGoalForm = () => (
    <form onSubmit={handleExerciseFormSubmit}>
      <label>
        Type:
        <select value={exerciseType} onChange={handleExerciseTypeChange}>
          <option value="">Select an exercise</option>
          {timeBasedExercises.concat(distanceBasedExercises).map((exercise) => (
            <option key={exercise} value={exercise}>
              {exercise}
            </option>
          ))}
        </select>
      </label>
      <label>
        Date Begun:
        <input type="date" />
      </label>
      <label>
        Date Due:
        <input type="date" />
      </label>
      {timeBasedExercises.includes(exerciseType) && (
        <label>
          Time:
          <input type="number" />
        </label>
      )}
      {distanceBasedExercises.includes(exerciseType) && (
        <label>
          Distance:
          <input type="number" />
        </label>
      )}
      <label>
        Notes:
        <textarea />
      </label>
      <button type="submit">Submit goal</button>
    </form>
  );

  const renderDietGoalForm = () => (
    <form onSubmit={handleDietFormSubmit}>
      <label>
        Goal Name:
        <input type="text" />
      </label>
      <label>
        Date Begun:
        <input type="date" />
      </label>
      <label>
        Date Due:
        <input type="date" />
      </label>
      <label>
        Weight:
        <input type="number" />
      </label>
      <label>
        Notes:
        <textarea />
      </label>
      <button type="submit">Submit goal</button>
    </form>
  );

  // Main render
  return (
    <div id="pageContainer">
      <h1> GOAL PAGE </h1>
      <div className="grid-container-goal">
        <div className="goalBox1">
          <h2>Diet</h2>
          <div className="goal-buttons">
            <button onClick={handleDietGoalClick}>
              {showDietGoalForm ? "-" : "+"}
            </button>
            <button onClick={() => handleFilterClick("diet")}>Filter</button>
          </div>
          {showDietGoalForm && renderDietGoalForm()}
          {/* Display diet goals */}
          <div className="goals-container">
            {dietGoals.map((goal, index) => (
              <button key={index} onClick={() => handleGoalClick(goal)}>
                {goal.name}
              </button>
            ))}
          </div>
        </div>
        <div className="goalBox2">
          <h2>Exercise</h2>
          <div className="goal-buttons">
            <button onClick={handleExerciseGoalClick}>
              {showExerciseGoalForm ? "-" : "+"}
            </button>
            <button onClick={() => handleFilterClick("exercise")}>
              Filter
            </button>
          </div>
          {showExerciseGoalForm && renderExerciseGoalForm()}
          {/* Display exercise goals */}
          <div className="goals-container">
            {exerciseGoals.map((goal, index) => (
              <button key={index} onClick={() => handleGoalClick(goal)}>
                {goal.type}
              </button>
            ))}
          </div>
        </div>
      </div>
      {selectedGoal && renderGoalPopup()}

      {showOverlay && (
        <div className="overlay" onClick={closeFilterDropdown}></div>
      )}
      {showDietFilter && renderFilterDropdown(false)}
      {showExerciseFilter && renderFilterDropdown(true)}
      {selectedGoal && renderGoalPopup()}
    </div>
  );
}
