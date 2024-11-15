// src/components/Modal.jsx
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaGoogle, FaFacebook, FaEyeSlash, FaEye } from "react-icons/fa";
import { AuthContext } from "../../context/AuthProvider";

import * as Yup from "yup";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Modal = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { signUpWithGmail, login } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [errorMessage, setErrorMessage] = useState({});
  const [errorMessageSubmit, setErrorMessageSubmit] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    password: Yup.string()
      .min(8, "Mật khẩu phải chứa ít nhất 8 ký tự")
      .required("Mật khẩu là bắt buộc"),
  });

  const validateInput = async (name, value) => {
    try {
      await Yup.reach(schema, name).validate(value);
      setErrorMessage((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } catch (error) {
      setErrorMessage((prevErrors) => ({
        ...prevErrors,
        [name]: error.message,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    validateInput(name, value);
  };

  const togglePasswordVisibility = (fieldName) => {
    fieldName === "password" ? setShowPassword(!showPassword) : "";
  };

  const onSubmit = async (data) => {
    try {
      await schema.validate(data, { abortEarly: false });
      const email = data.email;
      const password = data.password;
      login(email, password)
        .then((result) => {
          const user = result.user;
          const userInfor = {
            name: data.name,
            email: data.email,
          };
          axiosSecure.post("/users", userInfor);
          reset();
          toast.success("Chào mừng bạn trở lại!", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          navigate(from, { replace: true });
        })
        .catch(() => {
          setErrorMessageSubmit("Email hoặc mật khẩu không chính xác!");
        });
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrorMessage(newErrors);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await signUpWithGmail();
      const userInfor = {
        name: result?.user?.displayName,
        email: result?.user?.email,
        photoURL: result?.user?.photoURL,
      };
      await axiosSecure.post("/users", userInfor);
      toast.success("Chào mừng bạn đến với FOODVC", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
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
              <h3 className="font-bold text-lg text-black">Đăng nhập!</h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Email:</span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered text-black"
                  {...register("email")}
                  onChange={(e) => handleChange(e)}
                />
                {errorMessage.email && (
                  <p className="text-red text-xs italic">
                    {errorMessage.email}
                  </p>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Mật khẩu:</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    className="input input-bordered text-black w-full"
                    {...register("password")}
                    onChange={(e) => handleChange(e)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-black"
                    onClick={() => togglePasswordVisibility("password")}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errorMessage.password && (
                  <p className="text-red text-xs italic">
                    {errorMessage.password}
                  </p>
                )}
                <label className="label mt-1">
                  <Link
                    to="/forget-password"
                    className="label-text-alt link link-hover text-black"
                    onClick={() =>
                      document.getElementById("modal-login").close()
                    }
                  >
                    Quên mật khẩu?
                  </Link>
                </label>
              </div>
              <p className="text-red text-xs italic">
                {Object.values(errorMessageSubmit)}
              </p>
              <div className="form-control mt-4">
                <input
                  type="submit"
                  value="Đăng nhập"
                  className="btn bg-green text-white hover:bg-green hover:opacity-80 border-none"
                />
              </div>

              <button
                htmlFor="modal-login"
                type="button"
                onClick={() => document.getElementById("modal-login").close()}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black"
              >
                ✕
              </button>
              <p className="text-center my-2 text-black">
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="underline text-red">
                  Đăng kí ngay
                </Link>
              </p>
            </form>
            <div className="text-center space-x-3 mb-5">
              <button
                className="btn btn-circle hover:bg-green hover:text-white bg-slate-200 text-black border-none"
                onClick={handleLogin}
              >
                <FaGoogle />
              </button>
              <button className="btn btn-circle hover:bg-green hover:text-white bg-slate-200 text-black border-none">
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
