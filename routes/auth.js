const express = require('express');
const router = express.Router();
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");

router.get('/login', (req, res) => {
    req.session.origen = req.headers.referer;
    res.render('auth_login');
  });

  router.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
  
    Usuario.findOne({ login: username }, function (err, usuario) {
        bcrypt.compare(password, usuario.password, function (err, result) {
          if (result == true) {
            req.session.usuario = usuario.login;
            req.session.rol = usuario.rol;
            res.redirect("/juegos");
          } else {
            res.render("auth_login", { error: "Contraseña incorrecta" });
          }
        });
    });
  });

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
