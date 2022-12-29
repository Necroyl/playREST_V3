const mongoose = require("mongoose");

let usuarioSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

let Usuario = mongoose.model("usuarios", usuarioSchema);

module.exports = Usuario;
