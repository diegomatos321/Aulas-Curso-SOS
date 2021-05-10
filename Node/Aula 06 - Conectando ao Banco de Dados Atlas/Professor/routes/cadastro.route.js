const express = require("express");
const router = express.Router();
const path = require("path")
const mongoose = require("mongoose");

// const Jogador = require("../models/jogador.model")

const jogadorSchema = new mongoose.Schema({}, { strict: false });
const Jogador = mongoose.model("Jogador", jogadorSchema);

/* router.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "public", "pages", "home.html"))
} ); */

router.post("/", async function salvarJogador (req, res) {
    console.log(req.body)
    const {nome, sexo, raca, classe} = req.body;
    console.log(req.body)
    try {
      let jogador = new Jogador({
        nome,
        sexo,
        raca,
        classe
      })

      let jogadorSalvo = await jogador.save();

      res.status(201).json({message: "Salvo com sucesso !", jogadorSalvo});
    } catch (error) {
      res.status(404).json({message: error})
    }
   /*if (!nome) {
      body = {
        mensagem : "Erro, nome precisa ser fornecido"
      }
      return res.status(400).json(body)
      // return res.status(400).sendFile(path.join(__dirname, "/../", "/public", "/pages", "/erro.html"))
    }
   body = {
      mensagem : "Cadastrado com Sucesso !"
    }
    res.status(200).json(body);
    res.status(200).sendFile(path.join(__dirname, "/../", "/public", "/pages", "/confirmar.html"))*/
});

module.exports = router;