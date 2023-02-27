import "./App.css";
import { useState, useEffect, Fragment, useRef } from "react";

function App() {
    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(data);
        fetch("http://localhost:3001/api/createUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };
    return (
        <div class="container">
            <div class="hidden sm:block" aria-hidden="true">
                <div class="py-5">
                    <div class="border-t border-gray-200"></div>
                </div>
            </div>

            <div class="mt-10 sm:mt-0 App">
                <div class="md:grid md:grid-cols-3 md:gap-6">
                    <div class="md:col-span-1">
                        <div class="px-4 sm:px-0">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">
                                Personal Information
                            </h3>
                            <p class="mt-1 text-sm text-gray-600">
                                Use a permanent address where you can receive
                                mail.
                            </p>
                        </div>
                    </div>
                    <div class="mt-5 md:col-span-2 md:mt-0">
                        <form onSubmit={handleSubmit}>
                            <div class="overflow-hidden shadow sm:rounded-md">
                                <div class="bg-white px-4 py-5 sm:p-6">
                                    <div class="grid grid-cols-4 gap-6">
                                        <div class="col-span-4 sm:col-span-3">
                                            <label
                                                for="username"
                                                class="block text-sm font-medium text-gray-700"
                                            >
                                                Username
                                            </label>

                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                autocomplete="given-name"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={data.username}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div class="col-span-6 sm:col-span-3">
                                            <label
                                                for="email"
                                                class="block text-sm font-medium text-gray-700"
                                            >
                                                Email address
                                            </label>
                                            <input
                                                type="text"
                                                name="email"
                                                id="email"
                                                autocomplete="email"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={data.email}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div class="col-span-3">
                                            <label
                                                for="password"
                                                class="block text-sm font-medium text-gray-700"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                autocomplete="password"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={data.password}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                    <button
                                        type="submit"
                                        class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Create Account
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
