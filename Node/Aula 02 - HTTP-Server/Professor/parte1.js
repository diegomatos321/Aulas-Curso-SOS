// Criando um servidor
const http = require("http")
const server = http.createServer((req, res)=>{ // Objeto http server
    // res.write("Olá mundo do Node JS")
    if(req.url === "/"){
        res.write("Olá mundo do Node JS")
    }
    else{
        res.write("Voce nao esta na raiz do projeto")
    }
    res.end();
}) 

server.listen(3000, () => console.log("Servidor Rodando !!"));
