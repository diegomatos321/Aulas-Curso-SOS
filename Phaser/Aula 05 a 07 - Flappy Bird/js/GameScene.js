class GameScene extends Phaser.Scene{
  constructor(){
    super("GameScene")
  }

  init(){
    let {width, height} = config;
    this.LarguraDoJogo = width;
    this.AlturaDoJogo = height;
  }

  create(){
    this.limiteDeQueda = this.AlturaDoJogo-98;
    this.physics.world.setBounds(0, 0, 320, this.limiteDeQueda)
    this.GAP = 100;
    this.tempoDeJogo = 0;
    this.velocidadeDosCanos = -120;

    // Efeitos Sonoros
    this.fly_sfx = this.sound.add("fly_sfx");
    this.score_sfx = this.sound.add("score_sfx");

    // Cenário
    this.background = this.add.tileSprite(0, this.AlturaDoJogo, 0, 0,"background_img");
    this.background.setOrigin(0, 1);
    this.background.depth = 1;

    this.chao = this.add.tileSprite(0, 382, 0, 0, "chao_img");
    this.chao.setOrigin(0.1);
    this.chao.depth = 3;
    this.chao.setScale(1.2);

    // Jogador
    this.jogador = this.physics.add.sprite(this.LarguraDoJogo/2, this.AlturaDoJogo/2 + 20, "player_sprite");
    this.jogador.anims.play("Voo");
    this.jogador.setCollideWorldBounds();
    this.jogador.body.setGravity(0, 1200);
    this.vida = 10;
    this.jogador.depth = 5;
    this.jogador.isAlive = true;

    // Canos
    this.canos = this.physics.add.group();
    // this.idUnicoDoLoop = window.setInterval(this.adicionarCanos, 2000);
    this.idTimer = this.time.addEvent({
      delay: 2000,
      callback: this.adicionarCanos,
      callbackScope: this,
      loop: true
    })

    // Interatividade
    this.input.on("pointerdown", this.voar, this);

    // HUD
    this.pontuacao = 0;
    this.pontuacao_txt = this.add.text(20, 20, "0", {fontSize: "30px"});
    this.pontuacao_txt.depth = 6;

    // Colisoes
    this.idColisao = this.physics.add.overlap(this.jogador, this.canos, this.colisaoDoCano, null, this);
  }

  update(time, deltaTime){
    if(this.jogador.isAlive){
      this.background.tilePositionX += 0.5;
      this.chao.tilePositionX += 1;  
    }

    if (this.jogador.angle < 20){
      this.jogador.angle++;
    }

    if (Math.round(this.jogador.y + this.jogador.displayHeight/2) == this.limiteDeQueda && this.jogador.isAlive){
      this.gameOver();
    }

    console.log(this.canos.getLength())
    this.canos.children.each(cano => {
      if(cano.x + cano.displayWidth < 0) {
        this.canos.remove(cano, true, true)
      }

      if(this.jogador.x - this.jogador.displayWidth / 2 > cano.x + cano.displayWidth / 2 + 30 &&
        cano.pontuado == false){
        this.adicionarPontuacao(1);
        cano.pontuado = true;
      }
    })
  }

  voar(){
    // this.sys.cameras.main.shake(100, 0.01);
    if (!this.jogador.isAlive) return
    this.jogador.setVelocity(0, -300);
    this.jogador.angle = -20;
    this.fly_sfx.play();
  }

  adicionarCanos(){
    console.log("Cano Criado")
    let posY = Math.round(Math.random()* -220);
    let canoNorte = this.canos.create(this.LarguraDoJogo, posY, "pipeNorth_img");
    canoNorte.setOrigin(0);
    canoNorte.setVelocity(this.velocidadeDosCanos, 0);
    canoNorte.depth = 4;
    canoNorte.pontuado = false;

    let canoSul = this.canos.create(this.LarguraDoJogo, posY + canoNorte.displayHeight + this.GAP, "pipeSouth_img");
    canoSul.setOrigin(0);
    canoSul.setVelocity(this.velocidadeDosCanos, 0);
    canoSul.depth = 2;
  }

  colisaoDoCano(jogador, cano){
    this.sys.cameras.main.shake(100, 0.01);

    this.gameOver();
  }

  gameOver(){
    this.jogador.isAlive = false;
    this.idTimer.remove();
    this.idColisao.destroy();
    this.jogador.anims.stop();

    this.canos.children.iterate((cano, index) => {
      cano.setVelocityX(0);
    })

    if (this.pontuacao > pontuacaoMaxima) {
      pontuacaoMaxima = this.pontuacao;
      window.localStorage.setItem("phaser-flappybird-highscore", `${this.pontuacao}`)
    }

    this.time.addEvent({
      delay: 1000,
      callback: function (){
        this.scene.start("GameOverScene", {pontos: this.pontuacao}) // Encerra a cena atual e inicializa a proxima
      },
      callbackScope: this
    })
  }

  adicionarPontuacao(pontos){
    this.pontuacao += pontos;
    this.pontuacao_txt.setText(this.pontuacao);
    this.score_sfx.play();
  }
}