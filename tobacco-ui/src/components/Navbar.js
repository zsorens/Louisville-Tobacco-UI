// NavBar.js
import React from "react";
import { Link } from "react-router-dom";
import "../Styling/NavBar.css"; // Import the CSS file
import logo from "../Images/PHW_hor.jpg";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <img
          className="logo-container"
          src={logo}
          alt="the logo for department of public health and wellness"
        />
      </div>
    </nav>
  );
};

export default NavBar;
