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
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold">Chỉnh sửa trang cá nhân</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email:</span>
            </label>
            {user ? (
              <input
                disabled
                placeholder={user.email}
                className="input input-bordered"
              />
            ) : (
              navigate(from, { replace: true })
            )}
            <label className="label">
              <span className="label-text">Tên hiển thị:</span>
            </label>
            {user ? (
              <input
                type="name"
                placeholder={user.displayName}
                className="input input-bordered"
                {...register("name")}
              />
            ) : (
              navigate(from, { replace: true })
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Photo</span>
            </label>
            <input
              type="text"
              {...register("photoURL")}
              className="file-input w-full mt-1 "
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn bg-green text-white">Chỉnh sửa</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
