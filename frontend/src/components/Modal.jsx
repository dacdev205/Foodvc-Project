/* eslint-disable react/prop-types */
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
const Modal = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { signUpWithGmail, login } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const axiosPublic = useAxiosPublic();

  //redirecting to home page or specifig page
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    const email = data.email;
    const password = data.password;
    // console.log(email, password)
    login(email, password)
      .then((result) => {
        const user = result.user;
        const userInfor = {
          name: data.name,
          email: data.email,
        };
        try {
          axiosPublic.post("/users", userInfor);
          alert("Login successfull");
          reset();
          navigate(from, { replace: true });
        } catch (error) {
          console.log("");
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorMessage("Provide a correct email and password!");
      });
  };
  //goole signin
  const handleLogin = async () => {
    try {
      const result = await signUpWithGmail();
      const userInfor = {
        name: result?.user?.displayName,
        email: result?.user?.email,
      };

      const response = await axiosPublic.post("/users", userInfor);
      if (response.status === 302) {
        const redirectedLocation = response.headers.location;
        const secondResponse = await axiosPublic.get(redirectedLocation);
        console.log("Second response:", secondResponse);
      }
      console.log(response);
      alert("Login successful");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <dialog id="modal-login" className="modal modal-middle sm:modal-middle">
        <div className="modal-box bg-white">
          <div className="modal-action flex flex-col justify-center mt-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="card-body"
              method="dialog"
            >
              <h3 className="font-bold text-lg">Đăng nhập!</h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Email:</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  {...register("email")}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Mật khẩu:</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  {...register("password")}
                />
                <label className="label mt-1">
                  <a
                    href="#"
                    className="label-text-alt link link-hover text-black"
                  >
                    Quên mật khẩu?
                  </a>
                </label>
              </div>

              {/* error */}
              {errorMessage ? (
                <p className="text-red text-xs italic">{errorMessage}</p>
              ) : (
                ""
              )}
              {/* login btn */}
              <div className="form-control mt-4">
                <input
                  type="submit"
                  value="Đăng nhập"
                  className="btn bg-green text-white hover:bg-green hover:opacity-80"
                />
              </div>

              <button
                htmlFor="modal-login"
                type="button"
                onClick={() => document.getElementById("modal-login").close()}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
              <p className="text-center my-2">
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="underline text-red">
                  Đăng kí ngay
                </Link>
              </p>
            </form>
            {/* social sign in */}
            <div className="text-center space-x-3 mb-5">
              <button
                className="btn btn-circle hover:bg-green hover:text-white bg-slate-200 text-black"
                onClick={handleLogin}
              >
                <FaGoogle />
              </button>
              <button className="btn btn-circle hover:bg-green hover:text-white bg-slate-200 text-black">
                <FaFacebook />
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
