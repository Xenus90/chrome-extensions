import React from "react";
import ReactDOM from "react-dom";
import "./popup.css";

const test = <p>Hellow world</p>;

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(test, root);