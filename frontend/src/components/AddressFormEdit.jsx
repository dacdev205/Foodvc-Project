/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from "react";
import AddressSearchBar from "./AddressSearchBar";
import addressAPI from "../api/addressAPI";
import useAuth from "../hooks/useAuth";
import useAddress from "../hooks/useAddress";

const AddressFormEdit = ({
  isModalEditOpen,
  setIsModalEditOpen,
  setAddress,
  addressToEdit,
}) => {
  const { user } = useAuth();
  const [address, refetchAddress] = useAddress();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    district: "",
    ward: "",
    email: user.email,
  });
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const districtOptions = useMemo(
    () => ({
      "Vĩnh Long": {
        "Mang Thít": ["Mỹ Phước", "Mỹ An"],
        "Thành Phố Vĩnh Long": ["Phường 1", "Phường 2"],
      },
      "Cần Thơ": {
        "Quận Ninh Kiều": ["Phường Xuân Khánh", "Phường Hưng Lợi"],
        "Quận Cái Răng": ["Phường Hưng Phú", "Phường Hưng Thạnh"],
      },
    }),
    []
  );
  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        fullName: addressToEdit.fullName,
        phone: addressToEdit.phone,
        street: addressToEdit.street,
        city: addressToEdit.city,
        district: addressToEdit.district,
        ward: addressToEdit.ward,
        email: addressToEdit.email,
      });
    } else {
      setFormData({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        district: "",
        ward: "",
        email: user.email,
      });
      setDistricts([]);
      setWards([]);
      setIsDefaultAddress(false);
    }
  }, [addressToEdit, districtOptions, user.email]);

  useEffect(() => {
    if (isModalEditOpen) {
      document.getElementById("modal-addressEdit").showModal();
    } else {
      document.getElementById("modal-addressEdit").close();
    }
  }, [isModalEditOpen]);

  const handleCitySelect = (city) => {
    setFormData({
      ...formData,
      city: city,
      district: "",
      ward: "",
    });
    setDistricts(Object.keys(districtOptions[city] || {}));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDistrictSelect = (district) => {
    setFormData({
      ...formData,
      district: district,
      ward: "",
    });

    setWards(districtOptions[formData.city][district] || []);
  };

  const handleWardsSelect = (ward) => {
    setFormData({
      ...formData,
      ward: ward,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithDefault = {
      ...formData,
      isDefault: isDefaultAddress,
    };
    await addressAPI.updateAddressInDB(addressToEdit._id, formDataWithDefault);
    await Promise.all(
      address.map(async (address) => {
        if (address._id !== addressToEdit._id && address.isDefault) {
          await addressAPI.updateAddressInDB(address._id, {
            isDefault: false,
          });
        }
      })
    );
    setAddress(formDataWithDefault);
    setIsModalEditOpen(false);
    refetchAddress();
  };

  return (
    <div>
      <dialog
        id="modal-addressEdit"
        className="modal modal-middle sm:modal-middle"
      >
        <div className="modal-box">
          <div className="modal-action flex flex-col justify-center mt-0">
            <form className="" method="dialog" onSubmit={handleSubmit}>
              <h3 className="font-bold text-lg">Cập nhật địa chỉ</h3>
              <div className="form-control ">
                <div className="flex justify-between">
                  <div className="form-control mt-3 w-1/2 mr-1">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Họ và tên"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="form-control mt-3 w-1/2 ml-1">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Số điện thoại"
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="form-control mt-3">
                <AddressSearchBar
                  cities={["Vĩnh Long", "Cần Thơ"]}
                  onCitySelect={handleCitySelect}
                  onDistrictSelect={handleDistrictSelect}
                  districts={districts}
                  onWardsSelect={handleWardsSelect}
                  wards={wards}
                  selectedCity={formData.city}
                  selectedDistrict={formData.district}
                  selectedWard={formData.ward}
                  selectedStreet={formData.street}
                />
              </div>
              <div className="form-control mt-3">
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Địa chỉ chi tiết"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control mt-4">
                <input
                  type="submit"
                  value="Cập nhật"
                  className="btn bg-green text-white"
                />
              </div>
              <div className="form-control mt-3">
                <label className="cursor-pointer flex items-center">
                  <input
                    type="checkbox"
                    name="isDefaultAddress"
                    checked={isDefaultAddress}
                    onChange={() => setIsDefaultAddress(!isDefaultAddress)}
                    className="form-checkbox mr-2"
                  />
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
            </form>
            <button
              htmlFor="modal-addressEdit"
              onClick={() => setIsModalEditOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddressFormEdit;
