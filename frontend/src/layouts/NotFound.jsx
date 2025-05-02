import React from "react";

const NotFound = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center text-center vh-100 bg-light">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <p className="fs-3 text-secondary">Oops! Page not found.</p>
      <p className="lead text-muted">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="btn btn-primary mt-3">
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
