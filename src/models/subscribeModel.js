const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const subscribeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nom requis"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z\s'-]+$/g.test(v);
      },
      message: "Entrer un nom valide",
    },
  },

  siret: {
    type: Number,
    required: [true, "N de sirret requis"],
    validate: {
      validator: function (v) {
        return /^\d{14}$/.test(v);
      },
      message: "Entrer un  sirret valide",
    },
  },

  email: {
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

  directorName: {
    type: String,
    required: [true, "Nom requis"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z\s'-]+$/g.test(v);
      },
      message: "Entrer un nom valide",
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

  employeeCollection: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
  ],
});

subscribeSchema.pre("validate", async function (next) {
  try {
    const existingUser = await this.constructor.findOne({ email: this.email });
    if (existingUser) {
      this.invalidate("email", "Cet email est déjà enregistré.");
    }
    next();
  } catch (error) {
    next(error);
  }
});

subscribeSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt.hash(this.password, 10, (error, hash) => {
    if (error) {
      return next(error);
    }
    this.password = hash;
    next();
  });
});

const subscribeModel = mongoose.model("user", subscribeSchema);
module.exports = subscribeModel;
