const express = require("express");
const path = require("path")
const app = express();

const public = path.join(__dirname, "public");

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.static(public));

const cadastroRouter = require("./routes/cadastros")

//app.use("/", cadastroRouter)

/*app.get("/buscar", (req, res)=>{
    console.log(req.query)
})*/

app.get("/buscar/:nome", (req, res) => {
    console.log(req.params)
})

/*
app.post("/", (req, res)=>{
    console.log(req.body)
    // trabalhando com a informação
    res.json(req.body)
})

app.patch("/", (req, res)=>{
    // console.log("Patch Request")
    console.log(req.body)
    // trabalhando com a informação
    res.json(req.body)
})

app.delete("/", (req, res)=>{
    console.log("DELETE Request")
    // trabalhando com a informação
    res.json(req.body)
})
*/

app.listen(3000, ()=>{
    console.log("O servidor esta ligado !!!")
})