const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const multer = require("multer");
const mongoose = require("mongoose");
const nunjucks = require("nunjucks");

const publico = require("./routes/publico");
const juegos = require("./routes/juegos");
const auth = require("./routes/auth");

// Conexión a la base de datos
mongoose.connect("mongodb://127.0.0.1:27017/playrest_v3", {
  useNewUrlParser: true,
}).catch((error) => {
  console.error(error);
});;
mongoose.set("strictQuery", false);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
})

const app = express();

app.use(multer({ storage }).single("imagen"));

// Asignación del motor de plantillas
app.set('view engine', 'njk');

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de la sesión en la aplicación
app.use(session({
  secret: '1234',
  resave: true,
  saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Configuración method-override para delete en formulario
app.use(
  methodOverride(function (req, res) {
      if (req.body && typeof req.body === "object" && "_method" in req.body) {
          let method = req.body._method;
          delete req.body._method;
          return method;
      }
  })
);

// Asociación de enrutadores
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use("/public", express.static(__dirname + "/public"));
app.use("/juegos", juegos);
app.use("/", publico);
app.use("/auth", auth);

// Puesta en marcha del servior
app.listen(8080);
