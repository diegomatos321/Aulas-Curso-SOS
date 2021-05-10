const fileSystem = require("fs")

// Criar um arquivo

/* fileSystem.writeFile("exemplo.txt", "Isso é um exemplo", (err) => {
    if (err) {
        console.log(err);
        return
    }
    console.log("Arquivo criado com sucesso !!")
})  */


// Primeiramente deixar a codificação em branco

/* fileSystem.readFile("exemplo.txt", "utf8", (err, file)=>{
    if(err){
        console.log(err)
        return;
    }

    console.log(file) // O buffer stream guarda os dados em binário
}) */


// Renomear arquivo
/* fileSystem.rename("exemplo.txt", "parte4.txt", (err)=>{
    if(err){
        console.log(err);
        return;
    }

    console.log("Renomeado com sucesso !!!")
})
 */

// Adicionar linha ao arquivo

// fileSystem.appendFile("parte4.txt", "Linha adicionada", (err) =>{
//     if(err){
//         console.log(err);
//         return;
//     }

//     console.log("Dados adicionados com sucesso !!")
// })

fileSystem.unlink("parte4.txt", (err)=>{
    if(err){
        console.log(err);
        return;
    }

    console.log("Arquivo removido com sucesso !!")
})