import React, { useState, useEffect } from "react";
import { MdDashboardCustomize } from "react-icons/md";
import { Link, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Avatar } from "@mui/material";
import { FaPen } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { BiNotepad } from "react-icons/bi";
import { useActiveLink } from "../context/ActiveLinkProvider";

const AccountManagement = () => {
  const { user } = useAuth();
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const location = useLocation();
  const { setActiveLink } = useActiveLink();
  useEffect(() => {
    console.log("User photoURL:", user.photoURL);
  }, [user.photoURL]);

  useEffect(() => {
    setActiveLink(location.pathname);
    const isUserProfileActive = [
      "/user/update-profile",
      "/user/addresses",
      "/user/change-password",
    ].some((path) => location.pathname.startsWith(path));
    setUserProfileOpen(isUserProfileActive);
  }, [location, setActiveLink]);

  const toggleUserProfile = () => {
    setUserProfileOpen(!userProfileOpen);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div>
      <div className="drawer sm:drawer-open mt-16">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2 bg-white">
          <div className="flex items-center justify-between mx-4 bg-white">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-primary drawer-button lg:hidden"
            >
              <MdDashboardCustomize />
            </label>
            <button className="btn btn-primary rounded-full items-center gap-2 px-6 bg-green text-white sm:hidden">
              Log out
            </button>
          </div>
          <div className="mt-5 md:mt-2 mx-4 bg-white">
            <Outlet />
          </div>
        </div>
        <div className="drawer-side shadow-md rounded-sm">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-screen text-black bg-white shadow-md rounded-sm">
            <div className="p-4 flex">
              <div className="mr-2">
                <Avatar fontSize="small" sx={{ width: 42, height: 42 }}>
                  <img
                    alt="avatar"
                    src={user.photoURL || "/images/user.png"}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                </Avatar>
              </div>
              <div>
                <p className="font-bold">{user.displayName}</p>
                <div>
                  <Link to="update-profile" className="flex items-center">
                    <FaPen className="mr-1" /> <span>Sửa hồ sơ</span>
                  </Link>
                </div>
              </div>
            </div>

            <li>
              <div
                onClick={toggleUserProfile}
                className="cursor-pointer flex items-center active-link"
              >
                <CiUser />
                <span>Tài khoản của tôi</span>
                {userProfileOpen ? (
                  <IoIosArrowUp className="ml-auto" />
                ) : (
                  <IoIosArrowDown className="ml-auto" />
                )}
              </div>
              {userProfileOpen && (
                <ul className="ml-4">
                  <li>
                    <Link
                      className={`active-link-2 ${
                        isActive("/user/update-profile") ? "text-green" : ""
                      }`}
                      to="update-profile"
                    >
                      Hồ sơ
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`active-link-2 ${
                        isActive("/user/addresses") ? "text-green" : ""
                      }`}
                      to="addresses"
                    >
                      Địa chỉ
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`active-link-2 ${
                        isActive("/user/change-password") ? "text-green" : ""
                      }`}
                      to="change-password"
                    >
                      Đổi mật khẩu
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link
                to="orders"
                className={`active-link-2 ${
                  isActive("/user/orders") ? "text-green" : ""
                }`}
              >
                <BiNotepad />
                Đơn mua
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
