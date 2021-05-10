import Shape from "./shape.js"
import Galeria from "./galeria.js"

export default class Asteroide extends Shape {
    constructor(largura, altura, xInicial, yInicial, GAME_WIDTH, GAME_HEIGHT) {
        super(largura, altura, xInicial, yInicial, GAME_WIDTH, GAME_HEIGHT);
        this._imagem = Galeria.imagens.asteroide_img;
        this._nome = "Asteroide";
        this.velocidade.setModulo(300)
    }

    get nome() {
        return this._nome
    }

    update(deltaTime) {
        this.destruirForaDoCanvas();
        this.posicao.adiciona(this.velocidade.produto(deltaTime))
    }

    draw(contexto) {
        contexto.drawImage(this._imagem, this.posicao.x - this.largura * this.origin.x, this.posicao.y - this.altura * this.origin.y, this._largura, this._altura);
    }
}