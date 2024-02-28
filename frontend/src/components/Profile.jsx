/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
const Profile = ({ user }) => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logOut()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  const { loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  return (
    <div>
      <div className="drawer drawer-end z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {user.photoURL ? (
                <img alt="avatar" src={user.photoURL} />
              ) : (
                <img alt="avatar" src="/images/user.png" />
              )}
            </div>
          </label>
        </div>
        <div className="drawer-side overflow-hidden">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <li>
              <a href="/update-profile">Trang cá nhân</a>
            </li>
            <li>
              <Link to="orders">Đặt hàng</Link>
            </li>
            {isAdmin ? (
              <li>
                <Link to="/admin">Trang quản lý</Link>
              </li>
            ) : (
              ""
            )}
            <li>
              <a>Cài đặt</a>
            </li>
            <li>
              <a onClick={handleLogout}>Đăng xuất</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
