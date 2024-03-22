/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import useAddress from "../hooks/useAddress";
import AddressForm from "./AddressForm";
import { FaPlus } from "react-icons/fa6";
import AddressFormEdit from "./AddressFormEdit";
const SelectAddress = ({
  addressModalOpen,
  setAddressModalOpen,
  handleSetAddress,
}) => {
  const [addresses, refetchAddress] = useAddress();
  const [showAddressEditForm, setShowAddressEditForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  useEffect(() => {
    const modal = document.getElementById("modal-selectAddress");
    if (addressModalOpen) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [addressModalOpen]);

  const handleConfirmAddress = (addressItem) => {
    handleSetAddress(addressItem);
    refetchAddress();
    setAddressModalOpen(false);
    localStorage.setItem("selectedAddress", JSON.stringify(addressItem));
  };

  const handleEditAddress = (addressItem) => {
    setSelectedAddress(addressItem);
    setShowAddressEditForm(true);
    refetchAddress();
  };
  return (
    <div>
      <dialog
        id="modal-selectAddress"
        className="modal modal-middle sm:modal-middle "
      >
        <div className="modal-box overflow-y-auto bg-white">
          <div className="modal-action flex flex-col justify-center mt-0">
            <span className="text-lg font-bold text-black">
              Địa chỉ của tôi
            </span>
            <div>
              {addresses.map((addressItem, index) => (
                <div key={index} className="">
                  <hr className="my-2 border-t-2 border-gray-200 w-full" />
                  <div className="mb-3">
                    <div className="flex items-center py-2 justify-between text-black">
                      <div>
                        <input
                          type="radio"
                          name="selectedAddress"
                          className="mr-2 appearance-none w-4 h-4 rounded-full bg-white border-2 border-[#8df097] checked:bg-[#39d84A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          onChange={() => setSelectedAddress(addressItem)}
                        />
                        <span className="font-semibold border-r-2 border-gray-200 pr-1">
                          {addressItem.fullName}
                        </span>
                        <span className="pl-1 text-sm text-gray-500">
                          {addressItem.phone}
                        </span>
                      </div>
                      <div>
                        <button onClick={() => handleEditAddress(addressItem)}>
                          <span className="text-sm text-green">Cập nhật</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {addressItem.street}, {addressItem.ward},{" "}
                      {addressItem.district}, {addressItem.city}
                    </p>
                    {addressItem.isDefault && (
                      <p className="text-green text-sm p-1 mt-2 inline-block rounded-lg border-green border-2">
                        Mặc định
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="my-3">
              <button
                onClick={() =>
                  document.getElementById("modal-address").showModal()
                }
                className="flex justify-start items-center border-2 border-green p-2 rounded-lg text-black"
              >
                <FaPlus />
                Thêm địa chỉ mới
              </button>
              <div>
                <AddressForm setAddress={handleSetAddress} />
              </div>
            </div>
            <hr className="my-2 border-t-2 border-gray-200 w-full" />
            <div className="my-3 flex justify-end">
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
              <button
                className="btn bg-green p-2 rounded-lg text-white hover:bg-green hover:opacity-80 border-style"
                onClick={() => handleConfirmAddress(selectedAddress)}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </dialog>

      {showAddressEditForm && (
        <AddressFormEdit
          isModalEditOpen={true}
          setIsModalEditOpen={setShowAddressEditForm}
          setAddress={handleSetAddress}
          addressToEdit={selectedAddress}
        />
      )}
    </div>
  );
};

export default SelectAddress;
