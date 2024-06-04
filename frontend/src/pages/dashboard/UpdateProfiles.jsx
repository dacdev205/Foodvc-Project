import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const { updateUserProfile, user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    const { name: formDataName, photoURL } = data;
    const name = formDataName.trim() === "" ? user.displayName : formDataName;
    updateUserProfile(name, photoURL)
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((error) => {
        // An error occurred
      });
  };

  return (
    <div className="min-h-full bg-neutral-50 lg:w-[890px] md:w-full sm:w-full shadow-md rounded-sm">
      <div className="px-8 py-4">
        <h1 className="text-black font-sans text-2xl">Hồ sơ của tôi</h1>
        <p className="text-black font-sans">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
        <hr className="mt-3" />
        <form
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mx-16 my-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <div className="mb-4">
              {user ? (
                <div className="flex justify-end">
                  <label className="text-black block mb-2">Tên hiển thị:</label>
                  <input
                    type="text"
                    placeholder={user.displayName}
                    className="input input-bordered text-black input-sm ml-3"
                    {...register("name")}
                  />
                </div>
              ) : (
                navigate(from, { replace: true })
              )}
            </div>
            <div className="mb-4">
              {user ? (
                <div className="flex justify-end">
                  <label className="text-black block mb-2">Email:</label>

                  <input
                    disabled
                    type="email"
                    placeholder={user.email}
                    className="input input-bordered text-black input-sm ml-3"
                  />
                </div>
              ) : (
                navigate(from, { replace: true })
              )}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              src={user?.photoURL || "https://via.placeholder.com/150"}
              alt="User Avatar"
              className="w-32 h-32 rounded-full mb-4"
            />
            <input
              type="text"
              {...register("photoURL")}
              className="input input-bordered text-black input-sm w-full mb-4"
              placeholder="Write photo URL"
            />
            <div className="flex justify-end w-full">
              <button
                type="submit"
                className="btn bg-green border-none text-white hover:bg-green hover:opacity-80"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
