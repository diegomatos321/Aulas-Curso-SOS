const excecoes = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "!", "@", "#", "$", "%", "¨", "&", "*", "(", ")", "-", "_", "+", "=", "§", "]", "}", "º",
    "´", "`", "[", "{", "ª", "^", "~", `|`, "|", ",", ".", ";", ":", "?", "/", "°"
]

function ContarLetrasEPalavras(frase){
    let letras = 0, palavras;

    palavras = frase.split(" ");

    palavras.forEach(palavra => {
        for (let i = 0; i < palavra.length; i++) {
            if (excecoes.indexOf(palavra[i]) < 0){
                letras++;
            }
        }
    });

    console.log(`O número de palavras é: ${palavras.length}`);
    console.log(`O número de letras é: ${letras}`);
}