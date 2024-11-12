/* eslint-disable react/prop-types */
import React, { useState } from "react";

const AddShippingPartnerModal = ({ open, onClose, onAddShippingPartner }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [requiredFields, setRequiredFields] = useState([]);
  const [customField, setCustomField] = useState(""); // Input for new custom field

  // Toggle required field selection
  const handleFieldToggle = (field) => {
    setRequiredFields(
      (prevFields) =>
        prevFields.includes(field)
          ? prevFields.filter((f) => f !== field) // Remove field if already selected
          : [...prevFields, field] // Add field if not selected
    );
  };

  // Add new custom field to requiredFields
  const handleAddCustomField = () => {
    if (customField && !requiredFields.includes(customField)) {
      setRequiredFields([...requiredFields, customField]);
      setCustomField(""); // Clear input after adding
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    onAddShippingPartner({
      name,
      description,
      requiredFields,
    });
    setName("");
    setDescription("");
    setRequiredFields([]);
    onClose(); // Close modal after submission
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        open ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Thêm đối tác vận chuyển</h2>

        {/* Input for Partner Name */}
        <input
          type="text"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Tên đối tác"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Input for Description */}
        <textarea
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* List and Toggle Required Fields */}
        <div className="mb-4">
          <h3 className="font-semibold">Trường bắt buộc</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {requiredFields.map((field) => (
              <label key={field} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={requiredFields.includes(field)}
                  onChange={() => handleFieldToggle(field)}
                />
                <span>{field}</span>
              </label>
            ))}
          </div>
          <div className="flex mt-4 justify-between">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Thêm trường bắt buộc mới"
              value={customField}
              onChange={(e) => setCustomField(e.target.value)}
            />
            <button
              onClick={handleAddCustomField}
              className="bg-green text-white px-4 rounded-r hover:bg-green-600"
            >
              Thêm trường
            </button>
          </div>
        </div>

        {/* Input for adding custom required field */}
        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-green text-white rounded hover:bg-green-600"
        >
          Thêm đối tác
        </button>
      </div>
    </div>
  );
};

export default AddShippingPartnerModal;
