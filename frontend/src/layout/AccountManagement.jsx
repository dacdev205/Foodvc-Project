import React, { useState } from "react";
import { MdDashboardCustomize } from "react-icons/md";
import { Link, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Avatar } from "@mui/material";
import { FaPen } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { BiNotepad } from "react-icons/bi";
const AccountManagement = () => {
  const { user } = useAuth();
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const toggleUserProfile = () => {
    setUserProfileOpen(!userProfileOpen);
  };
  return (
    <div>
      <div>
        <div className="drawer sm:drawer-open mt-16">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2 bg-white ">
            {/* Page content here */}
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
              {/* Sidebar content here */}
              <div className=" p-4 flex">
                <div className="mr-2 ">
                  <Avatar fontSize="small" sx={{ width: 42, height: 42 }}>
                    {user.photoURL ? (
                      <Link to="update-profile">
                        <img alt="avatar" src={user.photoURL} />
                      </Link>
                    ) : (
                      <Link to="update-profile">
                        <img alt="avatar" src="/images/user.png" />
                      </Link>
                    )}
                  </Avatar>{" "}
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
                      <Link className="active-link-2" to="update-profile">
                        Hồ sơ
                      </Link>
                    </li>
                    <li>
                      <Link className="active-link-2" to="#">
                        Địa chỉ
                      </Link>
                    </li>
                    <li>
                      <Link className="active-link-2" to="/verify/password">
                        Đổi mật khẩu
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="orders" className="active-link-2">
                  <BiNotepad />
                  Đơn mua
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
