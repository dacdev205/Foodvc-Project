const Address = require('../models/address');
const Payment = require('../models/payment');
module.exports = class AddressAPI {
    static async createAddress(req, res) {
        const { paymentId, fullName, phone, street, city, district, ward, email } = req.body;
        try {
            const address = new Address({ paymentId, fullName, phone, street, city, district, ward, email });
            await address.save();
            
            let payment = await Payment.findById(paymentId);
            payment.addresses.push(address);
            await payment.save();
            
            return res.status(201).json({ message: 'Address added successfully', address });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    static async fetchAllAddressWithEmail(req, res) {
        try {
            const email = req.query.email;
            const addresses = await Address.find({email: email});
            if(addresses) {
                res.status(200).json(addresses);
            } else {
                res.status(404).json({message: 'Address not found'})
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
    static async updateAddress(req, res) {
        const id = req.params.id;
        const updatedAddress = req.body
        try {
            const address = await Address.findById(id)
            address.set(updatedAddress)
            await address.save();
            if (!updatedAddress) {
                return res.status(404).json({ message: "Address not found" });
            }
            return res.status(200).json(updatedAddress);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async fetchAddressByID(req, res) {
        const id = req.params.id;
        try {
            const address = await Address.findById(id);
            res.status(200).json(address);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
}
