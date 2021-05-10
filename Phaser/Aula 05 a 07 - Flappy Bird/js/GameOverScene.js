class GameOverScene extends Phaser.Scene{
  constructor(){
    super("GameOverScene")
  }

  init(data){
    let {width, height} = config; // desestruturação de objetos
    this.LarguraDoJogo = width;
    this.AlturaDoJogo = height;

    this.pontuacaoAtual = data.pontos;
    this.melhorPontuacao = pontuacaoMaxima;
  }

  create(){
    this.bg = this.add.image(0, this.AlturaDoJogo, "background_img").setOrigin(0, 1);
    this.chao = this.add.tileSprite(0, 382, 0, 0, "chao_img");
    this.chao.setOrigin(0.1);
    this.chao.setScale(1.2);

    this.gameOverScreen = this.add.image(this.LarguraDoJogo/2, this.AlturaDoJogo/3, "gameOverScreen_img");
    this.enter_btn = this.add.image(this.LarguraDoJogo/2, this.gameOverScreen.y + 100, "enter_img");

    this.moeda = this.add.sprite(96, 189, "coin_sprite");

    if (this.pontuacaoAtual < 20) {
      this.moeda.anims.play("Moeda de Bronze")
    } else if(this.pontuacaoAtual < 40) {
      this.moeda.anims.play("Moeda de Prata")
    } else {
      this.moeda.anims.play("Moeda de Ouro")
    }

    this.pontuacaoAtual_txt = this.add.text(224, 160, this.pontuacaoAtual, {font: "14px Arial"});

    this.melhorPontuacao_txt = this.add.text(224, 200, this.melhorPontuacao, {font: "14px Arial"});

    this.enter_btn.setInteractive().on("pointerdown", () => {
      this.scene.start("GameScene") // Encerra a cena atual e inicializa a proxima
    })
  }
}