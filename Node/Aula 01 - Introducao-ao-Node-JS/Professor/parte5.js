const fs = require("fs");
// CRIANDO PASTA

// mkdir => make directory
// fs.mkdir("aula", (err)=>{
//     if(err){
//         console.log(err);
//         return;
//     }

//     console.log("Pasta criada com sucesso !!")
// })

// REMOVENDO PASTA

// fs.rmdir("aula", (err)=>{
//     if(err){
//         console.log(err);
//         return;
//     }

//     console.log("Pasta removida com sucesso !!")
// })

// CRIANDO ARQUIVO DENTRO DA PASTA

// fs.writeFile("./aula/Praticando-Com-Node.txt", "Essa aula é incrivel !!", (err)=>{
//     if(err){
//         console.log(err)
//         return;
//     }

//     console.log("Arquivo criado com sucesso !!!")
// })

// DELETANDO A PASTA QUE POSSUI ARQUIVOS DENTRO

// fs.unlink("./aula/Praticando-Com-Node.txt", (err)=>{
//     if(err){
//         console.log(err)
//         return;
//     }

//     console.log("Arquivos deletados com sucesso !!!")
//     fs.rmdir("aula", (err)=>{
//         if(err){
//             console.log(err)
//             return
//         }

//         console.log("Pasta deletada com sucesso !!!")
//     })
// })

// NESSA PARTE DEVO CRIAR UMA PASTA, COM ARQUIVOS DENTRO, E DEPOIS DELETA-LOS

// readdir retorna uma lista de arquivos que uma pasta possui

// fs.readdir("exemplo", (err, files) => {
//     if (err) {
//         console.log(err);
//         return
//     }

//     console.log(files)
//     files.forEach(file => {
//         fs.unlink(`./exemplo/${file}`, (err) => {
//             if (err) {
//                 console.log(err)
//                 return;
//             }

//             console.log(`Arquivo ${file} deletado com sucesso !!!`)
//         })
//     });

//     fs.rmdir("exemplo", (err) => {
//         if (err) {
//             console.log(err)
//             return
//         }

//         console.log("Pasta deletada com sucesso !!!")
//     })
// })