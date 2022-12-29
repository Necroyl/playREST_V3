const express = require("express");
const multer = require("multer");

let Juego = require(__dirname + "/../models/juego.js");

let router = express.Router();

// Librería multer para subida de ficheros
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
  }
})

let upload = multer({storage: storage});

router.get("/", (req, res) => {
  Juego.find()
    .then((resultado) => {
      res.render("admin_juegos", { juegos: resultado });
    })
    .catch((error) => {
      res.render({ error: "No se encontraron juegos." });
    });
});

router.get("/editar/:id", autenticacion, (req, res) => {
  Juego.findById({ _id: req.params["id"] })
    .then((resultado) => {
      res.render("admin_juegos_form", { juego: resultado });
    })
    .catch((error) => {
      res.render("admin_error", { error: "Juego no encontrado" });
    });
});

router.get("/nuevo", autenticacion, (req, res) => {
  res.render("admin_juegos_form");
});

router.post("/", autenticacion, upload.single("imagen"), (req, res) => {
  let juego = new Libro({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    edad: req.body.edad,
    jugadores: req.body.jugadores,
    tipo: req.body.tipo,
    precio: req.body.precio,
    imagen: req.body.imagen,
  });

  juego
    .save()
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("admin_error", { error: "No se pudo añadir el juego" });
    });
});

router.put("/:id", autenticacion, upload.single("imagen"), (req, res) => {
  Juego.findByIdAndUpdate(
    req.params["id"],
    {
      $set: {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        edad: req.body.edad,
        jugadores: req.body.jugadores,
        tipo: req.body.tipo,
        precio: req.body.precio,
        imagen: req.body.imagen,
      },
    },
    { new: true, runValidators: true }
  )
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("admin_error", { error: "No se pudo modificar el juego" });
    });
});

router.delete('/:id', autenticacion, (req, res) => {
    Libro.findByIdAndRemove(req.params['id']).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error =>{
        res.render('admin_error', {error: "No se pudo borrar el juego"});
    });
});