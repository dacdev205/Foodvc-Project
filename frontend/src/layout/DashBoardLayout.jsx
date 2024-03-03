import React from "react";
import { Link, Outlet } from "react-router-dom";
import { MdDashboard, MdDashboardCustomize } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";
import Login from "../components/Login";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";

import { FaUser, FaShoppingBag, FaQuestionCircle } from "react-icons/fa";

const shareLinks = (
  <>
    <li>
      <Link to="/help-users">
        <FaQuestionCircle />
        Hỗ trợ khách hàng
      </Link>
    </li>
  </>
);

const DashBoardLayout = () => {
  const { loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  return (
    <div>
      {isAdmin ? (
        <div>
          <div>
            <div className="drawer sm:drawer-open">
              <input
                id="my-drawer-2"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2">
                {/* Page content here */}
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
                <div className="mt-5 md:mt-2 mx-4">
                  <Outlet />
                </div>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="my-drawer-2"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <ul className="menu p-4 w-80 min-h-full text-black bg-white">
                  {/* Sidebar content here */}
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
                    <Link className="active-link" to="/admin">
                      <MdDashboard />
                      Dashboard
                    </Link>
                  </li>
                  <li className="">
                    <Link className="active-link" to="/admin/users">
                      <FaUser />
                      Tất cả người dùng
                    </Link>
                  </li>
                  <li>
                    <Link className="active-link" to="/admin/manage-inventory">
                      <FaWarehouse />
                      Quản lý kho
                    </Link>
                  </li>
                  <li>
                    <Link className="active-link" to="/admin/add-inventory">
                      <IoIosAddCircle />
                      Nhập kho
                    </Link>
                  </li>
                  <li>
                    <Link className="active-link" to="/admin/manage-menu">
                      <AiOutlineMenu />
                      Quản lý menu
                    </Link>
                  </li>
                  <li>
                    <Link className="active-link" to="/admin/add-voucher">
                      <img width="12px" src="/images/price-tag.png" alt="" />
                      Thêm giảm giá
                    </Link>
                  </li>
                  <li>
                    <Link className="active-link" to="/admin/order-tracking">
                      <FaShoppingBag />
                      Quản lý đơn hàng
                    </Link>
                  </li>
                  <hr />
                  {shareLinks}
                </ul>
              </div>
            </div>
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
