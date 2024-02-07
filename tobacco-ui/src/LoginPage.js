// LoginPage.js
import React from 'react';

const LoginPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4"> {/* Add padding to the card */}
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <div className="text-center"> {/* Center form elements */}
            <form>
              <div className="form-group">
                <input type="text" className="form-control" id="username" placeholder="Enter username" />
              </div>
              <div className="form-group">
                <input type="password" className="form-control" id="password" placeholder="Enter password" />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary mr-2">Login</button>
                <button type="button" className="btn btn-secondary">Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

