import { useState, useEffect } from "react";
import "./css/diet.css";

export default function Diet(props) {
    const [diet, setDiet] = useState([]);

    useEffect(() => {
        setDiet(props.diet);
    }, [props.diet]);

    return (
        <div className="diet">
            <h3>Diet</h3>
            <ul>
                {diet.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
}
