import axios from "axios";
const url = "http://localhost:3000/address";

export default class addressAPI {
  //
  static async postAddressToDB(address) {
    try {
      const res = await axios.post(url, address);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async updateAddressInDB(addressToEdit, updateData) {
    try {
      const res = await axios.patch(`${url}/${addressToEdit}`, updateData);
      return res.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
  static async updateAddressDefault(addressId, addressData) {
    try {
      const res = await axios.patch(
        `${url}/isDefault/${addressId}`,
        addressData
      );
      return res.data;
    } catch (error) {
      console.error("error");
      throw error;
    }
  }
  static async setDefaultAddress(addressId) {
    try {
      const res = await axios.patch(`${url}/${addressId}/setDefault`);
      return res.data;
    } catch (error) {
      console.error("error");
      throw error;
    }
  }

  static async deleteAddress(id) {
    const res = await axios.delete(`${url}/${id}`);
    return res.data;
  }
}
