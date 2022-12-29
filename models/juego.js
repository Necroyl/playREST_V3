const mongoose = require("mongoose");

let fecha = new Date();

let edicionSchema = new mongoose.Schema({
  edicion: {
    type: String,
    required: true,
  },
  anyo: {
    type: Number,
    min: 2000,
    max: parseInt(fecha.getFullYear()) - 1,
  },
});

let juegoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minlength: 6,
  },
  descripcion: {
    type: String,
    requiered: true,
  },
  edad: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  jugadores: {
    type: Number,
    required: true,
  },
  tipo: {
    type: String,
    enum: ["rol", "escape", "dados", "fichas", "cartas", "tablero"],
  },
  precio: {
    type: Number,
    required: true,
    min: 1,
  },
  imagen: {
    type: String,
  },
  ediciones: [edicionSchema],
});

let Juego = mongoose.model("juegos", juegoSchema);

module.exports = Juego;
