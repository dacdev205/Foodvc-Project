/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../context/AuthProvider";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddUserModal = ({
  addUserModalOpen,
  setAddUserModalOpen,
  refetchData,
  onAddUser,
}) => {
  const [errorMessage, setErrorMessage] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const { createUserWithoutLogin } = useContext(AuthContext);
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await useAxiosSecure.get("/users/roles/getAll", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const modal = document.getElementById("addUserModal");
    if (addUserModalOpen) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [addUserModalOpen]);

  const schema = Yup.object().shape({
    name: Yup.string().required("Tên người dùng là bắt buộc"),
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

  const togglePasswordVisibility = (fieldName) => {
    setShowPassword(fieldName === "password" ? !showPassword : showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    validateInput(name, value);
  };

  const sendEmailToNewUser = async (email, password) => {
    try {
      await axios.post("http://localhost:3000/email", {
        email: email,
        subject: "Chào mừng thành viên mới!🎉🎉🎉",
        html: `
        <html>
        <head>
          <style>
            @import url('https://unpkg.com/tailwindcss@^2.0/dist/tailwind.min.css');
          </style>
        </head>
        <body class="font-sans bg-gray-100">
          <div class="max-w-xl mx-auto p-8 bg-white rounded shadow">
            <h1 class="text-2xl font-bold text-center text-gray-800 mb-4">Chào mừng bạn đến với FOODVC🥰🥰🥰</h1>
            <h2 class="text-lg font-semibold text-gray-700 mb-2">Tài khoản bạn được cấp:</h2>
            <p class="text-gray-600 mb-2"><span class="font-semibold">Tài khoản đăng nhập:</span> ${email}</p>
            <p class="text-gray-600 mb-4"><span class="font-semibold">Mật khẩu:</span> ${password}</p>
            <i class="text-sm text-red-500 tex">Lưu ý: không được cung cấp tài khoản cho người khác.</i>
          </div>
        </body>
        </html>
      `,
      });
    } catch (error) {
      console.error("Error sending email to:", email, error);
    }
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    schema
      .validate(data, { abortEarly: false })
      .then(() => {
        const email = data.email;
        const password = data.password;

        createUserWithoutLogin(email, password)
          .then(async () => {
            const userInfor = {
              name: data.name,
              email: data.email,
              roles: role,
              photoURL: data.photoURL || null,
              address: null,
            };
            await onAddUser(userInfor).then(() => {
              setAddUserModalOpen(false);
              sendEmailToNewUser(data.email, password);
              refetchData();
            });
          })
          .catch((error) => {
            console.error("Lỗi khi tạo tài khoản:", error);
          });
      })
      .catch((error) => {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrorMessage(newErrors);
      });
  };

  return (
    <div>
      <dialog id="addUserModal" className="modal">
        <div className="modal-box bg-white">
          <div className="modal-action flex flex-col justify-center mt-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="card-body"
              method="dialog"
            >
              <h3 className="font-bold text-lg text-black">Thêm người dùng</h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Tên người dùng:</span>
                </label>
                <input
                  type="text"
                  placeholder="Tên người dùng"
                  className=" input input-sm input-bordered text-black"
                  {...register("name")}
                  onChange={handleChange}
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
                  className="input input-sm input-bordered text-black"
                  {...register("email")}
                  onChange={handleChange}
                />
                {errorMessage.email && (
                  <p className="text-red text-xs italic">
                    {errorMessage.email}
                  </p>
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
                    className="input input-sm input-bordered w-full text-black"
                    {...register("password")}
                    onChange={handleChange}
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
                  <p className="text-red text-xs italic">
                    {errorMessage.password}
                  </p>
                )}
              </div>

              {/* Select box to choose role */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Vai trò:</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input input-sm input-bordered text-black"
                >
                  {roles
                    .filter((role) => role.name.toLowerCase() !== "admin")
                    .map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name === "user"
                          ? "Người dùng"
                          : role.name === "seller"
                          ? "Người bán"
                          : role.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-control mt-6">
                <input
                  type="submit"
                  value="Xác nhận"
                  className="btn bg-green text-white hover:bg-green hover:opacity-80 border-none"
                />
              </div>
            </form>
          </div>
          <button
            className="btn btn-sm bg-transparent border-none hover:bg-transparent absolute right-2 top-2 text-xl text-black"
            onClick={() => setAddUserModalOpen(false)}
          >
            ×
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default AddUserModal;
