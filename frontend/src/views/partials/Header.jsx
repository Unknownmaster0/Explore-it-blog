import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUserData from "../../plugin/useUserData";
import { useAuthStore } from "../../store/auth";

function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const userId = useUserData()?.user_id;
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)();
  const [_, setRefresh] = useState(false);

  // Toggle the navbar on mobile
  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setRefresh(true);
  }, [userId]);

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
            <span className="navbar-toggler-icon" style={{ color: "white" }}>
              Menu
            </span>
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

              {/* Dashboard dropdown */}
              {isLoggedIn && (
                <li
                  className="nav-item dropdown"
                  style={{
                    display: "block",
                    visibility: "visible",
                    opacity: 1,
                  }}
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
                        <i className="fas fa-userData"></i> Dashboard
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
                        <i className="fas fa-userData-gear"></i> Profile
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

              {/* Auth buttons */}
              <li
                className="nav-item d-flex"
                style={{
                  display: "flex !important",
                  visibility: "visible",
                  opacity: 1,
                }}
              >
                {isLoggedIn ? (
                  <>
                    <Link
                      to={"/dashboard/"}
                      className="btn btn-secondary"
                      href="dashboard.html"
                    >
                      Dashboard <i className="bi bi-grid-fill"></i>
                    </Link>
                    <Link
                      to={"/logout/"}
                      className="btn btn-danger ms-2"
                      href="dashboard.html"
                    >
                      Logout <i className="fas fa-sign-out-alt"></i>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={"/register/"}
                      className="btn btn-success"
                      href="dashboard.html"
                    >
                      Register <i className="fas fa-userData-plus"></i>
                    </Link>
                    <Link
                      to={"/login/"}
                      className="btn btn-success ms-2"
                      href="dashboard.html"
                    >
                      Login <i className="fas fa-sign-in-alt"></i>
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
