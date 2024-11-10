import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdDashboardCustomize,
  MdOutlineAdminPanelSettings,
  MdOutlinePolicy,
  MdOutlineRateReview,
} from "react-icons/md";
import { CiShop } from "react-icons/ci";
import {
  FaUser,
  FaQuestionCircle,
  FaUsers,
  FaShoppingBag,
} from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import {
  RiAdminLine,
  RiMoneyCnyCircleLine,
  RiMoneyDollarBoxFill,
  RiSecurePaymentLine,
} from "react-icons/ri";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Login from "../components/Account/Login";
import useAuth from "../hooks/useAuth";
import usePermission from "../hooks/usePermission";
import orderRequestAPI from "../api/orderRequest";
import { AiOutlineMenu } from "react-icons/ai";
import { VscLayoutMenubar } from "react-icons/vsc";

const DashBoardLayout = () => {
  const { loading } = useAuth();
  const [rolePermission, isPermissionLoading] = usePermission("admin_pages");
  const [methodPayOpen, setMethodPayOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [usersManagementOpen, setusersManagementOpen] = useState(false);

  const [orderRequests, setOrderRequests] = useState(0);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSupport = () => setSupportOpen(!supportOpen);
  const toggleUsers = () => setUsersOpen(!usersOpen);
  const toggleUsersManagement = () =>
    setusersManagementOpen(!usersManagementOpen);
  useEffect(() => {
    const fetchOrderReq = async () => {
      try {
        const res = await orderRequestAPI.getAllCancelReq();
        const pendingOrders = res?.requests?.filter(
          (order) => order.status === "Pending"
        );
        setOrderRequests(pendingOrders.length);
      } catch (error) {
        console.error("Error fetching order requests:", error);
      }
    };

    fetchOrderReq();
  }, []);

  const handleOrderRequestsClick = () => {
    setOrderRequests(0);
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
                    location.pathname === "/admin" ? "text-green" : ""
                  }`}
                  to="/admin"
                >
                  <MdDashboard />
                  Thống kê
                </Link>
              </li>
              <li>
                <div
                  onClick={toggleMenu}
                  className="cursor-pointer flex items-center active-link"
                >
                  <VscLayoutMenubar />
                  <span>Quản lý sản phẩm trên hệ thống</span>
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
                        Sản phẩm trên menu hệ thống
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith(
                            "/admin/request-send-to-menu"
                          )
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/request-send-to-menu"
                      >
                        <AiOutlineMenu />
                        Các yêu cầu sản phẩm
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname.startsWith("/admin/category")
                      ? "text-green"
                      : ""
                  }`}
                  to="/admin/category"
                >
                  <FaShoppingBag />
                  Quản lý danh mục
                </Link>
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname === "/admin/users" ? "text-green" : ""
                  }`}
                  to="/admin/users"
                >
                  <FaUsers />
                  Quản lý người dùng hệ thống
                </Link>
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname === "/admin/management-shops"
                      ? "text-green"
                      : ""
                  }`}
                  to="/admin/management-shops"
                >
                  <CiShop />
                  Quản lý của hàng trên hệ thống
                </Link>
              </li>

              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname.startsWith("/admin/method-pay")
                      ? "text-green"
                      : ""
                  }`}
                  to="/admin/method-pay"
                >
                  <RiSecurePaymentLine />
                  Quản lý phương thức thanh toán
                </Link>
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname.startsWith("/admin/transactions")
                      ? "text-green"
                      : ""
                  }`}
                  to="/admin/transactions"
                >
                  <RiMoneyDollarBoxFill />
                  Quản lý giao dịch
                </Link>
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname.startsWith("/admin/comission-policy")
                      ? "text-green"
                      : ""
                  }`}
                  to="/admin/comission-policy"
                >
                  <MdOutlinePolicy />
                  Quản lý chính sách hoa hồng
                </Link>
              </li>

              <li>
                <div
                  onClick={toggleUsers}
                  className="cursor-pointer flex items-center active-link"
                >
                  <FaUsers />
                  Quản lý cấp bậc
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
                          location.pathname.startsWith("/admin/user-rank")
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/user-rank"
                      >
                        <FaRankingStar />
                        Cấp bậc người dùng
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/admin/shop-rank")
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/shop-rank"
                      >
                        <FaRankingStar />
                        Cấp bậc của hàng
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
              <li>
                <div
                  onClick={() => {
                    toggleSupport();
                  }}
                  className="cursor-pointer flex items-center active-link"
                >
                  <FaQuestionCircle />
                  <span>Hỗ trợ khách hàng</span>
                  {supportOpen ? (
                    <IoIosArrowUp className="ml-auto" />
                  ) : (
                    <IoIosArrowDown className="ml-auto" />
                  )}
                  {orderRequests > 0 && (
                    <span className="badge badge-error text-white ml-2">
                      {orderRequests}
                    </span>
                  )}
                </div>
                {supportOpen && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        onClick={() => {
                          handleOrderRequestsClick();
                        }}
                        className={`active-link-2 ${
                          location.pathname.startsWith("/admin/order-requests")
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/order-requests"
                      >
                        <FaQuestionCircle />
                        Yêu cầu đơn hàng
                        {orderRequests > 0 && (
                          <span className="badge badge-error text-white ml-2">
                            {orderRequests}
                          </span>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/admin/feedbacks")
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/feedbacks"
                      >
                        <FaQuestionCircle />
                        Phản hồi
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/admin/help-users")
                            ? "text-green"
                            : ""
                        }`}
                        to="/admin/help-users"
                      >
                        <FaQuestionCircle />
                        Hỗ trợ người dùng
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <div
                  onClick={toggleUsersManagement}
                  className="cursor-pointer flex items-center active-link"
                >
                  <MdOutlineAdminPanelSettings />
                  Quản lý kiểm soát truy cập
                  {usersManagementOpen ? (
                    <IoIosArrowUp className="ml-auto" />
                  ) : (
                    <IoIosArrowDown className="ml-auto" />
                  )}
                </div>
              </li>
              {usersManagementOpen && (
                <ul className="ml-4">
                  <li>
                    <Link
                      className={`active-link-2 ${
                        location.pathname.startsWith(
                          "/admin/management-permissions"
                        )
                          ? "text-green"
                          : ""
                      }`}
                      to="/admin/management-permissions"
                    >
                      <RiAdminLine />
                      Quản lý quyền truy cập
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`active-link-2 ${
                        location.pathname === "/admin/management-roles"
                          ? "text-green"
                          : ""
                      }`}
                      to="/admin/management-roles"
                    >
                      <MdOutlineAdminPanelSettings />
                      Quản lý vai trò người dùng
                    </Link>
                  </li>
                </ul>
              )}
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname.startsWith("/admin/settings")
                      ? "text-green"
                      : ""
                  }`}
                  to="/admin/settings"
                >
                  <RiMoneyCnyCircleLine />
                  Cài đặt
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default DashBoardLayout;
