import Shape from "./shape.js"
import Tiro from "./tiro.js"
import Vector from "./vector.js";

export default class Jogador extends Shape {
    constructor(largura, altura, xInicial, yInicial, GAME_WIDTH, GAME_HEIGHT, imagem, cena) {
        super(largura, altura, xInicial, yInicial, GAME_WIDTH, GAME_HEIGHT);
        this._color = "green"
        this._imagem = imagem;
        this._cena = cena;
        this._canFire = true;
        this.aceleracao = new Vector(400, 0);
        this.velocidade.setModulo(0);
        this.direcaoDoMouse = 0;
        this._nome = "Jogador";
    }

    get nome() {
        return this._nome;
    }

    get imagem() {
        return this._imagem;
    }

    get cena(){
        return this._cena;
    }

    set imagem(valor) {
        this._imagem = valor;
    }

    update(deltaTime, input) {
        this.movimentacaoDoJogador(deltaTime, input.getKeysDown());

        this.mirarEmDirecaoAoMouse(input.getPosicaoDoMouse());

        this.delimitarOJogadorNoCanvas();

        if(input.getCliqueDoMouse() && this._canFire){
            this.atirar();
        }
        
        if(!input.getCliqueDoMouse()){
            this._canFire = true;
        }

        this.posicao.adiciona(this.velocidade.produto(deltaTime));
    }

    draw(contexto) {
        // contexto.drawImage(this._imagem, this.posicao.x, this.posicao.y)
        contexto.save();
        contexto.translate(this.posicao.x, this.posicao.y);
        contexto.rotate(this.direcaoDoMouse);
        contexto.drawImage(this._imagem, -this._largura/2, -this._altura/2, this._largura, this._altura)
        contexto.restore();
    }

    movimentacaoDoJogador(deltaTime, keysDown) {
        // console.log(keysDown)
        if (keysDown.indexOf("KeyW") >= 0) { // => -1 se nao existir, ou >= 0 se existir
            this.velocidade.adiciona(this.aceleracao.produto(deltaTime));
        } 
        // else {
        //     this.velocidade.setModulo(0);
        // }
    }

    mirarEmDirecaoAoMouse(posicaoDoMouse) {
        let posDoMouseRelativa = posicaoDoMouse.subtrai(this.cena.canvasPosicao);

        this.direcaoDoMouse = posDoMouseRelativa.subtrai(this.posicao).getAngle();
        this.aceleracao.setAngle(this.direcaoDoMouse);
    }

    delimitarOJogadorNoCanvas() {
        if (this.posicao.x - this.largura*this.origin.x < 0) {
            if(this.direcaoDoMouse < 0 && this.direcaoDoMouse > -90*(Math.PI/180) || this.direcaoDoMouse > 0  && this.direcaoDoMouse < 90*(Math.PI/180)){
                return
            }
            this.velocidade.setModulo(0);
        }

        if (this.posicao.x + this._largura*this.origin.x > this._GAME_WIDTH) {
            if(this.direcaoDoMouse < -90*(Math.PI/180) && this.direcaoDoMouse > -180*(Math.PI/180) || this.direcaoDoMouse > 90*(Math.PI/180) && this.direcaoDoMouse < 180*(Math.PI/180)){
                return
            }
            
            this.velocidade.setModulo(0);
        }

        if (this.posicao.y - this.altura*this.origin.y < 0) {
            if(this.direcaoDoMouse < Math.PI && this.direcaoDoMouse > 0){
                console.log("Pode sair")
                return
            }
            
            this.velocidade.setModulo(0);
        }

        if (this.posicao.y + this._altura*this.origin.y > this._GAME_HEIGHT) {
            console.log(this.direcaoDoMouse)
            if(this.direcaoDoMouse > -Math.PI && this.direcaoDoMouse < 0){
                console.log("Pode sair")
                return
            }
            
            this.velocidade.setModulo(0);
        }
    }

    atirar(){
        this._canFire = false;

        let tempTiro = new Tiro(16, 9, this.posicao.x, this.posicao.y, this.GAME_WIDTH, this.GAME_HEIGHT, this.direcaoDoMouse);
        this._cena.adicionarEntidadeAoJogo(tempTiro);
    }
}