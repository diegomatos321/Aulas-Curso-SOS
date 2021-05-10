class MenuScene extends Phaser.Scene{
  constructor(){
    super("MenuScene")
  }

  preload(){
    this.load.spritesheet("player_sprite", "assets/imagens/BirdSprite.png", {
      frameWidth: 34,
      frameHeight: 22.3
    })
    this.load.spritesheet("coin_sprite", "assets/imagens/CoinSprite.png", {
      frameWidth: 46,
      frameHeight: 45
    })

    this.load.image("background_img", "assets/imagens/Background.png");
    this.load.image("chao_img", "assets/imagens/Floor.png");
    this.load.image("startMenu_img", "assets/imagens/StartMenu.png");
    this.load.image("gameOverScreen_img", "assets/imagens/GameOverScreen.png");
    this.load.image("enter_img", "assets/imagens/Enter_btn.png");
    this.load.image("pipeNorth_img", "assets/imagens/PipeNorth.png");
    this.load.image("pipeSouth_img", "assets/imagens/PipeSouth.png");

    this.load.audio("fly_sfx", "/assets/audio/fly.mp3")
    this.load.audio("score_sfx", "/assets/audio/score.mp3")

    let tempPontuacaoMaxima = window.localStorage.getItem("phaser-flappybird-highscore");

    if(tempPontuacaoMaxima){
      pontuacaoMaxima = tempPontuacaoMaxima;
    } else{
      window.localStorage.setItem("phaser-flappybird-highscore", "0");
    }
  }

  create(){
    this.anims.create({
      key: "Moeda de Bronze",
      frames: [{key:"coin_sprite", frame: 3}]
    })
    this.anims.create({
      key: "Moeda de Prata",
      frames: [{key:"coin_sprite", frame: 0}]
    })
    this.anims.create({
      key: "Moeda de Ouro",
      frames: [{key:"coin_sprite", frame: 2}]
    })

    this.anims.create({
      key: "Voo",
      frames: this.anims.generateFrameNumbers("player_sprite", {
        start: 0,
        end: 2
      }),
      duration: 300,
      yoyo: true,
      repeat: -1
    })

    let {width:LarguraDoJogo, height:AlturaDoJogo} = config;

    this.fundo = this.add.image(0, AlturaDoJogo, "background_img");
    this.fundo.setOrigin(0, 1);

    this.chao = this.add.tileSprite(0, 382, 0, 0, "chao_img");
    this.chao.setOrigin(0.1);
    this.chao.setScale(1.2);

    this.startMenuIMG = this.add.image(LarguraDoJogo/2, AlturaDoJogo/3, "startMenu_img");

    this.passaro = this.add.sprite(LarguraDoJogo/2, AlturaDoJogo/2 + 20, "player_sprite");
    this.passaro.anims.play("Voo");

    this.creditos = this.add.text(LarguraDoJogo/2, AlturaDoJogo - 16, "Recriado Por: Diego Matos", {fontSize: "16px", color: "black"});
    this.creditos.setOrigin(0.5);

    this.input.on("pointerdown", () => {
      this.scene.start("GameScene") // Encerra a cena atual e inicializa a proxima
    });
  }
}