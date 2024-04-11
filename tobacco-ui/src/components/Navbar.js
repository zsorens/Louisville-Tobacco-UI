// NavBar.js
import React from "react";
import { Link } from "react-router-dom";
import "../Styling/NavBar.css"; // Import the CSS file

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Louisville Metro Public Helath and Wellness
        </Link>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/map">
              Map
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
