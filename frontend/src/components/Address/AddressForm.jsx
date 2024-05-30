/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import AddressSearchBar from "./AddressSearchBar";
import addressAPI from "../../api/addressAPI";
import useAuth from "../../hooks/useAuth";
import useAddress from "../../hooks/useAddress";
import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";

const AddressForm = ({ setAddress, paymentId }) => {
  const { user } = useAuth();
  const [address, refetchAddress] = useAddress();
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [districtsID, setDistrictsID] = useState([]);
  const [wards, setWards] = useState([]);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const { reset } = useForm();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    district: "",
    ward: "",
    email: user.email,
  });

  useEffect(() => {
    async function getAPIProvinces() {
      try {
        const response = await fetch(
          "https://api.nosomovo.xyz/province/getalllist/193"
        );
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setCities(data);
        } else {
          console.error("Unexpected data format:", data);
          setCities([]);
        }
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
        setCities([]);
      }
    }

    getAPIProvinces();
  }, []);

  const handleCitySelect = async (cityName) => {
    const selectedCity = cities.find((city) => city.name === cityName);
    setFormData({
      ...formData,
      city: selectedCity.name,
      district: "",
      ward: "",
    });

    try {
      const res = await fetch(
        `https://api.nosomovo.xyz/district/getalllist/${selectedCity.id}`
      );
      const data = await res.json();
      if (data && Array.isArray(data)) {
        const districtNames = data.map((district) => district.name);
        setDistricts(districtNames);
        setDistrictsID(data);
      } else {
        setDistricts([]);
      }
    } catch (error) {
      console.error("Failed to fetch districts:", error);
      setDistricts([]);
    }
  };

  const handleDistrictSelect = async (districtName) => {
    const selectedDistrict = districtsID.find(
      (district) => district.name === districtName
    );
    setFormData({
      ...formData,
      district: districtName,
      ward: "",
    });
    try {
      const res = await fetch(
        `https://api.nosomovo.xyz/commune/getalllist/${selectedDistrict.id}`
      );
      const data = await res.json();
      if (data) {
        const wardNames = data.map((ward) => ward.name);
        setWards(wardNames || []);
      } else {
        console.error("Unexpected data format:", data);
        setWards([]);
      }
    } catch (error) {
      console.error("Failed to fetch district details:", error);
      setWards([]);
    }
  };

  const handleWardsSelect = (ward) => {
    setFormData({
      ...formData,
      ward: ward,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithDefault = {
      ...formData,
      paymentId: paymentId,
      isDefault: isDefaultAddress,
    };
    setAddress(formDataWithDefault);
    await addressAPI.postAddressToDB(formDataWithDefault);
    refetchAddress();
    setFormData({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      district: "",
      ward: "",
      email: user.email,
    });
    document.getElementById("modal-address").close();
    reset();
  };

  return (
    <div>
      <dialog id="modal-address" className="modal modal-middle sm:modal-middle">
        <div className="modal-box bg-white scrollbar-thin scrollbar-webkit">
          <div className="modal-action flex flex-col justify-center mt-0">
            <form className="" method="dialog" onSubmit={handleSubmit}>
              <h3 className="font-bold text-lg text-black">Địa chỉ mới</h3>
              <div className="form-control ">
                <div className="flex justify-between">
                  <div className="form-control mt-3 w-1/2 mr-1">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Họ và tên"
                      className="input input-bordered w-full text-black"
                    />
                  </div>
                  <div className="form-control mt-3 w-1/2 ml-1">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Số điện thoại"
                      className="input input-bordered w-full text-black"
                    />
                  </div>
                </div>
              </div>
              <div className="form-control mt-3">
                <AddressSearchBar
                  cities={cities.map((city) => city.name)}
                  onCitySelect={handleCitySelect}
                  onDistrictSelect={handleDistrictSelect}
                  districts={districts}
                  onWardsSelect={handleWardsSelect}
                  wards={wards}
                />
              </div>
              <div className="form-control mt-3">
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Địa chỉ chi tiết"
                  className="input input-bordered w-full text-black"
                />
              </div>
              <div className="form-control mt-4">
                <input
                  type="submit"
                  value="Hoàn thành"
                  className="btn bg-green text-white hover:bg-green hover:opacity-80 border-style"
                />
              </div>
              <div className="form-control mt-3">
                <label className="cursor-pointer flex items-center text-black relative">
                  <input
                    type="checkbox"
                    checked={isDefaultAddress}
                    onChange={() => setIsDefaultAddress(!isDefaultAddress)}
                    className="mr-2 appearance-none w-4 h-4 rounded-sm bg-white border-2 border-[#39d84A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  />
                  {isDefaultAddress && (
                    <FaCheck className="absolute top-[3px] left-[1px] text-green" />
                  )}
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
            </form>
            <button
              type="button"
              htmlFor="modal-address"
              onClick={() => document.getElementById("modal-address").close()}
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

export default AddressForm;
