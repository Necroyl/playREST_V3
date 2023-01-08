const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario.js');

router.get('/login', (req, res) => {
    res.render('auth_login');
  });

router.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    let existeUsuario = usuarios.filter(usuario => usuario.usuario == login && usuario.password == password);
    if (existeUsuario.length > 0)
    {
        req.session.usuario = existeUsuario[0].usuario;
        req.session.rol = existeUsuario[0].rol;
        res.render(req.baseUrl);
    } else {
        res.render('auth_login', {error: "Usuario incorrecto"});
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
