const Address = require("../models/address");
const User = require("../models/user");
module.exports = class AddressAPI {
  static async createAddress(req, res) {
    const {
      userId,
      fullName,
      phone,
      street,
      city,
      district,
      ward,
      email,
      isDefault,
    } = req.body;
    try {
      const address = new Address({
        userId,
        fullName,
        phone,
        street,
        city,
        district,
        ward,
        email,
        isDefault,
      });
      await address.save();

      let user = await User.findById(userId);
      user.addresses.push(address);
      await user.save();

      return res
        .status(201)
        .json({ message: "Address added successfully", address });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async fetchAllAddressWithEmail(req, res) {
    try {
      const email = req.query.email;
      const addresses = await Address.find({ email: email });
      if (addresses) {
        res.status(200).json(addresses);
      } else {
        res.status(404).json({ message: "Address not found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  static async updateAddress(req, res) {
    const id = req.params.id;
    const updatedAddress = req.body;
    try {
      const address = await Address.findById(id);
      address.set(updatedAddress);
      await address.save();
      if (!updatedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      return res.status(200).json(updatedAddress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async updateAddressDefault(req, res) {
    const id = req.params.id;
    const updatedAddress = req.body;

    try {
      const address = await Address.findById(id);

      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }

      if (updatedAddress.isDefault) {
        await Address.updateMany(
          { isDefault: true, _id: { $ne: id } },
          { $set: { isDefault: false } }
        );
      }
      address.set(updatedAddress);
      await address.save();

      return res.status(200).json(address);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  static async setDefaultAddress(req, res) {
    const id = req.params.id;

    try {
      const address = await Address.findById(id);
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      await Address.updateMany(
        { isDefault: true },
        { $set: { isDefault: false } }
      );

      address.isDefault = true;
      await address.save();

      return res.status(200).json(address);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async fetchAddressByID(req, res) {
    const id = req.params.id;
    try {
      const address = await Address.findById(id);
      res.status(200).json(address);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  static async deleteAddressByID(req, res) {
    const addressId = req.params.id;
    try {
      const address = await Address.findById(addressId);
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      const user = await User.findOne({ addresses: addressId });

      if (user) {
        user.addresses = user.addresses.filter(
          (id) => id.toString() !== addressId.toString()
        );
        await user.save();
      }
      await Address.findByIdAndDelete(addressId);
      res.status(200).json({ message: "Address deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
