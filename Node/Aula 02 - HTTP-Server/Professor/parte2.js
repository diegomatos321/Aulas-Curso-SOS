// Servindo arquivos estáticos

const http = require("http")
const fs = require("fs")
const path = require("path")

const server = http.createServer((req, res)=>{
    if(req.url === "/"){
        fs.readFile(path.join(__dirname, "static", "index.html"), (err, data) =>{
            if (err){
                console.log(err);
                return;
            }

            res.writeHead(200, {"Content-Type" : "text/html"})
            res.write(data);
            res.end();
        })
    }

    if(req.url === "/users"){
        fs.readFile(path.join(__dirname, "static", "pessoas.json"), (err, data) =>{
            if (err){
                console.log(err);
                return;
            }

            res.writeHead(200, {"Content-Type" : "application/json"})
            res.write(data);
            res.end();
        })
    }
})

server.listen(3000, ()=> console.log("Servidor Rodando !!"))
