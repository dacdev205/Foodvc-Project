import axios from "axios";
const url = "http://localhost:3000/address";
const getToken = () => localStorage.getItem("access-token");

export default class addressAPI {
  //
  static async postAddressToDB(address) {
    const token = getToken();

    try {
      const res = await axios.post(url, address, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async updateAddressInDB(addressToEdit, updateData) {
    const token = getToken();

    try {
      const res = await axios.patch(`${url}/${addressToEdit}`, updateData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
  static async updateAddressDefault(addressId, addressData) {
    const token = getToken();
    try {
      const res = await axios.patch(
        `${url}/isDefault/${addressId}`,
        addressData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("error");
      throw error;
    }
  }
  static async setDefaultAddress(addressId) {
    const token = getToken();

    try {
      const res = await axios.patch(
        `${url}/${addressId}/setDefault`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to set default address:", error);
      throw error;
    }
  }

  static async deleteAddress(id) {
    const token = localStorage.getItem("access-token");
    const res = await axios.delete(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
