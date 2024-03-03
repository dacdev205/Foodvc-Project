import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import Profile from "./Profile";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import useWishList from "../hooks/useWishList";
import Modal from "./Modal";
const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const { user, loading } = useAuth();
  const [cart] = useCart();
  const [wishList, refetch] = useWishList();
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.addEventListener("scroll", handleScroll);
    };
  }, []);
  const navItem = (
    <>
      <li>
        <Link className="active-link" to="/">
          Trang chủ
        </Link>
      </li>
      <li>
        <Link className="active-link" to="/menu">
          Menu
        </Link>
      </li>
      <li>
        <Link className="active-link" to="/about">
          Chúng tôi
        </Link>
      </li>
      <li>
        <Link className="active-link" to="/blog">
          Blogs
        </Link>
      </li>
    </>
  );
  const handleLogin = () => {
    const request = document.getElementById("modal-login");
    console.log(request);
  };
  return (
    <header className="max-w-screen-2xl container mx-auto fixed top-0 left-0 bg-white z-50 right-0 transition-all duration-300 ease-in-out">
      <div
        className={`navbar xl:px-24 ${
          isSticky
            ? "shadow-md z-10 transition-all duration-300 ease-in-out"
            : ""
        }`}
      >
        <div className="navbar-start text-black">
          <div className="dropdown ">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 "
            >
              {navItem}
            </ul>
          </div>
          <div>
            <a href="/" className="btn btn-ghost text-xl">
              Foodvc
            </a>
          </div>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-black ">{navItem}</ul>
        </div>

        <div className="navbar-end text-black">
          {/* wish start */}
          <Link to="wish-list">
            <label
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle lg:flex items-center justify-center"
            >
              <div className="indicator">
                <FaRegHeart size={18} />
                {wishList.length > 0 && (
                  <span className="badge badge-sm indicator-item bg-red text-white">
                    {wishList.length}
                  </span>
                )}
              </div>
            </label>
          </Link>
          {/* wish end */}

          {/* cart start */}
          <Link to="cart-page">
            <label
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle lg:flex items-center justify-center"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cart.length > 0 && (
                  <span className="badge badge-sm indicator-item bg-red text-white">
                    {cart.length}
                  </span>
                )}
              </div>
            </label>
          </Link>
          {/* cart end */}

          {/* Login btn */}
          {user ? (
            <Profile user={user} />
          ) : (
            <div>
              <button
                onClick={() =>
                  document.getElementById("modal-login").showModal()
                }
                className="btn flex items-center gap-22 rounded-full px-6 bg-green text-white"
              >
                <FaUser /> Đăng nhập
              </button>
              <Modal></Modal>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
