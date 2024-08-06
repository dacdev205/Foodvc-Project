import React, { useState, useContext } from "react";
import { updatePassword } from "firebase/auth";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Validation schema
const schema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Mật khẩu phải chứa ít nhất 8 ký tự")
    .required("Mật khẩu mới là bắt buộc"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
});

const ChangePassword = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await schema.validate(formData, { abortEarly: false });

      // Update password
      await updatePassword(user, formData.newPassword);
      toast.success("Cập nhật mật khẩu thành công", {
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

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      if (error.name === "ValidationError") {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        toast.error("Cập nhật mật khẩu thất bại", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (fieldName) => {
    if (fieldName === "newPassword") {
      setShowNewPassword(!showNewPassword);
    } else if (fieldName === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  //
  return (
    <div className="min-h-screen bg-neutral-50 lg:w-[890px] md:w-full sm:w-full shadow-md rounded-sm">
      <div className="px-8 py-4">
        <h1 className="text-black font-sans text-2xl">Đổi mật khẩu</h1>
        <p className="text-black font-sans text-sm">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.
        </p>
        <hr className="mt-3" />
        <form
          className="grid grid-cols-1 gap-4 mx-52 my-8"
          onSubmit={handleChangePassword}
        >
          <div className="flex flex-col mb-4">
            <label className="text-black block mb-2">Mật khẩu mới:</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
                required
                className="input input-bordered text-black input-sm w-full"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 p-3 flex items-center text-black"
                onClick={() => togglePasswordVisibility("newPassword")}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-rose-500 text-xs italic">
                {errors.newPassword}
              </p>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-black block mb-2">Xác nhận mật khẩu:</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu mới"
                required
                className="input input-bordered text-black input-sm w-full"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 p-3 flex items-center text-black"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-rose-500 text-xs italic">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn bg-green border-none text-white hover:bg-green hover:opacity-80 px-6 py-2"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
