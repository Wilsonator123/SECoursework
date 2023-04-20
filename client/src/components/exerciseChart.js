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
const createChart = (body) => {
    try {
        var yMax = 6;
        const date = new Date(body.SOW);

        for (let i = 0; i < 6; i++) {
            if (body.days[i] >= yMax) {
                yMax = yMax + 2;
            }
        }

        const data = {
            labels: [
                "Sun " + new Date(date).toLocaleDateString(),
                "Mon " +
                    new Date(
                        date.setDate(date.getDate() + 1)
                    ).toLocaleDateString(),
                "Tue " +
                    new Date(
                        date.setDate(date.getDate() + 1)
                    ).toLocaleDateString(),
                "Wed " +
                    new Date(
                        date.setDate(date.getDate() + 1)
                    ).toLocaleDateString(),
                "Thu " +
                    new Date(
                        date.setDate(date.getDate() + 1)
                    ).toLocaleDateString(),
                "Fri " +
                    new Date(
                        date.setDate(date.getDate() + 1)
                    ).toLocaleDateString(),
                "Sat " +
                    new Date(
                        date.setDate(date.getDate() + 1)
                    ).toLocaleDateString(),
            ],
            datasets: [
                {
                    label: "Hours",
                    data: [
                        body.days[0],
                        body.days[1],
                        body.days[2],
                        body.days[3],
                        body.days[4],
                        body.days[5],
                        body.days[6],
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
                    text: "Weekly exercise",
                },
            },
        };
        return <Bar data={data} options={options} id="chart" />;
    } catch {
        return <div></div>;
    }
};

export default createChart;
