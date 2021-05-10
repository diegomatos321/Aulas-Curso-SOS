import Vector from "./vector.js"

export default class InputHandler{
    constructor(){
        this._keysDown = {
            KeyW: false,
        }

        this._cliqueDoMouse = false;

        this._posicaoDoMouse = new Vector (0, 0);

        document.addEventListener("keydown", (event) => {
            // 2º PRINCIPIO SOLID => PRINCIPIO DE ABERTO/FECHADO
            if(this._keysDown.hasOwnProperty(event.code)){
                this._keysDown[event.code] = true;
            }
        })
        
        document.addEventListener("keyup", (event) => {
            // 2º PRINCIPIO SOLID => PRINCIPIO DE ABERTO/FECHADO
            if(this._keysDown.hasOwnProperty(event.code)){
                this._keysDown[event.code] = false;
            }
        })

        document.addEventListener("mousemove", (event)=>{
            this._posicaoDoMouse.x = event.clientX;
            this._posicaoDoMouse.y = event.clientY;
        })

        document.addEventListener("mousedown", () => {
            this._cliqueDoMouse = true;
        })

        document.addEventListener("mouseup", () => {
            this._cliqueDoMouse = false;
        })
    }

    getKeysDown(){
        let teclasPressionadas = [];

        for (const tecla in this._keysDown) {
            if(this._keysDown[tecla]){
                teclasPressionadas.push(tecla)
            }
        }
        
        return teclasPressionadas;
    }

    getPosicaoDoMouse(){
        return this._posicaoDoMouse;
    }

    getCliqueDoMouse(){
        return this._cliqueDoMouse;
    }
}