const express = require("express");
const router = express.Router();
const Juego = require(__dirname + "/../models/juego.js");

// Ruta para la raíz de la aplicación
router.get("/", function (req, res) {
  res.render("publico_index");
});

// Ruta para buscar juegos por nombre
router.get("/buscar", function (req, res) {
  // Aquí deberías buscar los juegos que coincidan con el texto enviado en la petición
  // y pasar el conjunto de resultados a la vista publico_index
  Juego.find()
    .then((resultado) => {
      res.render("publico_index", { juegos: resultado });
    })
    .catch((error) => {
      res.render("publico_error", { error: "No se encontraron juegos"} );
    });
});

// Ruta para mostrar un juego en particular
router.get("/juegos/:id", function (req, res) {
  Juego.findById(req.params['id'])
    .then((resultado) => {
      res.render("publico_index", { juegos: resultado });
    })
    .catch((error) => {
      res.render("publico_error", { error: "Juego no encontrado"});
    });
});

module.exports = router;
