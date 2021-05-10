const fs = require("fs")
// Separa os dados do arquivo em pedaços
//const readStream = fs.createReadStream("./lore.txt", "utf8")
//const writeStream = fs.createWriteStream("./exemplo.txt")

// readStream.on("data", (chunk)=>{ // Assim, enquanto o arquivo é lido, eu já posso manipular os chunks/"pedaços"
//     writeStream.write(chunk)
// })

// PIPES
// Permite pegar uma readstream e escrever em outro local (writestream)
// Muito mais simples que o exemplo acima

//readStream.pipe(writeStream);

// Complicando um pouco
// Iremos compactar nosso arquivo

const zlib = require("zlib")
const gzip = zlib.createGzip();
//const writeStream = fs.createWriteStream("./exemplo2.txt.gz")

//readStream.pipe(gzip).pipe(writeStream);

// Agora iremos descompacta-lo

const gunzip = zlib.createGunzip();
const readStream = fs.createReadStream("./exemplo2.txt.gz")
const writeStream = fs.createWriteStream("./descompactado.txt")

readStream.pipe(gunzip).pipe(writeStream)