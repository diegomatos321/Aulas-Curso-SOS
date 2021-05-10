/*
    Questao 01 - Crie um objeto chamada "Livro" que tenha as propriedades "titulo",
        "autor" e "paginas" e também tenha os métodos "ler" e "comprar".

        O livro recebe as propriedades "titulo", "autor" e "paginas".

        Quando terminar, use o metodo responder(numeroQuestao, Objeto) para verificar a resposta
*/

// Crie o objeto aqui

// Atribua os valores aqui

// Responda aqui

/* 
    Questao 02: Faça uma classe chamada "position" que representa um ponto em um espaço bidimensional.
       O ponto tem as propriedades "x" e "y", que são setadas nos argumentos do construtor.
       
       O ponto também tem um método chamado "mover" que recebe por parâmetro uma velocidade "x" e "y" 
       e soma com o "x" e "y" atuais, depois retorna a nova posição.

       Quando terminar, use o metodo responder(numeroQuestao, Objeto) para verificar a resposta
*/

// Crie a classe aqui

// Responda aqui:
   
/*      Questao 03: Mova a posição com uma velocidade de 2 e 1. Quando terminar, 
        use o metodo responder(numeroQuestao, Objeto) para verificar a resposta
*/

//Responda aqui:

/*
   Questao 04 - Crie a classe "Falador" que receberá os parâmetros "nome" e "verbo" 
        no construtor. "nome" representa o nome da pessoa que fala e "verbo"
        representa qual é a ação da pessoa que fala.

        O falador também tem um método chamado "falar" que recebe por
        parâmetro um texto. Quando esse método é chamado, ele retorna
        a frase: [nome] + [verbo] + [texto].

        Crie também a classe "Gritador", que é uma subclasse de "Falador"
        que, quando executa o método "falar", sempre retorna a frase:
        [nome] + "grita" + [texto] com o "texto" todo em maiúsculo.
*/

// Crie a classe aqui

































function responder(numQuestao,...[conteudo]) {
    let recebido = conteudo instanceof Object ? `${conteudo.constructor.name}${JSON.stringify(conteudo)}` : conteudo;
    console.log(recebido)
    let esperado = '';

    switch (numQuestao) {
        case 1:
            esperado = 'Object{"titulo":"Luas da Ciência","autor":"Ricardo Juarez","paginas":"212"}';
            break;
        case 2:
            esperado = 'position{"x":1,"y":2}';
            break;
        case 3:
            esperado = 'position{"x":3,"y":3}';
            break;
        case 4:
            esperado = "José das Couves grita 'OI, MEU FÍ'";
            break;
    }

    const respostaContainer = document.createElement("div");
    const esperadoEl = document.createElement("p");
    const resposta = document.createElement("p"); 
    const questao = document.createElement("p");

    esperadoEl.textContent = "Esperado: " + esperado;
    esperadoEl.style.marginTop = "30px";
    resposta.textContent = "Recebido: " + recebido;
    questao.textContent = `Questão ${numQuestao}`;
    questao.style.fontWeight = "bold";
    respostaContainer.append(questao);
    respostaContainer.append(esperadoEl);
    respostaContainer.append(resposta);

    
    respostaContainer.style.margin = "10px";
    respostaContainer.style.padding = "1px 15px";
    const container = document.getElementById("respostas");
    container.append(respostaContainer);

    if (esperado === recebido) {
        respostaContainer.style.backgroundColor = "#2feb54";

    } else {
        respostaContainer.style.backgroundColor = "#eb3734";
    }

}
