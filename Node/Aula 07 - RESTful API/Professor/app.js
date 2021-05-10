let express = require("express");
let path = require("path")
let app = express();
let rotaCadastro = require("./routes/cadastro.route.js")

// app.use(express.urlencoded({extended : true}));
app.use(express.json())

let publicPath = path.join(__dirname + "/public") 
app.use(express.static(publicPath))

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "/public", "/pages", "/home.html"))
} );

app.use("/cadastrar", rotaCadastro);

app.listen(3000, (err) => {
  if (err) {
    console.log("Ocorreu um erro: " + err);
    return;
  }

  console.log("Servidor Pronto !")
})