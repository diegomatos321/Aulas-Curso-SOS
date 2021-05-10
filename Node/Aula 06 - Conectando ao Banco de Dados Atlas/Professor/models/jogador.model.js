const mongoose = require("mongoose");

const JogadorSchema = new mongoose.Schema({
    nome: String,
    sexo: String,
    raca: String,
    classe: String
})

const Jogador = mongoose.model("Jogador", JogadorSchema)

module.exports = Jogador;