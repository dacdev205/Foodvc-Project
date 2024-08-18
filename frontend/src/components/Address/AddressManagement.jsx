import { useEffect, useState } from "react";
import useAddress from "../../hooks/useAddress";
import useUserCurrent from "../../hooks/useUserCurrent";
import addressAPI from "../../api/addressAPI";
import { FaPlus } from "react-icons/fa";
import AddressFormv2 from "./AddressFormv2";
import AddressFormEditv2 from "./AdressFormEditv2";
import { CircularProgress, Pagination } from "@mui/material";
import axios from "axios";

const AddressManagement = () => {
  const [showAddressEditForm, setShowAddressEditForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [addresses, totalPages, refetchAddress, isLoading] = useAddress(
    page,
    2
  );

  const userData = useUserCurrent();
  if (!userData || !userData._id) {
    return null;
  }
  const handleEditAddress = (addressItem) => {
    setSelectedAddress(addressItem);
    setShowAddressEditForm(true);
  };

  const handleDeleteClick = (addressId) => {
    setAddressToDelete(addressId);
    setShowConfirmModal(true);
  };

  const confirmDeleteAddress = async () => {
    try {
      await addressAPI.deleteAddress(addressToDelete);
      refetchAddress();
      setShowConfirmModal(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await addressAPI.setDefaultAddress(addressId);
      refetchAddress();
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };
  const handlePageChange = (event, value) => {
    setPage(value);
    refetchAddress();
  };
  const sortedAddresses = addresses.sort((a, b) => b.isDefault - a.isDefault);
  if (isLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <CircularProgress color="success" />
      </div>
    );
  return (
    <div>
      <div className="min-h-full lg:w-[890px] md:w-full sm:w-full shadow-md rounded-sm bg-white">
        <div className="px-8 py-4">
          <div className="my-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-black font-sans text-2xl">
                  Địa chỉ của tôi
                </h1>
              </div>
              <button
                onClick={() =>
                  document.getElementById("modal-address").showModal()
                }
                className="flex justify-start items-center bg-green p-2 rounded-lg text-white"
              >
                <FaPlus />
                Thêm địa chỉ mới
              </button>
            </div>
            <div>
              <AddressFormv2 userId={userData._id} />
            </div>
          </div>
          <hr className="my-2 border-t-2 border-gray-200 w-full" />
          <h1 className="text-black font-sans text-xl mb-4">Địa chỉ</h1>
          <div>
            {sortedAddresses && sortedAddresses.length > 0 ? (
              sortedAddresses.map((addressItem) => (
                <div key={addressItem._id} className="">
                  <div className="mb-3">
                    <div className="flex items-center py-2 justify-between text-black">
                      <div>
                        <span className="font-semibold border-r-2 border-gray-200 pr-1">
                          {addressItem.fullName}
                        </span>
                        <span className="pl-1 text-sm text-gray-500">
                          {addressItem.phone}
                        </span>
                      </div>
                      <div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleEditAddress(addressItem)}
                          >
                            <span className="text-sm text-green">Cập nhật</span>
                          </button>
                          {!addressItem.isDefault && (
                            <button
                              onClick={() => handleDeleteClick(addressItem._id)}
                              className="ml-4"
                            >
                              <span className="text-sm text-green ml-1">
                                Xóa
                              </span>
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            handleSetDefaultAddress(addressItem._id)
                          }
                          disabled={addressItem.isDefault}
                          className={`btn-sm border-2 ${
                            addressItem.isDefault
                              ? "cursor-not-allowed opacity-50"
                              : "text-blue"
                          }`}
                        >
                          Thiết lập mặc định
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {addressItem.street}, {addressItem.ward.wardName},{" "}
                      {addressItem.district.districtName},{" "}
                      {addressItem.city.cityName}
                    </p>
                    {addressItem.isDefault && (
                      <p className="text-green text-sm p-1 mt-2 inline-block rounded-lg border-green border-2">
                        Mặc định
                      </p>
                    )}
                  </div>
                  <hr className="my-2 border-t-2 border-gray-200 w-full" />
                </div>
              ))
            ) : (
              <p className="text-gray-500">Không có địa chỉ nào.</p>
            )}
            {showAddressEditForm && (
              <AddressFormEditv2
                isModalEditOpen={true}
                setIsModalEditOpen={setShowAddressEditForm}
                addressToEdit={selectedAddress}
              />
            )}
          </div>
        </div>
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal modal-open">
              <div className="modal-box relative bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-black">
                  Xác nhận xóa
                </h2>
                <p className="mb-4 text-black">
                  Bạn có chắc chắn muốn xóa địa chỉ này?
                </p>
                <div className="modal-action flex justify-end">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="btn bg-white border-none text-black hover:bg-slate-100 mr-2 px-6"
                  >
                    Trở lại
                  </button>
                  <button
                    onClick={confirmDeleteAddress}
                    className="btn bg-green border-none text-white px-6 hover:bg-green hover:opacity-80"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
            <div className="fixed inset-0 bg-black opacity-50"></div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="success"
        />
      </div>
    </div>
  );
};

export default AddressManagement;
