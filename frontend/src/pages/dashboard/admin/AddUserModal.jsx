/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../context/AuthProvider";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddUserModal = ({
  addUserModalOpen,
  setAddUserModalOpen,
  refetchData,
}) => {
  const [errorMessage, setErrorMessage] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("user"); // State để lưu trữ quyền được chọn
  const { createUserWithoutLogin } = useContext(AuthContext);

  const axiosPublic = useAxiosPublic();

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
    fieldName === "password"
      ? setShowPassword(!showPassword)
      : setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    validateInput(name, value);
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    schema
      .validate(data, { abortEarly: false })
      .then(() => {
        const email = data.email;
        const password = data.password;

        createUserWithoutLogin(email, password)
          .then(() => {
            const userInfor = {
              name: data.name,
              email: data.email,
              role: role, // Thêm quyền vào thông tin người dùng
            };
            axiosPublic.post("/users", userInfor).then((response) => {
              if (userInfor.name) {
                alert("Thêm thành công thành công!");
                setAddUserModalOpen(false);
                refetchData();
              } else {
                console.error(
                  "Lỗi: userInfor.name không được xác định hoặc là giá trị sai"
                );
              }
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
                  placeholder="name"
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
                  placeholder="email"
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
                  <span className="label-text text-black">
                    Mật khẩu (<span className="text-red">*</span>):
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
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
                  <p className="text-red text-xs italic">
                    {errorMessage.password}
                  </p>
                )}
              </div>

              {/* Thêm select box để chọn quyền */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Vài trò:</span>
                </label>
                <select
                  className="input input-bordered"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Người dùng</option>
                  <option value="staff">Nhân viên</option>
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
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setAddUserModalOpen(false)}
          >
            ✕
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default AddUserModal;
