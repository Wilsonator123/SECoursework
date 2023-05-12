import "../css/Account.css";
import { useState, useEffect } from "react";


export default function RecordWeight(props) {


    //Used to get users id from session storage
    const tokenString = localStorage.getItem("token");
    const lastWeighIn = new Date(localStorage.getItem("lastWeighIn"));
    const waitInterval = parseInt(localStorage.getItem("waitInterval"));

    const checkWeighIn = () => {
        console.log(lastWeighIn);
        console.log(waitInterval);
        if (lastWeighIn === null) {
            alert("Please Enter a Weight");
        }

        const deadline = new Date();


        deadline.setDate(lastWeighIn.getDate() + waitInterval);
        console.log("Next Weigh In due:" + deadline.toDateString());
        
        if (lastWeighIn !== null){
            if (typeof waitInterval === undefined || waitInterval === null || deadline <= new Date()) {
                alert("Please Enter a New Weight");
                localStorage.setItem("waitInterval", 1);
            }
        }
    }



    const [recordWeightError, setRecordWeightError] = useState("");
    const [recordIntervalError, setRecordIntervalError] = useState("");

    const [recordWeightForm, setRecordWeightForm] = useState({
        weight: ""
    });

    const [recordIntervalForm, setRecordIntervalForm] = useState({
        waitInterval: waitInterval
    })


    useEffect(() => {
        checkWeighIn();
    }, []);


    const handleRecordWeightSubmit = (event) => {
        event.preventDefault();
        fetch("http://localhost:3001/api/recordWeight", {
            method: "POST",
            body: JSON.stringify({id: tokenString, weight: recordWeightForm.weight}),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())

            .then((data) => {
                console.log(data);
                if (data) {
                    setRecordWeightError("Recorded Weight!");
                    localStorage.setItem("lastWeighIn", new Date());
                } else {
                    setRecordWeightError("Unsuccessful recording of weight");

                }
            })
            .catch((error) => {
                setRecordWeightError("Unsuccessful recording of weight");
            });
    };


    const handleWaitIntervalSubmit = (event) => {
        event.preventDefault();
        localStorage.setItem("waitInterval", recordIntervalForm.waitInterval);
        setRecordIntervalError("Recorded Interval Successfully!");
    };



    

    return (
<div>
        <div>
        <h3>Record Weight</h3>
        <form class="group-form" onSubmit={handleRecordWeightSubmit}>
        <label htmlFor="weight">Weight (kg):</label>
            <input class ="input-box"
                type="number"
                id="weight"
                name="weight"
                value={recordWeightForm.weight}
                //Apparently the heaviest person in the world was 635kg? So I guess this
                //has to be our max?
                min="0"
                max="635"
                required
                onChange={(event) =>
                    setRecordWeightForm({ ...recordWeightForm, weight: parseInt(event.target.value) })
                } />

        <br/>
        {recordWeightError && <p id="recordWeightError">{recordWeightError}</p>}
        <br />

        <button class="group-btn" type="submit">
            Record
        </button>
    </form>
    </div>

    <br/><br/>   
             
    <div>
        <form class="group-form" onSubmit={handleWaitIntervalSubmit}>
        <label htmlFor="weight">Ask for a new weight in this many days:</label>
            <input class="input-box"
                type="number"
                id="waitInterval"
                name="waitInterval"
                value={recordIntervalForm.waitInterval}
                min="0"
                max="10"
                required
                onChange={(event) =>
                    setRecordIntervalForm({ ...recordIntervalForm, waitInterval: parseInt(event.target.value) })
                } />

        <br/>
        {recordIntervalError && <p id="recordIntervalError">{recordIntervalError}</p>}
        <br />

        <button class="group-btn" type="submit">
            Set Interval
        </button>
    </form>
    </div>
    </div>
    )

}