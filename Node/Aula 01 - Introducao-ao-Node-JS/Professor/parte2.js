const EventEmitter = require("events")
const eventEmitter = new EventEmitter();

/*
eventEmitter.on("teste", () => {
    console.log("Olá Node da Parte 2 !!!")
})

eventEmitter.emit("teste")
*/

// Passando parametros pelo evento

/*
eventEmitter.on("teste", (a, b) => {
    console.log(a + b)
})

eventEmitter.emit("teste")
*/

// Criando classes através de evento

class Jogador extends EventEmitter{
    constructor({username, pontuacao}){
        super();
        this._username = username;
        this._pontuacao = pontuacao;
    }

    get username(){
        return this._username;
    }

    get props(){
        const username = this.username;
        const pontuacao = this._pontuacao;

        return {
            username : username,
            pontuacao : pontuacao
        };
    }
}

const jogador = new Jogador({username : "Diego", pontuacao:15});

jogador.on("propriedades", ()=>{
    console.log(jogador.props)
})

jogador.emit("propriedades")