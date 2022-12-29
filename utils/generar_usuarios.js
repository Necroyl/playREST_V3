const mongoose = require("mongoose");
const Usuario = require(__dirname + "/../models/usuario");

mongoose.connect("mongodb://127.0.0.1:27017/playrest_v3");

Usuario.collection.drop();

let usu1 = new Usuario({
  login: "maycalle",
  password: "12345678",
});

usu1.save();

let usu2 = new Usuario({
  login: "rosamaria",
  password: "87654321",
});

usu2.save();
