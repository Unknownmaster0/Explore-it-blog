import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { useNavigate } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import PrivateRoute from "../../layouts/PrivateRoute";

function Profile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    image: null,
    full_name: "",
    about: "",
    bio: "",
    facebook: "",
    twitter: "",
    country: "",
  });
  const userId = useUserData()?.user_id;

  const [loading, setLoading] = useState(false);

  const fetchProfile = () => {
    (async () => {
      try {
        const res = await apiInstance.get(`user/profile/${userId}/`);
        setProfileData(res.data);
      } catch (error) {
        Toast("error", "Error fetching profile data");
        console.log(error);
      }
    })();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Only append text fields that are not related to the user object
      if (profileData.about) formData.append("about", profileData.about);
      if (profileData.bio) formData.append("bio", profileData.bio);
      if (profileData.country) formData.append("country", profileData.country);
      if (profileData.facebook)
        formData.append("facebook", profileData.facebook);
      if (profileData.twitter) formData.append("twitter", profileData.twitter);

      if ([...formData.entries()].length > 0) {
        // console.log("FormData contents:");
        // for (let pair of formData.entries()) {
        //   console.log(pair[0] + ": " + pair[1]);
        // }
        const response = await apiInstance.patch(
          `user/update-profile/${userId}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          Toast("success", "Profile updated successfully");
          fetchProfile();
          navigate("/");
        }
      } else {
        Toast("info", "No changes to update");
      }
    } catch (error) {
      Toast("error", error.response?.data?.message || "Error updating profile");
      console.error("Error details:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  console.log(profileData);

  return (
    <PrivateRoute>
      <Header />
      <section className="pt-5 pb-5">
        <div className="container">
          <div className="row mt-0 mt-md-4">
            <div className="col-lg-12 col-md-8 col-12">
              {/* Card */}
              <div className="card">
                {/* Card header */}
                <div className="card-header">
                  <h3 className="mb-0">Profile Details</h3>
                  <p className="mb-0">
                    You have full control to manage your own account setting.
                  </p>
                </div>
                {/* Card body */}
                <form className="card-body" onSubmit={handleFormSubmit}>
                  <div>
                    {/* Form */}
                    <div className="row gx-3">
                      {/* full name */}
                      <div className="mb-3 col-12 col-md-12">
                        <label className="form-label" htmlFor="fname">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fname"
                          className="form-control"
                          placeholder="First Name"
                          required=""
                          onChange={handleProfileChange}
                          name="full_name"
                          value={profileData?.user?.full_name}
                          disabled
                        />
                        <div className="invalid-feedback">
                          Please enter first name.
                        </div>
                      </div>

                      {/* about me */}
                      <div className="mb-3 col-12 col-md-12">
                        <label className="form-label" htmlFor="lname">
                          About Me
                        </label>
                        <textarea
                          onChange={handleProfileChange}
                          name="about"
                          id=""
                          cols="30"
                          value={profileData?.about}
                          rows="5"
                          className="form-control"
                        ></textarea>
                      </div>

                      {/* bio */}
                      <div className="mb-3 col-12 col-md-12">
                        <label className="form-label" htmlFor="editCountry">
                          Bio
                        </label>
                        <input
                          type="text"
                          id="bio"
                          className="form-control"
                          placeholder=""
                          required=""
                          value={profileData?.bio}
                          onChange={handleProfileChange}
                          name="bio"
                        />
                        <div className="invalid-feedback">
                          Please choose country.
                        </div>
                      </div>

                      {/* country */}
                      <div className="mb-3 col-12 col-md-12">
                        <label className="form-label" htmlFor="editCountry">
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          className="form-control"
                          placeholder="Country"
                          required=""
                          value={profileData?.country}
                          onChange={handleProfileChange}
                          name="country"
                        />
                        <div className="invalid-feedback">
                          Please choose country.
                        </div>
                      </div>

                      {/* facebook */}
                      <div className="mb-3 col-12 col-md-12">
                        <label className="form-label" htmlFor="editCountry">
                          Facebook
                        </label>
                        <input
                          type="text"
                          id="facebook"
                          className="form-control"
                          placeholder="facebook-id"
                          required=""
                          value={profileData?.facebook}
                          onChange={handleProfileChange}
                          name="facebook"
                        />
                      </div>

                      {/* twitter handle */}
                      <div className="mb-3 col-12 col-md-12">
                        <label className="form-label" htmlFor="editCountry">
                          Twitter
                        </label>
                        <input
                          type="text"
                          id="twitter"
                          className="form-control"
                          placeholder="twitter-handle"
                          required=""
                          value={profileData?.twitter}
                          onChange={handleProfileChange}
                          name="twitter"
                        />
                      </div>

                      {/* Button */}
                      <div className="col-12">
                        <button className="btn btn-primary" type="submit">
                          Update Profile <i className="fas fa-check-circle"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </PrivateRoute>
  );
}

export default Profile;
