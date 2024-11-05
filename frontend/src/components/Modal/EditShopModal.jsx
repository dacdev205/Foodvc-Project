/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const EditShopModal = ({ open, onClose, shop, onUpdate }) => {
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    if (shop) {
      setShopName(shop.shopName);
      setDescription(shop.description);
      setIsOpen(shop.shop_isOpen);
    }
  }, [shop]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedShop = {
      shopName,
      description,
      shop_isOpen: isOpen,
    };
    onUpdate(updatedShop);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Chỉnh sửa thông tin cửa hàng</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block">Tên cửa hàng:</label>
            <input
              type="text"
              name="shopName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mt-4">
            <label className="block">Mô tả:</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mt-4">
            <label className="block">Trạng thái:</label>
            <label>
              <input
                type="checkbox"
                checked={isOpen}
                onChange={() => setIsOpen(!isOpen)}
              />
              Mở cửa
            </label>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 text-white py-2 px-4 rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-green text-white py-2 px-4 rounded"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShopModal;
