import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Header from "./Header";

class Home extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <h1> Hello World </h1>
            </div>
        );
    }
}

export default Home;
