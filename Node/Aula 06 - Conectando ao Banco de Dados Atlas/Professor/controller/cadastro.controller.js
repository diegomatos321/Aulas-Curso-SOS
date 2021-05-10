let path = require("path")

class cadastroController{
  Get(req, res){
    res.status(200).sendFile(path.join(__dirname, "/../", "/public", "/pages", "/home.html"))
  }

  Post(req, res){
    console.log(req.body)
    const {nome, sexo, raca} = req.body;
    let body = {};
    if (!nome) {
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
    // res.status(200).sendFile(path.join(__dirname, "/../", "/public", "/pages", "/confirmar.html"))
  }
}

module.exports = cadastroController;