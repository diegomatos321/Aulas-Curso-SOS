const ESTADOS = require("./estados.json")
const BAIRROS = require("./bairros.json")
// let municipios = require("./municipios.json")
const REGIOES = require("./regioes.json")
const fs = require("fs")


let lista = [];
let bairros = BAIRROS.map(bairro => bairro);
let estados = ESTADOS.map(estado => estado);
let {data:regioes} = JSON.parse(JSON.stringify(REGIOES));

bairros.forEach(bairro => {
  let {Nome, Uf} = bairro;
  let [Bairro, Municipio] = Nome.split(" - ");

  let body = {
    Bairro,
    Municipio,
    Uf
  }

  lista.push(body);
})

estados.forEach(({Nome:Estado, Uf, Regiao}) =>{
  lista.forEach(bairro => {
    if (bairro.Uf === Uf){
      bairro.Estado = Estado;
      bairro.Regiao = Regiao;
    }
  })
})

regioes.forEach(({Id, Nome:Regiao}) =>{
  lista.forEach(bairro => {
    if (bairro.Regiao === Id){
      bairro.Regiao = Regiao;
    }
  })
})

// console.log(lista)
/*
estados.forEach(estado => {
  lista.push({
    Estado: estado.Nome,
    UF : estado.Uf,
    Bairros: [],
    Municipios: []
  })
});

bairros.forEach((bairro) =>{
  lista.forEach(estado => {
    if (estado.UF === bairro.Uf){
      estado.Bairros.push(bairro.Nome)
    }
  });
})


municipios.forEach((municipio) =>{
  lista.forEach(estado => {
    if (estado.UF === municipio.Uf){
      estado.Municipios.push(municipio.Nome)
    }
  });
})
*/

let json = JSON.stringify(lista);
fs.writeFile("listaDeEstadosReworked.json", json, "utf8", (err, data) => {
  if(err) 
  {
    console.log (err)
    return
  }
  console.log("JSON Escrito com sucesso !")
})

console.log(json)