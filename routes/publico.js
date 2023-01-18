const express = require("express");
const router = express.Router();
const Juego = require(__dirname + "/../models/juego.js");

// Ruta para la raíz de la aplicación
router.get("/", function (req, res) {
  res.render("publico_index");
});

// Ruta para buscar juegos por nombre
router.get("/buscar", (req, res) => {
    Juego.find({ "nombre": { $regex: req.query.nombre, $options: "i" }})
    .then((resultado) => {
      if(resultado.length === 0)
        res.render("publico_error", { error: "No se han encontrado juegos"});
      else
        res.render("publico_index", { juegos: resultado });
    })
    .catch(error => {
      res.render("publico_error", { error: "Ha habido un error"} );
    });
});

// Ruta para mostrar un juego en particular
router.get("/juegos/:id", function (req, res) {
  Juego.findById(req.params['id'])
    .then((resultado) => {
      res.render("publico_juego", { juego: resultado });
    })
    .catch((error) => {
      res.render("publico_error", { error: "Juego no encontrado"});
    });
});

module.exports = router;
