import Shape from "./shape.js"
import Galeria from "./galeria.js"

export default class Tiro extends Shape {
  constructor(largura, altura, xInicial, yInicial, GAME_WIDTH, GAME_HEIGHT, direcao) {
    super(largura, altura, xInicial, yInicial, GAME_WIDTH, GAME_HEIGHT);
    this._imagem = Galeria.imagens.tiro_img;
    this.velocidade.setModulo(1200);
    this.velocidade.setAngle(direcao);
    this._nome = "Tiro";

  }

  get nome() {
    return this._nome;
  }

  get imagem() {
    return this._imagem;
  }

  update(deltaTime) {
    this.destruirForaDoCanvas()
    this.posicao.adiciona(this.velocidade.produto(deltaTime));
  }

  draw(contexto) {
    contexto.save();
    contexto.translate(this.posicao.x, this.posicao.y);
    contexto.rotate(this.velocidade.getAngle());
    contexto.drawImage(this._imagem, -this._largura / 2, -this._altura / 2, this._largura, this._altura)
    contexto.restore();
  }

}