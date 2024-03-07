const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const subscribeModel = require("./subscribeModel");

const employeeSchema = new mongoose.Schema({
  photo: {
    type: String,
    default: "",
  },

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

  fonction: {
    type: String,
    required: [true, "Fonction requise"],
  },

  blame: {
    type: Number,
  },
});

employeeSchema.pre("save", async function (next) {
  await subscribeModel.updateOne(
    { _id: this._user },
    { $addToSet: { employeeCollection: this._id } }
  );
  next()
});

employeeSchema.post('deleteOne' , async function (next) {
    const deletedEmployeeId = this.getQuery()._id;
})

const employeeModel = mongoose.model("employee", employeeSchema);
module.exports = employeeModel;
