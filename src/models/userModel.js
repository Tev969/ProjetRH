const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  mail: {
    type: String,
    required: [true, "mail requis"],
    unique: true,
    
    validate: {
      validator: function (v) {
        return /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/g.test(v);
      },
      message: "Enter valid email",
    },
  },

  password: {
    type: String,
    required: [true, "password requis"],
    validate: {
      validator: function (v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/g.test(v);
      },
      message: "Enter valid password",
    },
  },

});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
