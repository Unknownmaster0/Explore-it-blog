import React from "react";

function Footer() {
  return (
    <footer>
      <div className="row bg-dark py-5 mx-0 card card-header  flex-row align-items-center text-center text-md-start">
        <div className="col-md-5 mb-3 mb-md-0">
          <div className="text-primary-hover text-white">
            2025 Sagar Singh | @copywright all rights are reserved
          </div>
        </div>
        <h1 className="col-md-3 mb-3 mb-md-0 text-white">Explore-it</h1>
        <div className="col-md-4">
          <ul className="nav text-primary-hover justify-content-center justify-content-md-end">
            <li className="nav-item">
              <a
                className="nav-link text-white px-2 fs-5"
                href="https://www.linkedin.com/in/0sagarsingh01/"
              >
                <i class="fa-brands fa-linkedin"></i>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-white px-2 fs-5"
                href="https://x.com/0sagarsingh01"
              >
                <i className="fab fa-twitter-square" />
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link text-white px-2 fs-5"
                href="https://github.com/Unknownmaster0/Explore-it-blog/"
              >
                <i className="fab fa-github-square" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
