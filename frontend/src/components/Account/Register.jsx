import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../context/AuthProvider";

import * as Yup from "yup";
import { Bounce, toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, signUpWithGmail, updateUserProfile, user } =
    useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const axiosSecure = useAxiosSecure();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = Yup.object().shape({
    name: Yup.string().required("Tên người dùng là bắt buộc"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    password: Yup.string()
      .min(8, "Mật khẩu phải chứa ít nhất 8 ký tự")
      .required("Mật khẩu là bắt buộc"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
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

  const togglePasswordVisibility = (fieldName) => {
    fieldName === "password"
      ? setShowPassword(!showPassword)
      : setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    validateInput(name, value);
  };

  const onSubmit = (data) => {
    schema
      .validate(data, { abortEarly: false })
      .then(() => {
        const email = data.email;
        const password = data.password;

        createUser(email, password)
          .then((result) => {
            // Signed up
            const user = result.user;
            updateUserProfile(data.name, data.photoURL).then(() => {
              const userInfor = {
                name: data.name,
                email: data.email,
                photoURL: data.photoURL || null,
                address: null,
              };
              axiosSecure.post("/users", userInfor).then((response) => {
                if (userInfor.name) {
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
                  navigate("/", { replace: true });
                } else {
                  console.error(
                    "Lỗi: userInfor.name không được xác định hoặc là giá trị sai"
                  );
                }
              });
            });
          })
          .catch((error) => {});
      })
      .catch((error) => {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrorMessage(newErrors);
      });
  };

  // Google signin
  const handleLogin = () => {
    signUpWithGmail().then((result) => {
      const user = result.user;
      const userInfor = {
        name: result?.user?.displayName,
        email: result?.user?.email,
      };
      axiosSecure.post("/users", userInfor).then((response) => {
        navigate("/");
        toast.success("Chào mừng bạn đến với với FOODVC", {
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
      });
    });
  };
  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
      <div className="modal-action flex flex-col justify-center mt-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card-body"
          method="dialog"
        >
          <h3 className="font-bold text-lg text-black">Đăng kí tài khoản!</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">Tên người dùng:</span>
            </label>
            <input
              type="text"
              placeholder="Tên người dùng"
              className="input input-bordered text-black"
              {...register("name")}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">
                Email (<span className="text-red">*</span>):
              </span>
            </label>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered text-black"
              {...register("email")}
              onChange={(e) => handleChange(e)}
            />
            {errorMessage.email && (
              <p className="text-red text-xs italic">{errorMessage.email}</p>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">
                Mật khẩu (<span className="text-red">*</span>):
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                className="input input-bordered w-full text-black"
                {...register("password")}
                onChange={(e) => handleChange(e)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 p-3 flex items-center text-black"
                onClick={() => togglePasswordVisibility("password")}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errorMessage.password && (
              <p className="text-red text-xs italic">{errorMessage.password}</p>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">
                Xác nhận mật khẩu (<span className="text-red">*</span>):
              </span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                className="input input-bordered pr-10 text-black"
                {...register("confirmPassword")}
                onChange={(e) => handleChange(e)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 p-3 flex items-center text-black"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errorMessage.confirmPassword && (
              <p className="text-red text-xs italic">
                {errorMessage.confirmPassword}
              </p>
            )}
          </div>
          {/* Checkbox để chuyển đổi hiển thị mật khẩu */}
          <label className="label mt-1">
            <a href="#" className="label-text-alt link link-hover text-black">
              Quên mật khẩu?
            </a>
          </label>
          {/* login btn */}
          <div className="form-control mt-6">
            <input
              type="submit"
              value="Đăng kí ngay"
              className="btn bg-green text-white hover:bg-green hover:opacity-80 border-none"
            />
          </div>

          <p className="text-center my-2 text-black">
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
            className="btn btn-circle hover:bg-green hover:text-white bg-slate-200 text-black border-none"
          >
            <FaGoogle />
          </button>
          <button className="btn btn-circle hover:bg-green hover:text-white bg-slate-200 text-black border-none">
            <FaFacebook />
          </button>
        </div>
      </div>
      <Link
        to="/"
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black"
      >
        ✕
      </Link>
    </div>
  );
};

export default Register;
