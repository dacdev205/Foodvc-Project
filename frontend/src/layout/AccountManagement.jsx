import React, { useState, useEffect } from "react";
import { MdDashboardCustomize } from "react-icons/md";
import { Link, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Avatar } from "@mui/material";
import { FaPen } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { CiShop, CiUser, CiWallet } from "react-icons/ci";
import { BiNotepad } from "react-icons/bi";
import { useActiveLink } from "../context/ActiveLinkProvider";
import useUserCurrent from "../hooks/useUserCurrent";
import userAPI from "../api/userAPI";

const AccountManagement = () => {
  const [rank, setRank] = useState(null);
  const [showRankDetails, setShowRankDetails] = useState(false);
  const { user } = useAuth();
  const userData = useUserCurrent();
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const location = useLocation();
  const { setActiveLink } = useActiveLink();

  // Mảng các hạng, từ thấp đến cao, với màu sắc tương ứng
  const ranks = [
    { user_rank_name: "Bronze", user_rank_point: 0, color: "#cd7f32" }, // Màu đồng
    { user_rank_name: "Silver", user_rank_point: 100, color: "#c0c0c0" }, // Màu bạc
    { user_rank_name: "Gold", user_rank_point: 500, color: "#ffd700" }, // Màu vàng
    { user_rank_name: "Platinum", user_rank_point: 1000, color: "#e5e4e2" }, // Màu bạch kim
  ];

  useEffect(() => {
    const fetchRank = async () => {
      if (userData?.rank) {
        try {
          const rankData = await userAPI.getUserRank(userData._id);
          setRank(rankData);
        } catch (error) {
          console.error("Failed to fetch rank:", error);
        }
      }
    };
    fetchRank();
  }, [userData]);

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

  const toggleRankDetails = () => {
    setShowRankDetails(!showRankDetails);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const calculatePointsToNextRank = () => {
    if (rank) {
      const currentRankIndex = ranks.findIndex(
        (r) => r.user_rank_name === rank.rank.user_rank_name
      );

      if (currentRankIndex !== -1 && currentRankIndex < ranks.length - 1) {
        const nextRank = ranks[currentRankIndex + 1];
        return nextRank.user_rank_point - userData.points;
      }
    }
    return null;
  };

  return (
    <div className="drawer sm:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2 bg-slate-50">
        <div className="flex items-center justify-between mx-4 bg-white">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden md:hidden"
          >
            <MdDashboardCustomize />
          </label>
        </div>
        <div className="mt-5 md:mt-2 mx-4 bg-slate-50">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side shadow-md rounded-sm ">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-screen text-black bg-white shadow-md rounded-sm lg:mt-0">
          <div className="p-4 flex">
            <div className="mr-2">
              <Avatar fontSize="small" sx={{ width: 42, height: 42 }}>
                <img
                  alt="avatar"
                  src={user?.photoURL || "/images/user.png"}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                  }}
                />
              </Avatar>
            </div>
            <div>
              <p className="font-bold">{user?.displayName}</p>
              <div>
                <Link to="update-profile" className="flex items-center">
                  <FaPen className="mr-1" /> <span>Sửa hồ sơ</span>
                </Link>
              </div>
              {rank && (
                <div>
                  <span className="font-bold text-black">Hạng của bạn:</span>{" "}
                  <span
                    onClick={toggleRankDetails}
                    className="text-sm cursor-pointer"
                    style={{
                      color: ranks.find(
                        (r) => r.user_rank_name === rank.rank.user_rank_name
                      )?.color,
                    }} // Áp dụng màu
                  >
                    {rank.rank.user_rank_name}
                  </span>
                  {showRankDetails && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Điểm hiện tại: {userData?.points}</p>
                      {calculatePointsToNextRank() !== null ? (
                        <p>
                          Cần thêm: {calculatePointsToNextRank()} điểm để lên
                          hạng{" "}
                          {
                            ranks[
                              ranks.findIndex(
                                (r) =>
                                  r.user_rank_name === rank.rank.user_rank_name
                              ) + 1
                            ].user_rank_name
                          }
                        </p>
                      ) : (
                        <p>Bạn đã đạt hạng cao nhất!</p>
                      )}
                    </div>
                  )}
                </div>
              )}
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
          <li>
            <Link
              to="wallet"
              className={`active-link-2 ${
                isActive("/user/wallet") ? "text-green" : ""
              }`}
            >
              <CiWallet />
              Ví của tôi
            </Link>
          </li>
          {userData?.isSeller === true ? (
            <li>
              <Link
                to="/admin"
                className={`active-link-2 ${
                  isActive("/admin") ? "text-green" : ""
                }`}
              >
                <CiShop />
                Shop của tôi
              </Link>
            </li>
          ) : (
            <li>
              <Link
                to="create-shop"
                className={`active-link-2 ${
                  isActive("/user/create-shop") ? "text-green" : ""
                }`}
              >
                <CiShop />
                Bắt đầu bán
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AccountManagement;
