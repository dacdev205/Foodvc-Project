import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthProvider";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const { forgetPassword } = useContext(AuthContext);
  const [emailSent, setEmailSent] = useState(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await forgetPassword(data.email);
      setEmailSent(true);
      reset();
    } catch (error) {
      console.error("Error sending reset email:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="font-bold text-lg text-black mb-4">Quên mật khẩu</h3>
        {emailSent ? (
          <p className="text-green mb-4">Email đặt lại mật khẩu đã được gửi.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-black">Email:</span>
              </label>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="input input-bordered text-black w-full"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs italic mt-1 text-red">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="form-control mb-4">
              <input
                type="submit"
                value="Gửi email đặt lại mật khẩu"
                className="btn bg-green-500 text-white hover:bg-green w-full bg-green border-none hover:opacity-80"
              />
            </div>
          </form>
        )}
        <Link to="/" className="text-blue-500 hover:underline">
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
