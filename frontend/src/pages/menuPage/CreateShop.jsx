import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CiLocationOn } from "react-icons/ci";
import useAddress from "../../hooks/useAddress";
import AddressForm from "../../components/Address/AddressForm";
import useUserCurrent from "../../hooks/useUserCurrent";
import SelectAddress from "../../components/Address/SelectAddress";

const CreateShop = () => {
  const { register, handleSubmit, reset } = useForm();
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address] = useAddress();
  const userData = useUserCurrent();

  const [addressUser, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: { cityId: null, cityName: "" },
    district: { districtId: null, districtName: "" },
    ward: { wardCode: "", wardName: "" },
  });
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();

  const handleSetAddressWithForm = (newAddress) => {
    setAddress(newAddress);
    setIsModalOpen(false);
  };

  const handleSetAddress = (newAddress) => {
    setAddress(newAddress);
  };

  useEffect(() => {
    address.forEach((addressDefault) => {
      if (addressDefault.isDefault) {
        setAddress(addressDefault);
      }
    });
  }, [address]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("shopName", data.shopName);
    formData.append("description", data.description);
    formData.append("ownerId", userData?._id);
    formData.append("image", data.shopImage[0]);
    formData.append("addresses", addressUser._id);

    try {
      const response = await fetch("http://localhost:3000/shop/create-shop", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create shop");
      }

      const result = await response.json();
      toast.success("Shop created successfully!", {
        position: "bottom-right",
        autoClose: 2000,
      });

      reset();
      console.log("Shop created:", result);
    } catch (error) {
      toast.error("Failed to create shop. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-[980px] max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-black mb-6">
        Tạo cửa hàng của bạn
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black mb-4">
            Thông tin cửa hàng
          </h3>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Tên cửa hàng:</span>
            </label>
            <input
              type="text"
              {...register("shopName", { required: true })}
              className="input input-bordered w-full text-black"
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Giới thiệu</span>
            </label>
            <input
              type="text"
              {...register("description", { required: true })}
              className="input input-bordered w-full text-black"
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Ảnh cửa hàng:</span>
            </label>
            <input
              type="file"
              {...register("shopImage", { required: true })}
              className="file-input w-full"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold mb-4 text-green flex items-center">
                <CiLocationOn />
                Địa chỉ lấy hàng
              </h3>
              {!address.length ? (
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("modal-address").showModal()
                  }
                >
                  Thiết lập
                </button>
              ) : (
                <div className=" text-blue-500">
                  <button
                    type="button"
                    onClick={() => setAddressModalOpen(true)}
                  >
                    Thay đổi
                  </button>
                </div>
              )}
            </div>
            <div className="flex">
              <div className="flex">
                <div className="mr-3">
                  <p className="text-lg font-bold text-black">
                    {addressUser.fullName} {addressUser.phone}
                  </p>
                </div>
                <div className="mr-3">
                  <p className="text-black">
                    {addressUser?.street && `${addressUser.street}, `}
                    {addressUser.ward.wardName &&
                      `${addressUser.ward.wardName}, `}
                    {addressUser.district.districtName &&
                      `${addressUser.district.districtName}, `}
                    {addressUser.city.cityName &&
                      `${addressUser.city.cityName}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn bg-green text-white w-full py-2 mt-4"
        >
          Tạo cửa hàng
        </button>
      </form>

      <AddressForm
        userId={userData?._id}
        setAddress={handleSetAddressWithForm}
      />
      <SelectAddress
        addressModalOpen={addressModalOpen}
        setAddressModalOpen={setAddressModalOpen}
        handleSetAddress={handleSetAddress}
      />
    </div>
  );
};

export default CreateShop;
