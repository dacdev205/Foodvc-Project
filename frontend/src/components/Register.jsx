import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, signUpWithGmail, updateUserProfile, user } =
    useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const axiosPublic = useAxiosPublic();
  const onSubmit = (data) => {
    const email = data.email;
    const password = data.password;

    createUser(email, password)
      .then((result) => {
        // Signed up
        const user = result.user;

        updateUserProfile(data.email, data.photoURL).then(() => {
          const userInfor = {
            name: data.name,
            email: data.email,
          };

          axiosPublic.post("/users", userInfor).then((response) => {
            if (userInfor.name) {
              alert("Signin successful!");
              navigate(from, { replace: true });
            } else {
              console.error("Error: userInfor.name is undefined or falsy");
            }
          });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle error appropriately
      });
  };

  //goole signin
  const handleLogin = () => {
    signUpWithGmail().then((result) => {
      const user = result.user;
      const userInfor = {
        name: result?.user?.displayName,
        email: result?.user?.email,
      };
      axiosPublic.post("/users", userInfor).then((response) => {
        alert("Login successful!");
        navigate("/");
        console.log(response);
      });
    });
  };
  return (
    <div>
      <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
        <div className="modal-action flex flex-col justify-center mt-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card-body"
            method="dialog"
          >
            <h3 className="font-bold text-lg">Đăng kí tài khoản!</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tên người dùng:</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className="input input-bordered"
                {...register("name")}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email:</span>
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
                <span className="label-text">Mật khẩu:</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                {...register("password")}
              />
              <label className="label mt-1">
                <a href="#" className="label-text-alt link link-hover">
                  Quên mật khẩu?
                </a>
              </label>
            </div>

            {/* error */}

            {/* login btn */}
            <div className="form-control mt-6">
              <input
                type="submit"
                value="Đăng kí ngay"
                className="btn bg-green text-white"
              />
            </div>

            <p className="text-center my-2">
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className="underline text-red">
                Đăng nhập
              </Link>
            </p>
          </form>

          {/* social sign in */}
          <div className="text-center space-x-3 mb-5">
            <button
              onClick={handleLogin}
              className="btn btn-circle hover:bg-green hover:text-white"
            >
              <FaGoogle />
            </button>
            <button className="btn btn-circle hover:bg-green hover:text-white">
              <FaFacebook />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
