const mongoose = require("mongoose");

const edicionSchema = new mongoose.Schema({
  edicion: {
    type: String,
    required: true,
  },
  anyo: {
    type: Number,
    min: 2000,
    max: new Date().getFullYear() - 1,
  },
});

const juegoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minlength: 6,
  },
  descripcion: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
    min: 0,
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
    min: 0,
  },
  imagen: {
    type: String,
  },
  ediciones: [edicionSchema],
});

const Juego = mongoose.model("Juego", juegoSchema);

module.exports = Juego;
