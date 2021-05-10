//console.log("Olá Mundo do Node")

// Falar sobre os módulos

const teste = require("./exportExemplo");
console.log(teste);

// Exportar mais de um

console.log(teste.somar(15, 2))
console.log(teste.PI)
console.log(new teste.objetoAleatorio())