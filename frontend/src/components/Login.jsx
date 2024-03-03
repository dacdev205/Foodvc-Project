import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { signUpWithGmail, login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const axiosPublic = useAxiosPublic();
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
  const handleLogin = () => {
    signUpWithGmail()
      .then((result) => {
        const user = result.user;
        const userInfor = {
          name: result?.user?.displayName,
          email: result?.user?.email,
        };
        axiosPublic.post("/users", userInfor).then((response) => {
          console.log(response);
          alert("Login successful!");
          navigate("/");
        });
      })
      .catch((error) => console.log(""));
  };

  return (
    <div>
      {!user ? (
        <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
          <div className="modal-action flex flex-col justify-center mt-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="card-body"
              method="dialog"
            >
              <h3 className="font-bold text-lg text-black">Đăng nhập!</h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered text-black"
                  {...register("email")}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Mật khẩu</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered text-black"
                  {...register("password")}
                />
                <label className="label mt-1">
                  <a href="#" className="label-text-alt link link-hover">
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
              <div className="form-control mt-6">
                <input
                  type="submit"
                  value="Đăng nhập"
                  className="btn bg-green text-white"
                />
              </div>

              <p className="text-center my-2 text-black">
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="underline text-red ml-1">
                  Đăng kí ngay
                </Link>{" "}
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

export default Login;
