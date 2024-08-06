const mongoose = require("mongoose");
// schema model
const userSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
    minlength: 3,
  },
  photoURL: {
    type: String,
  },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
});

// create a model instance
module.exports = mongoose.model("User", userSchema);
