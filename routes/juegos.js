const express = require("express");
const multer = require("multer");
const autenticacion = require("../utils/auth");

let Juego = require(__dirname + "/../models/juego.js");

let router = express.Router();

// Librería multer para subida de ficheros
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/portadas");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

let upload = multer({ storage: storage });

router.get("/", autenticacion, (req, res) => {
  Juego.find()
    .then((resultado) => {
      res.render("admin_juegos", { juegos: resultado });
    })
    .catch((error) => {
      res.render({error: "No se encontraron juegos"});
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
  let juego = new Juego({
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
      res.render("admin_error");
    });
});

router.put("/:id", autenticacion, upload.single("imagen"), (req, res) => {
  let update = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    edad: req.body.edad,
    jugadores: req.body.jugadores,
    tipo: req.body.tipo,
    precio: req.body.precio,
  };
  if (req.file) {
    update.imagen = req.file.filename;
  }

  Juego.findByIdAndUpdate(req.params["id"], update, {
    new: true,
    runValidators: true,
  })
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

router.delete("/:id", autenticacion, (req, res) => {
  Juego.findByIdAndRemove(req.params["id"])
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

router.post("/juegos/:id/ediciones", autenticacion, (req, res) => {
    // Obtener el ID del juego y los datos de la edición a añadir
    const id = req.params.id;
    const edicion = req.body;
  
    // Buscar el juego en la base de datos y añadir la edición
    Juego.findById(id, (error, juego) => {
        juego.ediciones.push(edicion);

        juego.save((error) => {
            if (error) {
                res.render("admin_error", { error: "No se pudo guardar la edición" });
            } else {
                res.redirect(req.baseUrl);
            }
        });
    });
});

router.delete("/juegos/:id/ediciones/:idEdicion", autenticacion, (req, res) => {
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
                res.redirect(`/admin/juegos/${id}`);
            }
        });
    });
});

module.exports = router;
