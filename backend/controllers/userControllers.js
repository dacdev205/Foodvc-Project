const User = require("../models/user");
const fs = require("fs");
const Role = require("../models/roles");
const Shop = require("../models/shop");
const UserRank = require("../models/userRank");
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
  static async getUsers(req, res) {
    try {
      const {
        searchTerm = "",
        filterType = "name",
        page = 1,
        limit = 5,
      } = req.query;

      const query = {};
      if (searchTerm) {
        if (filterType === "name") {
          query.name = { $regex: searchTerm, $options: "i" };
        } else if (filterType === "roles") {
          const role = await Role.findOne({
            name: { $regex: searchTerm, $options: "i" },
          });
          if (role) {
            query.roles = role._id;
          } else {
            query.roles = null;
          }
        }
      }

      const users = await User.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("roles");

      const totalUsers = await User.countDocuments(query);
      const totalPages = Math.ceil(totalUsers / limit);

      res.json({ users, totalPages });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async getUserRank(req, res) {
    const userId = req.params.id;

    try {
      const user = await User.findById(userId).populate("rank");

      if (!user) {
        return res.status(404).json({ message: "Người dùng không tìm thấy" });
      }

      if (!user.rank) {
        return res
          .status(404)
          .json({ message: "Hạng người dùng không tìm thấy" });
      }

      res.status(200).json({ rank: user.rank });
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
      const user = await User.findOne({ email }).populate("rank");
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async searchUserNShopByName(req, res) {
    const { name } = req.query;

    try {
      const users = await User.find({
        name: { $regex: new RegExp(name, "i") },
      }).populate("rank");

      const shops = await Shop.find({
        shopName: { $regex: new RegExp(name, "i") },
      });

      const results = {
        users,
        shops,
      };

      if (users.length > 0 || shops.length > 0) {
        res.status(200).json({
          message: "Đã tìm thấy người dùng và/hoặc cửa hàng",
          data: results,
        });
      } else {
        res
          .status(404)
          .json({ message: "Không tìm thấy người dùng hoặc cửa hàng" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createUser(req, res) {
    const { email, name, photoURL, role = "Người dùng" } = req.body;
    const query = { email };

    try {
      const existingUser = await User.findOne(query);
      const bronzeRank = await UserRank.findOne({ user_rank_name: "Bronze" });
      if (existingUser) {
        return res.status(302).json({ message: "Người dùng đã tồn tại!" });
      }
      const userRole = await Role.findOne({ name: role });
      if (!userRole) {
        return res.status(400).json({ message: "Vai trò không tồn tại!" });
      }

      const newUser = new User({
        email,
        name,
        photoURL,
        roles: [userRole._id],
        rank: bronzeRank ? bronzeRank._id : null,
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
        return res.status(302).json({ message: "Người dùng đã tồn tại!" });
      }

      const userRole = await Role.findOne({ _id: roles });
      if (!userRole) {
        return res.status(400).json({ message: "Vai trò không tồn tại!" });
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
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
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
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteUser(req, res) {
    const userId = req.params.id;
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      // if user not found
      if (!deletedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      res.status(200).json({ message: "Người dùng được xóa thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getPermissions(req, res) {
    const email = req.params.email;
    try {
      const user = await User.findOne({ email: email }).populate("roles");
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
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
  static async getRoleById(req, res) {
    const id = req.params.id;
    try {
      const role = await Role.findById(id);
      res.status(200).json(role);
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
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({ message: "Không tìm thấy vai trò" });
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
