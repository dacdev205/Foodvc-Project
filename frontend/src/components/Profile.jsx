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
        // Xử lý lỗi nếu cần
      });
  };
  const { loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();

  const closeDrawer = () => {
    // Lấy thẻ input drawer và thực hiện click để đóng drawer
    const drawerCheckbox = document.getElementById("my-drawer-4");
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
  };

  return (
    <div>
      <div className="drawer drawer-end z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Nội dung trang ở đây */}
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
            onClick={closeDrawer} // Thêm sự kiện onClick để đóng drawer
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-white text-black">
            {/* Nội dung thanh bên ở đây */}
            <li>
              <Link
                className="active-link"
                to="/update-profile"
                onClick={closeDrawer}
              >
                Trang cá nhân
              </Link>
            </li>
            <li>
              <Link className="active-link" to="orders" onClick={closeDrawer}>
                Đặt hàng
              </Link>
            </li>
            {isAdmin ? (
              <li>
                <Link className="active-link" to="/admin" onClick={closeDrawer}>
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
