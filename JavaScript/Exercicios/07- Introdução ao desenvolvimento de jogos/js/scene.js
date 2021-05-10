// 1º PRINCIPIO SOLID => PRINCIPIO DE ÚNICA RESPONSABILIDADE

// 3º PRINCIPIO SOLID => PRINCIPIO DA SUBSTITUIÇÃO DE LISKOV
import Jogador from "./jogador.js"
import Asteroide from "./asteroide.js"
import InputHandler from "./inputHandler.js"
import CollisionHandler from "./collisionHandler.js"
import Galeria from "./galeria.js"

export default class Cena {
    constructor(config) {
        // this.canvas = document.getElementById("GameScreen");
        let containerPai = document.getElementById(config.containerPai) || document.getElementsByClassName(config.containerPai)[0];

        this.canvas = document.createElement("canvas");
        this.canvas.id="GameScreen";
        this.canvas.width = config.largura;
        this.canvas.height = config.altura;
        containerPai.appendChild(this.canvas);

        this.canvasPosicao = this.canvas.getBoundingClientRect();

        this.contexto = this.canvas.getContext("2d");

        // this.GAME_WIDTH = this.canvas.width = 400, this.GAME_HEIGHT = this.canvas.height = 400;
        this.GAME_WIDTH = config.largura;
        this.GAME_HEIGHT = config.altura;
        this.listaDeEntidades = [];
        this.tempoAnterior = 0;
        this.deltaTime = 0;
        this.intervaloDeCriacao = 1000; // Em milisegundos
    }

    init() {
        Galeria.CarregarImagem("jogador_img", "../Introducao-ao-Desenvolvimento-de-Jogos/assets/imagens/player.png", this.startGame, this);
        Galeria.CarregarImagem("asteroide_img", "../Introducao-ao-Desenvolvimento-de-Jogos/assets/imagens/asteroide.png", this.startGame, this);
        Galeria.CarregarImagem("tiro_img", "../Introducao-ao-Desenvolvimento-de-Jogos/assets/imagens/tiro.png", this.startGame, this);
        Galeria.CarregarAudio("shoot_sound", "../Introducao-ao-Desenvolvimento-de-Jogos/assets/audios/shoot_sound.mp3", this.startGame, this);
    }

    startGame() {
        // 3º PRINCIPIO SOLID => PRINCIPIO DA SUBSTITUIÇÃO DE LISKOV
        this.jogador = new Jogador(50, 50, this.GAME_WIDTH/2, this.GAME_HEIGHT/2, this.GAME_WIDTH, this.GAME_HEIGHT, Galeria.imagens.jogador_img, this);

        window.setInterval(this.criarAsteroides, this.intervaloDeCriacao);

        this.adicionarEntidadeAoJogo(this.jogador);

        this.input = new InputHandler();
        window.requestAnimationFrame(this.gameLoop);
    }

    gameLoop = (tempoAtual) => {
        window.requestAnimationFrame(this.gameLoop);

        tempoAtual /= 1000;
        this.deltaTime = tempoAtual - this.tempoAnterior;
        this.tempoAnterior = tempoAtual;

        // console.log(this.listaDeEntidades)
        this.update();
        this.draw();
    }

    update() {
        this.listaDeEntidades = this.listaDeEntidades.filter(entidade => {
            return entidade.active
        })

        // Realiza a lógica de todas as entidades do jogo
        this.listaDeEntidades.forEach((entidade1, index1) => {
            entidade1.update(this.deltaTime, this.input);
            this.listaDeEntidades.forEach((entidade2, index2) => {
                if (index1 <= index2) return;
                // Realiza as Colisões
                CollisionHandler(entidade1, entidade2, function () {
                    if(entidade1.nome === "Tiro") {
                        if (entidade2.nome === "Jogador") return
                        entidade1.active = false
                        entidade2.active = false
                        return
                    }
                    if(entidade2.nome === "Tiro") {
                        if (entidade1.nome === "Jogador") return
                        entidade1.active = false
                        entidade2.active = false
                        return
                    }
                    //Separacao
                    this.separacao(entidade1, entidade2);
                }, this);
            });
        });
    }

    draw() {
        this.contexto.clearRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT)
        // Desenha na tela as intidades do jogo
        this.listaDeEntidades.forEach(entidade => {
            entidade.draw(this.contexto);
        });
    }

    adicionarEntidadeAoJogo(entidade) {
        this.listaDeEntidades.push(entidade)
    }

    criarAsteroides = () => {
        let randomX, randomY;
        const direcaoDoSpawn = Math.floor((Math.random() * 4))

        if (direcaoDoSpawn == 0) {
            randomY = 0;
            randomX = Math.random() * this.GAME_WIDTH;
        }
        if (direcaoDoSpawn == 1) {
            randomY = Math.random() * this.GAME_HEIGHT;
            randomX = this.GAME_WIDTH;
        }
        if (direcaoDoSpawn == 2) {
            randomY = this.GAME_HEIGHT;
            randomX = Math.random() * this.GAME_WIDTH;
        }
        if (direcaoDoSpawn == 3) {
            randomY = Math.random() * this.GAME_WIDTH;
            randomX = 0;
        }

        let tempAsteroide = new Asteroide(64, 64, randomX, randomY, this.GAME_WIDTH, this.GAME_HEIGHT);

        const direcaoDoJogadorEmRelacaoAoAsteroid = this.jogador.posicao.subtrai(tempAsteroide.posicao).getAngle();
        tempAsteroide.velocidade.setAngle(direcaoDoJogadorEmRelacaoAoAsteroid);

        this.adicionarEntidadeAoJogo(tempAsteroide)
    }

    separacao(entidade1, entidade2){
        const velocidade1Temp = entidade1.velocidade;
        const velocidade2Temp = entidade2.velocidade;

        entidade1.velocidade = velocidade2Temp;
        entidade2.velocidade = velocidade1Temp;
    }
}
