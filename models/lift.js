const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const liftSchema = new Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Lift", liftSchema);