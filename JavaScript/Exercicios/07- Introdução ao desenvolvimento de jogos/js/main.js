import Cena from "./scene.js"

const config = {
  largura: 600,
  altura: 600,
  containerPai: "container-game"
}

let Jogo = new Cena(config);
Jogo.init();