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

  const onSubmit = (data, user) => {
    // Destructuring properties from data
    const { name: formDataName, photoURL } = data;
    // Check if formDataName is empty, use user.displayName as fallback
    const name = formDataName.trim() === "" ? user.displayName : formDataName;
    updateUserProfile(name, photoURL)
      .then(() => {
        navigate(from, { replace: true });
        // ...
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-white">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-black">Chỉnh sửa trang cá nhân</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">Email:</span>
            </label>
            {user ? (
              <input
                disabled
                type="email"
                placeholder={user.email}
                className="input input-bordered text-black"
              />
            ) : (
              navigate(from, { replace: true })
            )}
            <label className="label">
              <span className="label-text text-black">Tên hiển thị:</span>
            </label>
            {user ? (
              <input
                type="text"
                placeholder={user.displayName}
                className="input input-bordered text-black"
                {...register("name")}
              />
            ) : (
              navigate(from, { replace: true })
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">Upload Photo</span>
            </label>
            <input
              type="text"
              {...register("photoURL")}
              className="file-input input w-full mt-1 text-black"
              placeholder="Write photo URL"
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn bg-green text-white hover:bg-green hover:opacity-80 border-style">
              Chỉnh sửa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
