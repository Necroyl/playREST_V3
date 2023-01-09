const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
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

const Usuario = mongoose.model('User', usuarioSchema);
module.exports = Usuario;
