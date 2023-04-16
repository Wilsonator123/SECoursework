import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import React from "react";
import { useState, userEffect } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);
const createChart = (days) => {
    var yMax = 6;

    for (let i = 0; i < 6; i++) {
        if (days[i] >= yMax) {
            yMax = yMax + 2;
        }
    }
    const data = {
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [
            {
                label: "Hours",
                data: [
                    days[0],
                    days[1],
                    days[2],
                    days[3],
                    days[4],
                    days[5],
                    days[6],
                ],
                backgroundColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 99, 132, 1)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };
    const options = {
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: yMax,
                title: {
                    display: true,
                    text: "Hours",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Day of the week",
                },
            },
        },
        plugins: {
            responsive: true,
            title: {
                display: true,
                text: "Weekly Exercise",
            },
        },
    };
    return <Bar data={data} options={options} />;
};

export default createChart;
