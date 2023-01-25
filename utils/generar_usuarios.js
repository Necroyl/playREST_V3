const mongoose = require("mongoose");
const Usuario = require(__dirname + "/../models/usuario");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb://127.0.0.1:27017/playrest_v3");

Usuario.collection.drop();

let usu1 = new Usuario({
  login: "maycalle",
  password: "12345678",
});

const saltRounds = 10;
bcrypt.genSalt(saltRounds, function (err, salt) {
  if (err) {
    console.error(err);
  } else {
    bcrypt.hash(usu1.password, salt, function (err, hash) {
      if (err) {
        console.error(err);
      } else {
        usu1.password = hash;
        usu1.save(function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("Usuario 1 guardado con éxito");
          }
        });
      }
    });
  }
});

let usu2 = new Usuario({
  login: "rosamaria",
  password: "87654321",
});
bcrypt.genSalt(saltRounds, function (err, salt) {
  if (err) {
    console.error(err);
  } else {
    bcrypt.hash(usu2.password, salt, function (err, hash) {
      if (err) {
        console.error(err);
      } else {
        usu2.password = hash;
        usu2.save(function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("Usuario 2 guardado con éxito");
          }
        });
      }
    });
  }
});

module.exports = [usu1, usu2];
