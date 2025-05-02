import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast";
import PrivateRoute from "../../layouts/PrivateRoute";

function Comments() {
  const [comments, setComments] = useState([]);
  const [reply, setReply] = useState("");
  const userId = useUserData()?.user_id;

  const fetchComment = async () => {
    const response = await apiInstance.get(
      `author/dashboard/comments/${userId}/`
    );
    setComments(response.data);
  };

  useEffect(() => {
    fetchComment();
  }, []);

  const handleSubmitReply = async (commentId) => {
    try {
      const response = await apiInstance.post(
        `author/dashboard/reply-comment/`,
        {
          comment_id: commentId,
          reply: reply,
        }
      );
      console.log(response.data);
      fetchComment();
      Toast("success", "Reply Sent.", "");
      setReply("");
    } catch (error) {
      console.log(error);
      Toast("error", "Something Wrong");
    }
  };

  return (
    <PrivateRoute>
      <Header />
      <section className="pt-5 pb-5">
        <div className="container">
          <div className="row mt-0 mt-md-4">
            <div className="col-lg-12 col-md-8 col-12">
              {/* Card */}
              <div className="card mb-4">
                {/* Card header */}
                <div className="card-header d-lg-flex align-items-center justify-content-between">
                  <div className="mb-3 mb-lg-0">
                    <h3 className="mb-0">Comments</h3>
                    <span>
                      You have full control to manage your own comments.
                    </span>
                  </div>
                </div>
                {/* Card body */}
                <div className="card-body">
                  {/* List group */}
                  <ul className="list-group list-group-flush">
                    {/* List group item */}
                    {comments?.map((c, index) => (
                      <li className="list-group-item p-4 shadow rounded-3 mb-3">
                        <div className="d-flex">
                          <img
                            src="https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
                            alt="avatar"
                            className="rounded-circle avatar-lg"
                            style={{
                              width: "70px",
                              height: "70px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                          <div className="ms-3 mt-2">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h4 className="mb-0">{c.name}</h4>
                                <span>{Moment(c.date)}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="mt-2">
                                <span className="fw-bold me-2">
                                  <i className="fas fa-arrow-right"></i>
                                </span>
                                {c.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
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

export default Comments;
