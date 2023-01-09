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

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(session({
  secret: '1234',
  resave: true,
  saveUninitialized: false
}));

app.use(methodOverride("_method"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

app.use(multer({ storage }).single("imagen"));

// Asignación del motor de plantillas
app.set('view engine', 'njk');

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(bodyParser.urlencoded({ extended: false }));

// Configuración de la sesión en la aplicación
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Asociación de enrutadores
app.use("/", publico);
app.use("/juegos", juegos);
app.use("/auth", auth);

// Puesta en marcha del servior
app.listen(8080);
