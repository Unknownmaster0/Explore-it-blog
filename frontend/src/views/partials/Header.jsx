import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle the navbar on mobile
  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <header className="navbar-dark bg-dark">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <h1
              style={{
                color: "#E4E4E7",
              }}
            >
              Explore-it
            </h1>
          </Link>

          {/* Mobile toggle button */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
            aria-controls="navbarCollapse"
            aria-expanded={isExpanded}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation content - CRITICAL FIX - force display with inline styles */}
          <div
            className={`collapse navbar-collapse ${isExpanded ? "show" : ""}`}
            id="navbarCollapse"
            style={{
              display: isExpanded ? "block" : "",
              visibility: "visible",
              opacity: 1,
            }}
          >
            {/* Search form */}
            <div className="nav mt-3 mt-lg-0 px-4 flex-nowrap align-items-center">
              <div className="nav-item w-100">
                <form className="rounded position-relative">
                  <input
                    className="form-control pe-5 bg-light"
                    type="search"
                    placeholder="Search Articles"
                    aria-label="Search"
                  />
                  <Link
                    to="/search/"
                    className="btn bg-transparent border-0 px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                  >
                    <i className="bi bi-search fs-5"></i>
                  </Link>
                </form>
              </div>
            </div>

            {/* Navigation links - FORCE DISPLAY with inline style */}
            <ul
              className="navbar-nav navbar-nav-scroll ms-auto"
              style={{
                display: "flex !important",
                visibility: "visible",
                opacity: 1,
              }}
            >
              {/* Home link */}
              <li
                className="nav-item"
                style={{ display: "block", visibility: "visible", opacity: 1 }}
              >
                <Link
                  className="nav-link active"
                  to="/"
                  style={{
                    display: "block",
                    visibility: "visible",
                    opacity: 1,
                    color: "white",
                  }}
                >
                  Home
                </Link>
              </li>

              {/* Category link */}
              <li
                className="nav-item"
                style={{ display: "block", visibility: "visible", opacity: 1 }}
              >
                <Link
                  className="nav-link active"
                  to="/category/"
                  style={{
                    display: "block",
                    visibility: "visible",
                    opacity: 1,
                    color: "white",
                  }}
                >
                  Category
                </Link>
              </li>

              {/* Pages dropdown */}
              <li
                className="nav-item dropdown"
                style={{ display: "block", visibility: "visible", opacity: 1 }}
              >
                <a
                  className="nav-link dropdown-toggle active"
                  href="#"
                  role="button"
                  id="pagesMenu"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    display: "block",
                    visibility: "visible",
                    opacity: 1,
                    color: "white",
                  }}
                >
                  Pages
                </a>
                <ul className="dropdown-menu" aria-labelledby="pagesMenu">
                  <li>
                    <Link className="dropdown-item" to="/about/">
                      <i className="bi bi-person-lines-fill"></i> About
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/contact/">
                      <i className="bi bi-telephone-fill"></i> Contact
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Dashboard dropdown */}
              <li
                className="nav-item dropdown"
                style={{ display: "block", visibility: "visible", opacity: 1 }}
              >
                <a
                  className="nav-link dropdown-toggle active"
                  href="#"
                  role="button"
                  id="dashboardMenu"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    display: "block",
                    visibility: "visible",
                    opacity: 1,
                    color: "white",
                  }}
                >
                  Dashboard
                </a>
                <ul className="dropdown-menu" aria-labelledby="dashboardMenu">
                  <li>
                    <Link className="dropdown-item" to="/dashboard/">
                      <i className="fas fa-user"></i> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/posts/">
                      <i className="bi bi-grid-fill"></i> Posts
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/add-post/">
                      <i className="fas fa-plus-circle"></i> Add Post
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/comments/">
                      <i className="bi bi-chat-left-quote-fill"></i> Comments
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/notifications/">
                      <i className="fas fa-bell"></i> Notifications
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile/">
                      <i className="fas fa-user-gear"></i> Profile
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Auth buttons */}
              <li
                className="nav-item d-flex"
                style={{
                  display: "flex !important",
                  visibility: "visible",
                  opacity: 1,
                }}
              >
                <Link to="/register/" className="btn btn-success me-2">
                  Register <i className="fas fa-user-plus"></i>
                </Link>
                <Link to="/login/" className="btn btn-success">
                  Login <i className="fas fa-sign-in-alt"></i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
