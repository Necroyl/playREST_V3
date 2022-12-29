const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const session = require("express-session");
const methodOverride = require("method-override");

// Enrutadores
const juegos = require(__dirname + "/routes/juegos");
const auth = require(__dirname + "/routes/auth");

// Conexión a la BD
mongoose.connect("mongodb://127.0.0.1/juegos", { useNewUrlParser: true });

// Servidor Express
let app = express();

// Asignación del motor de plantillas
app.set("view engine", "njk");

// Configuramos motor Nunjucks
nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

// Carga de middleware y enrutadores
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

// Configuración de la sesión en la aplicación
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));

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

app.use("/public", express.static(__dirname + "/public"));
app.use("/admin", juegos);
app.use("/auth", auth);

// Puesta en march del servior
app.listen(8080);