const readline = require("readline"); // Interface

// stdin => standard input, onde dados sao enviados e lidos pelo programa
// stdout => standard outputm descriptor padrao onde o programa pode mostrar algo ao usuario.
const rl = readline.createInterface({input: process.stdin,
                          output: process.stdout
})

let date = new Date()
let idade = Math.round(Math.random() * 100);
let anoAtual = date.getFullYear();
let anoNascimento = anoAtual - idade;


rl.question(`Uma pessoa de ${idade} anos que vive no ano de ${anoAtual} nasceu em que ano ? \n`, (userInput)=>{
    if(userInput.trim() == anoNascimento){
        rl.close()
    }
    else{
        rl.setPrompt("Resposta incorreta ! Tente novamente \n")
        rl.prompt();
        rl.on("line", (userInput)=>{
            if(userInput.trim() == anoNascimento){
                rl.close()
            }
            else{
                rl.setPrompt("Resposta incorreta ! Tente novamente \n")
                rl.prompt();
            }        
        })
    }
})


/*
rl.setPrompt(`Uma pessoa de ${idade} anos que vive no ano de ${anoAtual} nasceu em que ano ? \n`)
rl.prompt();
rl.on("line", (userInput)=>{
    if(userInput.trim() == anoNascimento){
        rl.close()
    }
    else{
        rl.setPrompt("Resposta incorreta ! Tente novamente \n")
        rl.prompt();
    }        
})

rl.on("close", ()=>{
    console.log("Resposta CORRETA ! PARABENS !!! \n")
})
*/