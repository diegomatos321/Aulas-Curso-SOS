let express = require("express");
let cadastroRouter = express.Router();

cadastroRouter.get("/busca", (req, res) => {
    console.log("Rota de Busca")
    console.log(req.query)
})

cadastroRouter.get("/novo/:nome", (req, res) => {
    console.log("Rota para criar novo nome")
    console.log(req.params)
})

cadastroRouter.post("/", (req, res) => {
    console.log("Rota para adicionar novo cadastro")
    console.log(req.body)
    res.json(req.body)
})

cadastroRouter.patch("/", (req, res) => {
    console.log("Rota para atualizar um cadastro já existente")
    console.log(req.body)
    res.json(req.body)
})

cadastroRouter.delete("/", (req, res) => {
    console.log("Rota para deletar uma coleção já existente")
    console.log(req.body)
    res.json(req.body)
})



module.exports = cadastroRouter;