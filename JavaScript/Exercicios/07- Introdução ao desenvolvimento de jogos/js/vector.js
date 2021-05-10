export default class Vector {
    constructor(x, y) {
        this.classe = "Vector"
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(value) {
        this._x = value;
    }

    set y(value) {
        this._y = value;
    }

    // RESGATAR O ANGULO DO VETOR
    getAngle() {
        let angle = Math.atan2(this._y, this._x)
        return angle;
    }

    // DEFINE O ANGULO DO VETOR
    setAngle(angle) {
        let modulo = this.getModulo();
        this._x = Math.cos(angle) * modulo;
        this._y = Math.sin(angle) * modulo;
    }

    // RESGATAR O MODULO DO VETOR
    getModulo() {
        let modulo = Math.sqrt(this._x * this._x + this._y * this._y)
        return modulo;
    }

    // DEFINIR O MODULO DO VETOR
    setModulo(value) {
        let angle = this.getAngle();
        this._x = Math.cos(angle) * value;
        this._y = Math.sin(angle) * value;
    }

    soma(value) {
        // Caso for um vetor
        let novoX = this._x + value.x;
        let novoY = this._y + value.y;
        let soma = new Vector(novoX, novoY);
        return soma;
    }

    adiciona(value) {
        this._x += value.x;
        this._y += value.y;
    }

    
    subtrai(value) {
        // Caso for um vetor
        let novoX = this._x - value.x;
        let novoY = this._y - value.y;
        let subtracao = new Vector(novoX, novoY);
        return subtracao;
    }

    retirar(value) {
        this._x -= value.x;
        this._y -= value.y;
    }

    multiplica(value) {
        this._x *= value;
        this._y *= value;
    }

    produto(value) {
        // Caso for um escalar
        let novoX = this._x * value;
        let novoY = this._y * value;
        let produto = new Vector(novoX, novoY);
        return produto;
    }
}