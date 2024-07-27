// VerifyPassword.js
import React, { useState } from "react";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { useActiveLink } from "../../context/ActiveLinkProvider";

const VerifyPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const { user, setIsVerified } = useAuth();
  const navigate = useNavigate();
  const { setActiveLink } = useActiveLink();

  const handleConfirmPassword = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("User is not authenticated");
      return;
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(user, credential);
      setIsVerified(true);
      setActiveLink("change-password"); // Update the active link state
      navigate("/user/change-password");
    } catch (error) {
      setError("Mật khẩu hiện tại không chính xác.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleConfirmPassword}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative"
      >
        <button
          type="button"
          onClick={() => navigate("/user/update-profile")}
          className="absolute top-[32px] left-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <FaArrowLeft size={20} className="text-green" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-green">
          Nhập lại mật khẩu Foodvc
        </h2>
        <div className="mb-4">
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            placeholder="Nhập lại mật khẩu hiện tại để xác minh."
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green focus:border-green sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green text-white font-medium rounded-md hover:bg-green hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green"
        >
          Xác nhận
        </button>
        {error && <p className="text-red mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default VerifyPassword;
