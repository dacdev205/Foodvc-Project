import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import useUserCurrent from "../../hooks/useUserCurrent";
import userAPI from "../../api/userAPI";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UpdateProfile = () => {
  const { updateUserProfile, user } = useContext(AuthContext);
  const userData = useUserCurrent();
  const [photo, setPhoto] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    const { name: formDataName } = data;
    const name = formDataName.trim() === "" ? user.displayName : formDataName;

    try {
      let updatedPhotoURL = user.photoURL;

      if (photo) {
        const storage = getStorage();
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, photo);
        updatedPhotoURL = await getDownloadURL(storageRef);
      }

      await updateUserProfile(name, updatedPhotoURL);
      await userAPI.updateUserProfile(userData?._id, {
        name,
        photoURL: updatedPhotoURL,
      });

      toast.success("Cập nhật thông tin thành công", {
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
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại", {
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
  };

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  return (
    <div className="min-h-full lg:w-[890px] md:w-full sm:w-full shadow-md rounded-sm bg-white">
      <div className="px-8 py-4">
        <h1 className="text-black font-sans text-2xl">Hồ sơ của tôi</h1>
        <p className="text-black font-sans text-sm">
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
                    readOnly
                    type="email"
                    placeholder={user.email}
                    className="input input-bordered input-sm ml-3 cursor-not-allowed"
                  />
                </div>
              ) : (
                navigate(from, { replace: true })
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-center">
              <img
                src={
                  photo
                    ? URL.createObjectURL(photo)
                    : user?.photoURL || "https://via.placeholder.com/150"
                }
                alt="User Avatar"
                className="w-32 h-32 rounded-full mb-4"
              />
            </div>
            <input
              type="file"
              {...register("photoURL")}
              className="input input-bordered text-black input-sm w-full mb-4"
              onChange={handlePhotoChange}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn bg-green border-none text-white hover:bg-green hover:opacity-80 px-6 py-2"
              >
                Lưu
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
