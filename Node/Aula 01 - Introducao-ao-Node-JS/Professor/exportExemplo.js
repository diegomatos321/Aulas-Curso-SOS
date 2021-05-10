const somar = function (a, b){
    return a + b
}

// module.exports = somar
//module.exports.somar = somar;

const PI = 3.14
class objetoAleatorio{
    constructor(){
        this.nome = "Eu sou um objeto"
    }
}

//module.exports.PI = PI
//module.exports.objetoAleatorio = objetoAleatorio;

// Outra forma de exportar
module.exports = {
    somar : somar,
    PI : PI,
    objetoAleatorio : objetoAleatorio
}