import { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast";
import PrivateRoute from "../../layouts/PrivateRoute";

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [noti, setNoti] = useState([]);

  const userId = useUserData()?.user_id;
  // console.log(`userid: ${userId}`);

  const fetchDashboardData = async () => {
    const stats_res = await apiInstance.get(
      `author/dashboard/stats/${userId}/`
    );
    setStats(stats_res.data[0]);

    const post_res = await apiInstance.get(`author/dashboard/posts/${userId}/`);
    setPosts(post_res.data);

    const comment_res = await apiInstance.get(
      `author/dashboard/comments/${userId}/`
    );
    setComments(comment_res.data);

    const noti_res = await apiInstance.get(
      `author/dashboard/notifications/${userId}/`
    );
    setNoti(noti_res.data);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // console.log(stats);

  const handleMarkNotiAsSeen = async (notiId) => {
    const response = await apiInstance.post(
      "author/dashboard/mark-notification/",
      { noti_id: notiId }
    );
    console.log(response.data);
    fetchDashboardData();
    Toast("success", "Notification Seen", "");
  };

  return (
    <PrivateRoute>
      <Header />
      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-12">
              <div className="row g-4">
                <div className="col-sm-6 col-lg-3">
                  <div className="card card-body border p-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-xl fs-1 p-3 bg-success bg-opacity-10 rounded-3 text-success">
                        <i className="bi bi-people-fill" />
                      </div>
                      <div className="ms-3">
                        <h3>{stats.views}</h3>
                        <h6 className="mb-0">Total Views</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="card card-body border p-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-xl fs-1 p-3 bg-primary bg-opacity-10 rounded-3 text-primary">
                        <i className="bi bi-file-earmark-text-fill" />
                      </div>
                      <div className="ms-3">
                        <h3>{stats.posts}</h3>
                        <h6 className="mb-0">Posts</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="card card-body border p-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-xl fs-1 p-3 bg-danger bg-opacity-10 rounded-3 text-danger">
                        <i className="bi bi-suit-heart-fill" />
                      </div>
                      <div className="ms-3">
                        <h3>{stats.likes ? stats.likes : 0}</h3>
                        <h6 className="mb-0">Likes</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="card card-body border p-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-xl fs-1 p-3 bg-info bg-opacity-10 rounded-3 text-info">
                        <i className="bi bi-tag" />
                      </div>
                      <div className="ms-3">
                        <h3>{stats.bookmarks}</h3>
                        <h6 className="mb-0">Bookmarks</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="col-md-6 col-xxl-4">
              <div className="card border h-100">
                {" "}
                <div className="card-header border-bottom d-flex justify-content-between align-items-center p-3">
                  <h5 className="card-header-title mb-0">
                    All Posts ({stats.posts})
                  </h5>
                  <div className="dropdown text-end">
                    <i className="bi bi-grid-fill text-danger fa-fw" />
                  </div>
                </div>
                <div className="card-body p-3">
                  {posts?.slice(0, 3).map((p, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex">
                        <img
                          src={p.image}
                          style={{
                            width: "100px",
                            height: "100px", // Made square
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                          alt={p.title}
                        />
                        <div className="ms-3 flex-grow-1">
                          <Link
                            to={`/detail/${p.slug}/`}
                            className="h6 text-decoration-none text-dark d-block"
                          >
                            {p.title}
                          </Link>
                          <div className="small mt-2">
                            <p className="mb-1">
                              <i className="fas fa-calendar me-2"></i>
                              {moment(p.date)}
                            </p>
                            <p className="mb-1">
                              <i className="fas fa-eye me-2"></i>
                              {p.view} Views
                            </p>
                            <p className="mb-0">
                              <i className="fas fa-thumbs-up me-2"></i>
                              {p.likes?.length} Likes
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < posts.length - 1 && <hr className="my-3" />}{" "}
                      {/* Only show divider if not last item */}
                    </div>
                  ))}
                </div>
                <div className="card-footer border-top text-center p-2">
                  {" "}
                  {/* Reduced padding */}
                  <Link
                    to="/posts/"
                    className="fw-bold text-decoration-none text-dark"
                  >
                    View all Posts
                  </Link>
                </div>
              </div>
            </div>
            {/* comments */}
            <div className="col-md-6 col-xxl-4">
              <div className="card border h-100">
                {" "}
                <div className="card-header border-bottom d-flex justify-content-between align-items-center p-3">
                  <h5 className="card-header-title mb-0">
                    Comments ({comments?.length})
                  </h5>
                  <div className="dropdown text-end">
                    <i className="bi bi-chat-left-quote-fill text-success fa-fw" />
                  </div>
                </div>
                <div className="card-body p-3">
                  {comments?.slice(0, 3).map((c, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex">
                        <img
                          src="https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                          alt="avatar"
                        />
                        <div className="ms-3 flex-grow-1">
                          <p className="mb-1">{c.comment}</p>
                          <small className="text-muted">
                            by {c.name} • {moment(c.date)}
                          </small>
                        </div>
                      </div>
                      {index < comments.length - 1 && <hr className="my-3" />}
                    </div>
                  ))}
                </div>
                <div className="card-footer border-top text-center p-2">
                  <Link
                    to="/comments/"
                    className="fw-bold text-decoration-none text-dark"
                  >
                    View all Comments
                  </Link>
                </div>
              </div>
            </div>
            {/* notification */}
            <div className="col-md-6 col-xxl-4">
              <div className="card border h-100">
                {" "}
                <div className="card-header border-bottom d-flex justify-content-between align-items-center p-3">
                  <h5 className="card-header-title mb-0">Notifications</h5>
                  <div className="dropdown text-end">
                    <i className="fas fa-bell text-warning fa-fw" />
                  </div>
                </div>
                <div className="card-body p-3">
                  {noti?.slice(0, 3).map((n, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          {n.type === "Like" && (
                            <i className="fas fa-thumbs-up text-primary fs-5" />
                          )}
                          {n.type === "Comment" && (
                            <i className="bi bi-chat-left-quote-fill text-success fs-5" />
                          )}
                          {n.type === "Bookmark" && (
                            <i className="fas fa-bookmark text-danger fs-5" />
                          )}
                        </div>
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{n.type}</h6>
                          <p className="mb-1 small">
                            {n.type === "Like" &&
                              `Someone liked your post "${n.post?.title?.slice(0, 30)}..."`}
                            {n.type === "Comment" &&
                              `New comment on "${n.post?.title?.slice(0, 30)}..."`}
                            {n.type === "Bookmark" &&
                              `Someone bookmarked "${n.post?.title?.slice(0, 30)}..."`}
                          </p>
                          <div className="d-flex align-items-center">
                            <small className="text-muted me-2">5 min ago</small>
                            <button
                              onClick={() => handleMarkNotiAsSeen(n.id)}
                              className="btn btn-sm btn-secondary"
                            >
                              <i className="fas fa-check-circle"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      {index < noti.length - 1 && <hr className="my-3" />}
                    </div>
                  ))}
                </div>
                <div className="card-footer border-top text-center p-2">
                  <Link
                    to="/notifications/"
                    className="fw-bold text-decoration-none text-dark"
                  >
                    View all Notifications
                  </Link>
                </div>
              </div>
            </div>

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
                  {/* Blog list table START */}
                  <div className="table-responsive border-0">
                    <table className="table align-middle p-4 mb-0 table-hover table-shrink">
                      {/* Table head */}
                      <thead className="table-dark">
                        <tr>
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
                              <h6 className="mt-2 mt-md-0 mb-0 ">
                                <a
                                  href={`/detail/${p.slug}/`}
                                  className="text-dark text-decoration-none"
                                >
                                  {p?.title}
                                </a>
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
                                {p.status}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <a
                                  href="#"
                                  className="btn-round mb-0 btn btn-danger"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  title="Delete"
                                >
                                  <i className="bi bi-trash" />
                                </a>
                                <a
                                  href="dashboard-post-edit.html"
                                  className="btn btn-primary btn-round mb-0"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil-square" />
                                </a>
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

export default Dashboard;
