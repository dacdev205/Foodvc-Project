/* eslint-disable react/prop-types */
import React, { useContext, useState, useRef, useEffect } from "react";
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
        // Handle error
      });
  };

  const { loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const closeDrawer = () => {
    // Lấy thẻ input drawer và thực hiện click để đóng drawer
    const drawerCheckbox = document.getElementById("my-drawer-4");
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
  };
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div>
      <div
        className={`drawer drawer-end z-50 ${drawerOpen ? "open" : ""}`}
        ref={drawerRef}
      >
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-ghost btn-circle avatar"
            onClick={toggleDrawer}
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
            className={`drawer-overlay ${drawerOpen ? "open" : ""}`}
            onClick={() => setDrawerOpen(false)}
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-white text-black">
            {/* Sidebar content here */}
            <li>
              <Link
                className="active-link"
                to="/update-profile"
                onClick={() => closeDrawer()}
              >
                Trang cá nhân
              </Link>
            </li>
            <li>
              <Link
                className="active-link"
                to="orders"
                onClick={() => closeDrawer()}
              >
                Đặt hàng
              </Link>
            </li>
            {isAdmin ? (
              <li>
                <Link
                  className="active-link"
                  to="/admin"
                  onClick={() => closeDrawer()}
                >
                  Trang quản lý
                </Link>
              </li>
            ) : (
              ""
            )}
            <li>
              <a className="active-link">Cài đặt</a>
            </li>
            <li>
              <a className="active-link" onClick={handleLogout}>
                Đăng xuất
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
