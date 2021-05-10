// PACKAGE.JSON é um metadado dizendo o sobre o que é seu projeto e quais dependencias ele possui
// Para instalar basta usar: npm install nome-do-modulo
// Para desinstalar basta usar: npm uninstall nome-do-modulo

// Patch: Corrige bugs
// Minor: Adiciona novas funcionalidades, porém nao quebra nossa versao atual
// Major: Nosso código nao é mais compativel com a nova versao

// major.minor.patch
// ^ => 4.x.x
// ~ => 4.17.x
// Sem nada, não atualiza

const express = require("express");
const app = express();
const path = require("path")

app.use("/public", express.static(path.join(__dirname, "static")))
app.use("/resources", express.static(path.join(__dirname, "static", "imagens")))

app.get("/", (req, res) =>{ // ISSO É UMA ROTA/ROUTER
    //res.send("Olá mundo");
    //res.send("Você está na Home page")
    //res.sendFile(__dirname + "/static/index.html")
    res.sendFile(path.join(__dirname, "static", "exemplo.html"))
})

app.get("/resources", (req, res)=>{
    res.sendFile(__dirname + "/static/imagens/trabalho.webp")
})

app.get("/blog", (req, res)=>{ // ISSO É UMA ROTA/ROUTER
    res.send("Você está no Blog")
})

app.get("/jogo/:nickname", (req, res)=>{
    console.log(req.params);
    console.log(req.query)
    res.send(`Bem-vindo ${req.params.nickname} ! Voce está na pagina do jogo`)
})

app.listen(3000, (err)=>{
    if(err){
        console.log(err);
        return;
    }

    console.log("O servidor está funcionando !!!")
})