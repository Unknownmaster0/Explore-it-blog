import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import Swal from "sweetalert2";
import PrivateRoute from "../../layouts/PrivateRoute";

function EditPost() {
  // State for edited post data
  const [post, setPost] = useState({
    title: "",
    description: "",
    category: null,
    tags: "",
    status: "Active",
    image: null,
  });

  // State for original post data - used for comparison
  const [originalPost, setOriginalPost] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const userId = useUserData()?.user_id;
  const navigate = useNavigate();
  const params = useParams();

  const fetchPost = async () => {
    try {
      const response = await apiInstance.get(
        `author/dashboard/post-detail/${userId}/${params.postId}/`
      );

      const postData = response.data;
      setOriginalPost(postData); // original post data

      // Set current editing data
      setPost({
        title: postData.title,
        description: postData.description,
        category: postData.category,
        tags: postData.tags,
        status: postData.status,
        image: postData.image,
      });

      setImagePreview(postData.image);
    } catch (error) {
      Toast(
        "error",
        error.response?.data?.message || "Failed to load post data"
      );
    } finally {
      setIsFetching(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiInstance.get("post/category/list/");
      setCategoryList(response.data);
    } catch (error) {
      Toast("error", "Failed to load categories");
    }
  };

  useEffect(() => {
    if (userId && params.postId) {
      fetchPost();
      fetchCategories();
    }
  }, [userId, params.postId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: name === "category" ? parseInt(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const sleectedFile = e.target.files[0];
    const reader = new FileReader();

    setPost({
      ...post,
      image: {
        file: sleectedFile,
        preview: reader.result,
      },
    });

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (sleectedFile) reader.readAsDataURL(sleectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Only append changed fields
      if (post.title !== originalPost.title) {
        formData.append("title", post.title);
      }
      if (post.description !== originalPost.description) {
        formData.append("description", post.description);
      }
      if (post.tags !== originalPost.tags) {
        formData.append("tags", post.tags);
      }
      if (post.status !== originalPost.status) {
        formData.append("status", post.status);
      }
      if (post.category?.id !== originalPost.category?.id) {
        formData.append("category", post.category.id);
      }
      if (post.image?.file) {
        formData.append("image", post.image.file);
      }

      // Only make request if there are changes
      if ([...formData.entries()].length > 0) {
        // console.log("FormData contents:");
        // for (let pair of formData.entries()) {
        //   console.log(pair[0] + ": " + pair[1]);
        // }
        // console.log(formData.get("image"));
        await apiInstance.post(
          `author/dashboard/update-post/${userId}/${params.postId}/`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Post Updated Successfully",
        });
        navigate("/posts/");
      } else {
        Toast("info", "No changes to update");
      }
    } catch (error) {
      Toast("error", error.response?.data?.message || "Error updating post");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <PrivateRoute>
      <Header />
      <section className="pt-5 pb-5">
        <div className="container">
          <div className="row mt-0 mt-md-4">
            <div className="col-lg-12">
              <section className="py-4 py-lg-6 bg-primary rounded-3">
                <div className="container">
                  <div className="row">
                    <div className="offset-lg-1 col-lg-10">
                      <div className="d-lg-flex align-items-center justify-content-between">
                        <div className="mb-4 mb-lg-0">
                          <h1 className="text-white mb-1">Update Blog Post</h1>
                          <p className="mb-0 text-white lead">
                            Update your article details below
                          </p>
                        </div>
                        <div>
                          <Link to="/posts/" className="btn btn-light">
                            <i className="fas fa-arrow-left"></i> Back to Posts
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <form onSubmit={handleSubmit} className="pb-8 mt-5">
                <div className="card mb-3">
                  <div className="card-header border-bottom px-4 py-3">
                    <h4 className="mb-0">Basic Information</h4>
                  </div>
                  <div className="card-body">
                    {/* Image Preview */}
                    {(imagePreview || post.image) && (
                      <div className="mb-3">
                        <label className="form-label">Preview</label>
                        <img
                          src={imagePreview || post.image}
                          alt={post.title || "Post preview"}
                          className="img-fluid rounded"
                          style={{
                            maxHeight: "330px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}

                    {/* Image Upload */}
                    <div className="mb-3">
                      <label className="form-label">Thumbnail</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </div>

                    {/* Title */}
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={post.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        name="category"
                        value={post.category?.id || ""}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categoryList.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="10"
                        value={post.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Tags */}
                    <div className="mb-3">
                      <label className="form-label">Tags</label>
                      <input
                        type="text"
                        className="form-control"
                        name="tags"
                        value={post.tags}
                        onChange={handleInputChange}
                        placeholder="Enter tags separated by commas"
                      />
                    </div>

                    {/* Status */}
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={post.status}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn btn-lg w-100 ${isLoading ? "btn-secondary" : "btn-success"}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      Updating Post... <i className="fas fa-spinner fa-spin" />
                    </>
                  ) : (
                    <>
                      Update Post <i className="fas fa-check-circle" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </PrivateRoute>
  );
}

export default EditPost;
