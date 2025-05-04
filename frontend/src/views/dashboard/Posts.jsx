import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import moment from "../../plugin/Moment";
import PrivateRoute from "../../layouts/PrivateRoute";
import Toast from "../../plugin/Toast";

function Posts() {
  const [posts, setPosts] = useState([]);
  const userId = useUserData()?.user_id;

  const fetchPosts = async () => {
    const post_res = await apiInstance.get(`author/dashboard/posts/${userId}/`);
    setPosts(post_res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    if (query === "") {
      fetchPosts();
    } else {
      const filtered = posts.filter((p) => {
        return p.title.toLowerCase().includes(query);
      });
      setPosts(filtered);
    }
  };

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    let sortedPosts = [...posts]; // Assuming filteredPosts contains the initial posts data
    console.log(sortValue);
    if (sortValue === "Newest") {
      sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortValue === "Oldest") {
      sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (
      sortValue === "Active" ||
      sortValue === "Draft" ||
      sortValue === "Disabled"
    ) {
      sortedPosts = posts.filter((post) => post.status === sortValue);
    } else if (sortValue === "") {
      fetchPosts();
    }

    console.log(sortedPosts);

    setPosts(sortedPosts);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await apiInstance.delete(
        `author/dashboard/update-post/${userId}/${postId}/`
      );

      if (response.status === 200) {
        Toast("success", response.data.message);
        fetchPosts(); // Refresh the posts list
      }
    } catch (error) {
      Toast("error", error.response?.data?.message || "Error deleting post");
    }
  };

  console.log(posts)

  return (
    <PrivateRoute>
      <Header />
      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-12">
              <div className="card border bg-transparent rounded-3">
                <div className="card-header bg-transparent border-bottom p-3">
                  <div className="d-sm-flex justify-content-between align-items-center">
                    <h5 className="mb-2 mb-sm-0">
                      All Blog Posts{" "}
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        {posts?.length}
                      </span>
                    </h5>
                    <a
                      href="/add-post/"
                      className="btn btn-sm btn-primary mb-0"
                    >
                      Add New <i className="fas fa-plus"></i>
                    </a>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row g-3 align-items-center justify-content-between mb-3">
                    <div className="col-md-8">
                      <form className="rounded position-relative">
                        <input
                          onChange={(e) => handleSearch(e)}
                          className="form-control pe-5 bg-transparent"
                          type="search"
                          placeholder="Search Articles"
                          aria-label="Search"
                        />
                        <button
                          className="btn bg-transparent border-0 px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                          type="submit"
                        >
                          <i className="fas fa-search fs-6 " />
                        </button>
                      </form>
                    </div>
                    <div className="col-md-3">
                      <form>
                        <select
                          onChange={handleSortChange}
                          className="form-select z-index-9 bg-transparent"
                          aria-label=".form-select-sm"
                        >
                          <option value="">Sort by</option>
                          <option value={"Newest"}>Newest</option>
                          <option value={"Oldest"}>Oldest</option>
                        </select>
                      </form>
                    </div>
                  </div>

                  <div className="table-responsive border-0">
                    <table className="table align-middle p-4 mb-0 table-hover table-shrink">
                      {/* Table head */}
                      <thead className="table-dark">
                        <tr>
                          <th scope="col" className="border-0 rounded-start">
                            Image
                          </th>
                          <th scope="col" className="border-0 rounded-start">
                            Article Name
                          </th>
                          <th scope="col" className="border-0">
                            Views
                          </th>
                          <th scope="col" className="border-0">
                            Published Date
                          </th>
                          <th scope="col" className="border-0">
                            Category
                          </th>
                          <th scope="col" className="border-0">
                            Status
                          </th>
                          <th scope="col" className="border-0 rounded-end">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="border-top-0">
                        {posts?.map((p, index) => (
                          <tr key={index}>
                            <td>
                              <Link to={`/detail/${p.slug}/`}>
                                <img
                                  src={p.image_url}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                  }}
                                  alt="image is not rendering"
                                />
                              </Link>
                            </td>
                            <td>
                              <h6 className="mt-2 mt-md-0 mb-0 ">
                                <Link
                                  to={`/detail/${p.slug}/`}
                                  className="text-dark text-decoration-none"
                                >
                                  {p?.title}
                                </Link>
                              </h6>
                            </td>
                            <td>
                              <h6 className="mb-0">
                                <a
                                  href="#"
                                  className="text-dark text-decoration-none"
                                >
                                  {p.view} Views
                                </a>
                              </h6>
                            </td>
                            <td>{moment(p.date)}</td>
                            <td>{p.category?.title}</td>
                            <td>
                              <span className="badge bg-dark bg-opacity-10 text-dark mb-2">
                                {p?.status}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link
                                  to={`/edit-post/${p.id}/`}
                                  className="btn btn-primary btn-round mb-0"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil-square" />
                                </Link>
                                <button
                                  onClick={() => handleDeletePost(p.id)}
                                  className="btn-round mb-0 btn btn-danger"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  title="Delete"
                                  type="button"
                                >
                                  <i className="bi bi-trash" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </PrivateRoute>
  );
}

export default Posts;
