let express = require("express");
let router = express.Router();
let path = require("path")

/* router.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "/../", "/public", "/pages", "/home.html"))
} ); */
router.post("/", (req, res) => {
    console.log(req.body)
    const {nome, sexo, raca} = req.body;
    let body = {};
    if (!nome) {
      body.mensagem = "Erro, nome precisa ser fornecido";

      return res.status(404).json(body)
      // return res.status(404).sendFile(path.join(__dirname, "/../", "/public", "/pages", "/erro.html"))
    }
    body.mensagem = "Cadastrado com Sucesso !";

    return res.status(200).json(body);
    // return res.status(200).sendFile(path.join(__dirname, "/../", "/public", "/pages", "/confirmar.html"))

});

module.exports = router;