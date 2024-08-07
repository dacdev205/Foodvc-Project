import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  MdDashboard,
  MdDashboardCustomize,
  MdOutlineInventory,
  MdOutlineRateReview,
} from "react-icons/md";
import { VscLayoutMenubar } from "react-icons/vsc";
import { CiDiscount1 } from "react-icons/ci";
import { FcStatistics } from "react-icons/fc";
import { BiSolidDiscount } from "react-icons/bi";
import {
  FaWarehouse,
  FaUser,
  FaShoppingBag,
  FaQuestionCircle,
  FaUsers,
  FaPercentage,
} from "react-icons/fa";
import { RiMoneyCnyCircleLine } from "react-icons/ri";
import { IoIosAddCircle, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";
import Login from "../components/Account/Login";
import useAuth from "../hooks/useAuth";
import usePermission from "../hooks/usePermission";
const shareLinks = (
  <>
    <li>
      <Link to="/admin/help-users">
        <FaQuestionCircle />
        Hỗ trợ khách hàng
      </Link>
    </li>
  </>
);
const isAdminDashboard = location.pathname === "/admin";
const DashBoardLayout = () => {
  const { loading } = useAuth();
  const [rolePermission, isPermissionLoading] = usePermission("admin_pages");

  const [promotionsOpen, setPromotionsOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);

  const togglePromotions = () => {
    setPromotionsOpen(!promotionsOpen);
  };

  const toggleInventory = () => {
    setInventoryOpen(!inventoryOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleUsers = () => {
    setUsersOpen(!usersOpen);
  };

  return (
    <div>
      {rolePermission ? (
        <div className="drawer sm:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2 bg-white">
            <div className="flex items-center justify-between mx-4">
              <label
                htmlFor="my-drawer-2"
                className="btn btn-primary drawer-button lg:hidden"
              >
                <MdDashboardCustomize />
              </label>
              <button className="btn btn-primary rounded-full items-center gap-2 px-6 bg-green text-white sm:hidden">
                <FaUser />
                Log out
              </button>
            </div>
            <div className="mt-5 md:mt-2 mx-4 bg-white">
              <Outlet />
            </div>
          </div>
          <div className="drawer-side border shadow-md">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-4 w-80 min-h-full text-black bg-white">
              <li className="font-bold">
                <Link
                  to="/admin"
                  className="flex justify-start mb-3 active-link"
                >
                  Foodvc
                  <span className="badge badge-primary">Admin</span>
                </Link>
              </li>
              <hr />
              <li>
                <Link
                  className={`active-link-2 ${
                    isAdminDashboard ? "text-green" : ""
                  }`}
                  to="/admin"
                >
                  <MdDashboard />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname.startsWith("/admin/users")
                      ? "text-green"
                      : ""
                  }`}
                  to="/admin/users"
                >
                  <FaUser />
                  Quản lý người dùng
                </Link>
              </li>
              <li>
                <div
                  onClick={toggleUsers}
                  className="cursor-pointer flex items-center active-link"
                >
                  <FaUsers />
                  Quản lý khách hàng
                  {usersOpen ? (
                    <IoIosArrowUp className="ml-auto" />
                  ) : (
                    <IoIosArrowDown className="ml-auto" />
                  )}
                </div>
                {usersOpen && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/admin/statistics")
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/statistics"
                      >
                        <FcStatistics />
                        Thống kê đơn hàng và doanh thu
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/admin/reviews")
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/reviews"
                      >
                        <FaPercentage />
                        Tỷ lệ đánh giá sản phẩm
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <div
                  onClick={toggleInventory}
                  className="cursor-pointer flex items-center active-link"
                >
                  <FaWarehouse />
                  <span>Quản lý kho</span>
                  {inventoryOpen ? (
                    <IoIosArrowUp className="ml-auto" />
                  ) : (
                    <IoIosArrowDown className="ml-auto" />
                  )}
                </div>
                {inventoryOpen && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith(
                            "/admin/manage-inventory"
                          )
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/manage-inventory"
                      >
                        <MdOutlineInventory />
                        Sản phẩm trong kho
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/admin/add-inventory")
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/add-inventory"
                      >
                        <IoIosAddCircle />
                        Nhập kho
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <div
                  onClick={toggleMenu}
                  className="cursor-pointer flex items-center active-link"
                >
                  <VscLayoutMenubar />
                  <span>Quản lý menu</span>
                  {menuOpen ? (
                    <IoIosArrowUp className="ml-auto" />
                  ) : (
                    <IoIosArrowDown className="ml-auto" />
                  )}
                </div>
                {menuOpen && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/admin/manage-menu")
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/manage-menu"
                      >
                        <AiOutlineMenu />
                        Sản phẩm trên menu
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/admin/manage-menu")
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/manage-menu"
                      >
                        <AiOutlineMenu />
                        Thống kê sản phẩm đã bán
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <div
                  onClick={togglePromotions}
                  className="cursor-pointer flex items-center active-link"
                >
                  <img
                    width="12px"
                    src="/images/price-tag.png"
                    alt="Promotion Icon"
                  />
                  <span>Quản lý khuyến mãi</span>
                  {promotionsOpen ? (
                    <IoIosArrowUp className="ml-auto" />
                  ) : (
                    <IoIosArrowDown className="ml-auto" />
                  )}
                </div>
                {promotionsOpen && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/admin/add-voucher")
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/add-voucher"
                      >
                        <CiDiscount1 /> Giảm Giá Sản Phẩm
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/admin/create-voucher")
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/create-voucher"
                      >
                        <BiSolidDiscount /> Mã Giảm Giá
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname.startsWith("/admin/order-tracking")
                      ? "text-green"
                      : ""
                  }`}
                  to="/admin/order-tracking"
                >
                  <FaShoppingBag />
                  Quản lý đơn hàng
                </Link>
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname.startsWith("/admin/reviews")
                      ? "text-green"
                      : ""
                  }`}
                  to="/admin/reviews"
                >
                  <MdOutlineRateReview />
                  Quản lý đánh giá
                </Link>
              </li>

              <hr />
              {shareLinks}
            </ul>
          </div>
        </div>
      ) : loading ? (
        <Login />
      ) : (
        <div className="h-screen flex justify-center items-center">
          <Link to="/">
            <button className="btn bg-green text-white">Back to Home</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashBoardLayout;
