const User = require("../models/user");
const fs = require("fs");
module.exports = class usersAPI {
  
  // get all users
    static async getAllUsers (req, res) {
        try {
          const users = await User.find({});
          res.status(200).json(users);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      };
      
      static async getSigleUser(req, res) {
        const userId = req.body._id;
        try {
          console.log("Request User ID:", userId);
          const user = await User.findOne({ userId: userId });
          res.status(200).json(user);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
      
      
      // post a new user
      static async createUser (req, res) {
        const user = req.body;
        const query = { email: user.email };
        try {
          const existingUser = await User.findOne(query);
          if (existingUser) {
            return res.status(302).json({ message: "User already exists!" });
          }
          const result = await User.create(user);
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      };
      
      // delete a user
      static async deleteUser (req, res) {
        const userId = req.params.id;
        try {
          const deletedUser = await User.findByIdAndDelete(userId);
          // if user not found
          if(!deletedUser){
              return res.status(404).json({ message: "User not found!" });
          }
          res.status(200).json({message: "User deleted successfully!"})
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      };
      
      // get admin
      static async getAdmin (req, res)  {
          const email = req.params.email;
          const query = {email: email};
          try {
              const user = await User.findOne(query);
              // console.log(user)
              if(email !== req.decoded.email){
                  return res.status(403).send({message: "Forbidden access"})
              }
              let admin = false;
              if(user ){
                  admin = user?.role === "admin";
              }
              res.status(200).json({admin})
              
          } catch (error) {
              res.status(500).json({ message: error.message });
          }
      };
      
      // make admin of a user
      static async makeAdmin (req, res) {
          const userId = req.params.id;
          try {
              const updatedUser = await User.findByIdAndUpdate(
                  userId, 
                  {role: "admin"},
                  {new: true, runValidators: true}
              );
      
              if(!updatedUser){
                  return res.status(404).json({message: "User not found"})
              }
              res.status(200).json(updatedUser)
              
          } catch (error) {
              res.status(500).json({ message: error.message });
          }
      }
}




