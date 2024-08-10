/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from "react";
import AddressSearchBar from "./AddressSearchBar";
import addressAPI from "../../api/addressAPI";
import useAuth from "../../hooks/useAuth";
import useAddress from "../../hooks/useAddress";
import { FaCheck } from "react-icons/fa6";
import axios from "axios";

const AddressFormEdit = ({
  isModalEditOpen,
  setIsModalEditOpen,
  setAddress,
  addressToEdit,
}) => {
  const { user } = useAuth();
  const [address, totalPages, refetchAddress, isLoading] = useAddress();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: { cityId: null, cityName: "" },
    district: { districtId: null, districtName: "" },
    ward: { wardCode: "", wardName: "" },
    email: user.email,
  });
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [cities, setCities] = useState([]);
  const [districtsID, setDistrictsID] = useState([]);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [wardsId, setWardsId] = useState([]);
  const GHN_TOKEN = import.meta.env.VITE_GHN_TOKEN;
  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        fullName: addressToEdit.fullName,
        phone: addressToEdit.phone,
        street: addressToEdit.street,
        city: {
          cityId: addressToEdit.city.cityId,
          cityName: addressToEdit.city.cityName,
        },
        district: {
          districtId: addressToEdit.district.districtId,
          districtName: addressToEdit.district.districtName,
        },
        ward: {
          wardCode: addressToEdit.ward.wardCode,
          wardName: addressToEdit.ward.wardName,
        },
        email: addressToEdit.email,
      });
      setIsDefaultAddress(addressToEdit.isDefault);
    } else {
      setFormData({
        fullName: "",
        phone: "",
        street: "",
        city: { cityId: null, cityName: "" },
        district: { districtId: null, districtName: "" },
        ward: { wardCode: "", wardName: "" },
        email: user.email,
      });
      setDistricts([]);
      setWards([]);
      setIsDefaultAddress(false);
    }
  }, [addressToEdit, user.email]);

  useEffect(() => {
    if (isModalEditOpen) {
      document.getElementById("modal-addressEdit").showModal();
    } else {
      document.getElementById("modal-addressEdit").close();
    }
  }, [isModalEditOpen]);

  useEffect(() => {
    async function getAPIProvinces() {
      try {
        const response = await axios.get(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
          {
            headers: {
              "Content-Type": "application/json",
              Token: GHN_TOKEN,
            },
          }
        );
        const data = response.data.data;
        const formattedData = data.map((province) => ({
          id: province.ProvinceID,
          name: province.ProvinceName,
        }));
        setCities(formattedData);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
        setCities([]);
      }
    }
    getAPIProvinces();
  }, [GHN_TOKEN]);

  const handleCitySelect = async (cityName) => {
    const selectedCity = cities.find((city) => city.name === cityName);
    if (selectedCity) {
      setFormData({
        ...formData,
        city: { cityId: selectedCity.id, cityName: selectedCity.name },
        district: { districtId: null, districtName: "" },
        ward: { wardCode: "", wardName: "" },
      });

      try {
        const res = await fetch(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
          {
            method: "POST",
            headers: {
              Token: GHN_TOKEN,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              province_id: selectedCity.id,
            }),
          }
        );

        const data = await res.json();
        if (data && data.data && Array.isArray(data.data)) {
          setDistricts(data.data.map((district) => district.DistrictName));
          setDistrictsID(data.data);
        } else {
          setDistricts([]);
        }
      } catch (error) {
        console.error("Failed to fetch districts:", error);
        setDistricts([]);
      }
    }
  };

  const handleDistrictSelect = async (districtName) => {
    const selectedDistrict = districtsID.find(
      (district) => district.DistrictName === districtName
    );
    if (selectedDistrict) {
      setFormData({
        ...formData,
        district: {
          districtId: selectedDistrict.DistrictID,
          districtName: districtName,
        },
        ward: { wardCode: "", wardName: "" },
      });

      try {
        const res = await fetch(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
          {
            method: "POST",
            headers: {
              Token: GHN_TOKEN,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              district_id: selectedDistrict.DistrictID,
            }),
          }
        );

        const data = await res.json();
        if (data && data.data && Array.isArray(data.data)) {
          setWards(data.data.map((ward) => ward.WardName));
          setWardsId(data.data);
        } else {
          console.error("Unexpected data format:", data);
          setWards([]);
        }
      } catch (error) {
        console.error("Failed to fetch ward details:", error);
        setWards([]);
      }
    }
  };

  const handleWardsSelect = (wardName) => {
    const selectedWard = wardsId.find((w) => w.WardName === wardName);
    if (selectedWard) {
      setFormData({
        ...formData,
        ward: {
          wardCode: selectedWard.WardCode,
          wardName: selectedWard.WardName,
        },
      });
    }
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
        <div className="modal-box bg-white scrollbar-thin scrollbar-webkit">
          <div className="modal-action flex flex-col justify-center mt-0">
            <form className="" method="dialog" onSubmit={handleSubmit}>
              <h3 className="font-bold text-lg text-black">Cập nhật địa chỉ</h3>
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
                  selectedCity={formData.city.cityName}
                  selectedDistrict={formData.district.districtName}
                  selectedWard={formData.ward.wardName}
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
                  className="input input-bordered w-full text-black"
                />
              </div>
              <div className="form-control mt-4">
                <input
                  type="submit"
                  value="Cập nhật"
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
