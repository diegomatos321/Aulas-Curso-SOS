let express = require("express");
let path = require("path")
let app = express();
let rotaCadastro = require("./routes/cadastro.route")

const stringConexao = "mongodb+srv://diegomatos:995121978Matos@portifolio.jukyv.gcp.mongodb.net/Aula?retryWrites=true&w=majority"

const mongoose = require("mongoose");
mongoose.connect(stringConexao, {useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.on('error', err => {
  console.log("Error com a conexão com o Banco de Dados:", err);
});

mongoose.connection.on('open', () => {
  console.log("Conectado ao Banco de Dados !!");
});

// app.use(express.urlencoded({extended : true}));
app.use(express.json())

let publicPath = path.join(__dirname + "/public") 
app.use(express.static(publicPath))

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "pages", "home.html"))
} );
app.use("/cadastro", rotaCadastro)

app.listen(80, (err) => {
  if (err) {
    console.log("Ocorreu um erro: " + err);
    return;
  }

  console.log("Servidor Pronto !")
})