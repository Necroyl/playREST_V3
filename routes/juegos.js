const express = require("express");
const multer = require("multer");
const autenticacion = require("../utils/auth");

let Juego = require(__dirname + "/../models/juego.js");

// Librería multer para subida de ficheros
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

let upload = multer({ storage: storage });

let router = express.Router();

router.get("/", autenticacion, (req, res) => {
  Juego.find()
    .then((resultado) => {
      res.render("admin_juegos", { juegos: resultado });
    })
    .catch((error) => {
      res.render({ error: "No se encontraron juegos" });
    });
});

router.get("/nuevo", autenticacion, (req, res) => {
  res.render("admin_juegos_form");
});

router.get("/editar/:id", autenticacion, (req, res) => {
  Juego.findById({ _id: req.params["id"] })
    .then((resultado) => {
      res.render("admin_juegos_form", { juego: resultado });
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

router.post("/", autenticacion, upload.single("imagen"), (req, res) => {
  let juego;

  try {
    juego = new Juego({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      edad: req.body.edad,
      jugadores: req.body.jugadores,
      tipo: req.body.tipo,
      precio: req.body.precio,
    });

    if (req.file && req.file.filename) juego.imagen = req.file.filename;

    juego
      .save()
      .then(() => {
        res.redirect("/juegos");
      })
      .catch((error) => {
        res.render("admin_error", { mensaje: error });
      });
  } catch (error) {
    res.render("admin_error", { mensaje: error });
  }
});

router.post("/:id", autenticacion, upload.single("imagen"), (req, res) => {
  const updates = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    edad: req.body.edad,
    jugadores: req.body.jugadores,
    tipo: req.body.tipo,
    precio: req.body.precio,
  }
  if (req.file && req.file.filename){
    updates.imagen = req.file.filename;
  }
  
  Juego.findByIdAndUpdate(
    req.params["id"],
    { $set: updates },
    { new: true, runValidators: true }).then((resultado) => {
      res.redirect('/juegos');
    }).catch((error) => {
      res.render("admin_error", { mensaje: error });
    });
});

router.delete("/delete/:id", autenticacion, (req, res) => {
  Juego.findByIdAndDelete(req.params["id"])
    .then((resultado) => {
      res.redirect("/juegos");
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

router.post("/:id/ediciones", autenticacion, (req, res) => {
  // Obtener el ID del juego y los datos de la edición a añadir
  const id = req.params.id;
  const edicion = { edicion: req.body.edicion, anyo: req.body.anyo };

  // Buscar el juego en la base de datos y añadir la edición
  Juego.findByIdAndUpdate( id, {
    $push:{
      ediciones: edicion
    }
  }).then( () =>{
    res.redirect("/juegos/" + id);
  }).catch( (error) =>{
    res.render("publico_error", { error: "No se pudo guardar la edición" });
  });
});

router.delete("/:id/ediciones/:idEdicion", autenticacion, (req, res) => {
  // Obtener el ID del juego y el ID de la edición a borrar
  const id = req.params.id;
  const idEdicion = req.params.idEdicion;

  // Buscar el juego en la base de datos y borrar la edición
  Juego.findById(id, (error, juego) => {
    juego.ediciones = juego.ediciones.filter(
      (edicion) => edicion.id != idEdicion
    );

    juego.save((error) => {
      if (error) {
        res.render("admin_error", { error: error });
      } else {
        res.redirect("/juegos/" + juego._id);
      }
    });
  });
});

module.exports = router;
