// LoginPage.js
import React from "react";
import "./LoginPage.css"; // Import the CSS file

const LoginPage = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "50%" }}>
        {" "}
        {/* Set width to 50% */}
        <div className="card-body">
          <h2 className="card-title d-flex justify-content-center w-100 pb-2">Login</h2>
          <div className="text-center">
            {" "}
            {/* Center form elements */}
            <form>
              <div className="form-group pb-4">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter username"
                />
              </div>
              <div className="form-group mb-4">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                />
              </div>
              <div className="d-flex justify-content-evenly">
                <button type="submit" className="btn red-button mr-2">
                  Login
                </button>
                <button type="button" className="btn black-button">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
