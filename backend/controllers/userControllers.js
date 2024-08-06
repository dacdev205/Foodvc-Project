const User = require("../models/user");
const fs = require("fs");
const Role = require("../models/roles");
module.exports = class usersAPI {
  // get all users
  static async getAllUsers(req, res) {
    try {
      const users = await User.find({}).populate("roles");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getSigleUser(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  static async getUserByEmail(req, res) {
    const email = req.params.email;
    try {
      const user = await User.findOne({ email });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // post a new user
  static async createUser(req, res) {
    const { email, name, photoURL, role = "Người dùng" } = req.body;
    const query = { email };

    try {
      const existingUser = await User.findOne(query);
      if (existingUser) {
        return res.status(302).json({ message: "User already exists!" });
      }
      const userRole = await Role.findOne({ name: role });
      if (!userRole) {
        return res.status(400).json({ message: "Role does not exist!" });
      }

      const newUser = new User({
        email,
        name,
        photoURL,
        roles: [userRole._id],
      });
      const result = await newUser.save();

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createUserAdmin(req, res) {
    const { email, name, photoURL, roles } = req.body;
    const query = { email };

    try {
      const existingUser = await User.findOne(query);
      if (existingUser) {
        return res.status(302).json({ message: "User already exists!" });
      }

      const userRole = await Role.findOne({ _id: roles });
      if (!userRole) {
        return res.status(400).json({ message: "Role does not exist!" });
      }

      const newUser = new User({
        email,
        name,
        photoURL,
        roles: [userRole._id],
      });
      const result = await newUser.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async updateUser(req, res) {
    const userId = req.params.id;
    let new_image = "";
    try {
      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (req.file) {
        new_image = req.file.filename;
        if (existingUser.photoURL) {
          try {
            fs.unlinkSync("./uploads/" + existingUser.photoURL);
          } catch (err) {
            console.log(err);
          }
        }
        new_image = req.file.filename;
      } else {
        new_image = existingUser.photoURL;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { ...req.body, photoURL: new_image },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // delete a user
  static async deleteUser(req, res) {
    const userId = req.params.id;
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      // if user not found
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found!" });
      }
      res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getPermissions(req, res) {
    const email = req.params.email;
    try {
      const user = await User.findOne({ email: email }).populate("roles");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const permissions = await Promise.all(
        user.roles.map(async (roleId) => {
          const role = await Role.findById(roleId);
          return role ? role.permissions : [];
        })
      );
      const flatPermissions = [].concat(...permissions);
      res.status(200).json({ permissions: flatPermissions });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllRoles(req, res) {
    try {
      const roles = await Role.find({});
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateUserRole(req, res) {
    const userId = req.params.id;
    const { roleId } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      // Update the user's roles
      user.roles = [{ _id: role._id, name: role.name }];
      await user.save();

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
