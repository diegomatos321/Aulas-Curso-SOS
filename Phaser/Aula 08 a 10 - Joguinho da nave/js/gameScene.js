export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init() {
    let { width, height } = this.sys.game.canvas; // {width , height}
    this.largura = width;
    this.altura = height;
  }

  create() {
    // Fundo
    this.fundo = this.add
      .tileSprite(0, 0, this.largura, this.altura, "Fundo")
      .setOrigin(0, 0);

    // Sons
    this.tiroSFX = this.sound.add("tiroSFX", {volume: 0.3})
    this.explosaoSFX = this.sound.add("explosaoSFX", {volume: 0.3})

    // Jogador
    this.jogador = this.physics.add.sprite(
      this.largura / 2,
      this.altura - 100,
      "Jogador"
    );
    this.jogador.stance = "Parado";
    this.jogador.velocidade = {
      x: 250,
      y: 250,
    };
    this.jogador.setCollideWorldBounds(true);

    // Grupos
    this.tiros = this.physics.add.group(); // create
    this.inimigos = this.physics.add.group();

    // Timer
    this.criarInimigos = this.time.addEvent({
      delay: 2000, // Milisegundos
      callback: this.adicionarInimigos,
      callbackScope: this,
      loop: true,
    });

    // Cursor
    this.cursor = this.input.keyboard.createCursorKeys();
    this.input.on("pointerdown", this.atirar, this);

    // HUD
    this.vidas = 3;
    this.txtVidas = this.add.text(10, 10, `Vidas: ${this.vidas}`);

    this.pontuacao = 0;
    this.txtPontuacao = this.add
      .text(this.largura - 10, 10, `Pontuacao: ${this.pontuacao}`)
      .setOrigin(1, 0);

    this.txtGameOver = this.add.text(
      this.largura / 2,
      this.altura / 2,
      "Game Over"
    );
    this.txtGameOver.setOrigin(0.5);
    this.txtGameOver.setVisible(false);

    this.txtPlayAgain = this.add.text(
      this.largura / 2,
      this.altura / 2 + 24,
      "Pressione ENTER para jogar novamente !",
      { wordWrap: { width: 350 }, align: "center" }
    );
    this.txtPlayAgain.setOrigin(0.5);
    this.txtPlayAgain.setVisible(false);

    // Colisoes
    this.physics.add.overlap(
      this.tiros,
      this.inimigos,
      this.destruirInimigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.jogador,
      this.inimigos,
      this.atingiuJogador,
      null,
      this
    );
  }

  update() {
    this.fundo.tilePositionY -= 1;
    this.movimentacaoDoJogador();
    this.animacaoDoJogador();
    this.destruirObjetosForaDaTela();
  }

  adicionarInimigos() {
    // Inimigo
    let inimigo = this.physics.add.sprite(0, 20, "Inimigo");
    let randomX = Phaser.Math.Between(
      inimigo.displayWidth / 2,
      this.largura - inimigo.displayWidth / 2
    );
    inimigo.x = randomX;
    inimigo.setScale(0.4);
    inimigo.anims.play("Inimigo");
    inimigo.valor = 200;
    this.inimigos.add(inimigo);
    inimigo.setVelocityY(300);
  }

  movimentacaoDoJogador() {
    this.jogador.setVelocity(0);
    if (this.cursor.up.isDown) {
      this.jogador.setVelocityY(-250);
    } else if (this.cursor.down.isDown) {
      this.jogador.setVelocityY(250);
    }

    if (this.cursor.left.isDown) {
      this.jogador.setVelocityX(-250);
      this.jogador.body.setSize();
      this.jogador.stance = "Esquerda";
    } else if (this.cursor.right.isDown) {
      this.jogador.setVelocityX(250);
      this.jogador.body.setSize(26, 43);
      this.jogador.stance = "Direita";
    } else {
      this.jogador.body.setSize();
      this.jogador.stance = "Parado";
    }
  }

  animacaoDoJogador() {
    this.jogador.anims.play(this.jogador.stance, true);
  }

  atirar() {
    if (!this.jogador.active) {
      return;
    }
    let tiro = this.tiros.create(this.jogador.x, this.jogador.y, "Tiro");
    tiro.setScale(0.8);
    tiro.setVelocityY(-1200);
    this.tiroSFX.play();
  }

  destruirInimigo(tiro, inimigo) {
    if (tiro) this.tiros.remove(tiro, true, true);
    this.inimigos.remove(inimigo, true, true);

    this.criarExplosao(inimigo);
    this.adicionarPontuacao(inimigo.valor);
  }

  atingiuJogador(jogador, inimigo) {
    this.destruirInimigo(null, inimigo);

    if (jogador.alpha === 0.5) return

    jogador.disableBody(true, true);

    if (this.vidas > 0) {
      this.removerVidas(1);
      this.time.addEvent({
        delay: 1000,
        callback: this.reposicionarJogador,
        callbackScope: this,
        loop: false,
      });
    } else {
      this.gameOver();
    }
  }

  criarExplosao({ x, y }) {
    let explosao = this.add.sprite(x, y, "Explosion");
    explosao.setScale(2);
    explosao.anims.play("Explosao");
    this.explosaoSFX.play();
  }

  adicionarPontuacao(valor) {
    this.pontuacao += valor;
    this.txtPontuacao.setText(`Pontuacao: ${this.pontuacao}`);
  }

  definirVidas(valor){
    this.vidas = valor;
    this.txtVidas.setText(`Vidas: ${this.vidas}`);
  }

  removerVidas(valor) {
    this.vidas -= valor;
    this.txtVidas.setText(`Vidas: ${this.vidas}`);
  }

  reposicionarJogador() {
    this.jogador.enableBody(
      true,
      this.largura / 2,
      this.altura + this.jogador.displayHeight,
      true,
      true
    );

    this.jogador.alpha = 0.5;

    this.tweens.add({
      targets: this.jogador,
      y: this.altura / 2,
      duration: 1000,
      onComplete: () => {
        this.jogador.alpha = 1;
      },
      callbackScope: this,
      repeat: 0,
    });
  }

  gameOver(){
    this.txtGameOver.setVisible(true);
    this.txtPlayAgain.setVisible(true);

    let enterKey = this.input.keyboard.addKey("ENTER");
    enterKey.once("down", this.reiniciarJogo, this);
  }

  reiniciarJogo() {
    this.txtGameOver.setVisible(false);
    this.txtPlayAgain.setVisible(false);

    this.definirVidas(3);

    this.reposicionarJogador();
  }

  destruirObjetosForaDaTela(){
    this.tiros.children.each((tiro) => {
      if (tiro.y + tiro.displayHeight/2 < 0){
        this.tiros.remove(tiro, true, true)
      }
    })

    this.inimigos.children.each((inimigo) => {
      if (inimigo.y - inimigo.displayHeight/2 > this.altura){
        this.inimigos.remove(inimigo, true, true)
      }
    })
  }
}
