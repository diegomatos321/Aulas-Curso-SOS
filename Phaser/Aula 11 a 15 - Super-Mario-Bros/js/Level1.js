import Jogador from "./GameObjects/Jogador.js";
import Inimigo from "./GameObjects/Inimigo.js";

export default class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
  }

  init({ jogadorEscolhido }) {
    const { width, height } = this.sys.game.canvas;
    this.GAME_WIDTH = width;
    this.GAME_HEIGHT = height;
    this.jogadorEscolhido = jogadorEscolhido;

    this.anims.resumeAll();
  }

  create() {
    // Redefinindo as bordas do mundo
    this.physics.world.setBounds(0, 0, 3584, 272);

    // Tilemap
    this.map = this.add.tilemap("level1");
    this.tileset = this.map.addTilesetImage("mariotileset", "tileset");

    this.fundo = this.map.createDynamicLayer("fundo", this.tileset);
    this.world = this.map.createDynamicLayer("world", this.tileset);
    this.world.setCollisionByProperty({ collide: true });

    // Musicas e Sons
    this.powerUpSFX = this.sound.add("powerUpSFX", {
      volume: 0.3,
    });

    this.bumpSFX = this.sound.add("bumpSFX", {
      volume: 0.3,
    });

    this.jumpSmallSFX = this.sound.add("jumpSmallSFX", {
      volume: 0.3,
    });

    this.jumpSuperSFX = this.sound.add("jumpSuperSFX", {
      volume: 0.3,
    });

    this.powerupAppearsSFX = this.sound.add("powerupAppearsSFX", {
      volume: 0.3,
    });

    this.coinSFX = this.sound.add("coinSFX", {
      volume: 0.3,
    });

    this.gameOverSFX = this.sound.add("gameOverSFX", {
      volume: 0.3,
    });

    this.backgroundMusic = this.sound.add("backgroundMusic", {
      volume: 0.1,
      loop: true,
    });

    this.breakBlockSFX = this.sound.add("breakBlockSFX", {
      volume: 0.5,
    });

    this.backgroundMusic.play();

    // Jogador
    this.jogador = new Jogador(
      150,
      this.GAME_HEIGHT - 40,
      this,
      this.jogadorEscolhido,
      "Grande",
      "Idle"
    );

    this.inimigos = this.add.group();
    this.world.forEachTile(criarInimigo.bind(this));

    function criarInimigo(tile) {
      if (tile.index === 64) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();

        let littleGomba = new Inimigo(this, x, y, "LittleGomba");
        littleGomba.nome = "LittleGomba";
        littleGomba.anims.play("Little Gomba Walking");
        littleGomba.valor = 200;
        this.inimigos.add(littleGomba);

        this.world.removeTileAt(tile.x, tile.y);
      }

      if (tile.index === 65) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();

        let koopaTroopa = new Inimigo(this, x, y - 4, "KoopaTroopa");
        koopaTroopa.anims.play("Koopa Troopa Walking");
        koopaTroopa.nome = "KoopaTroopa";
        koopaTroopa.valor = 200;
        koopaTroopa.foiAtingido = false;
        this.inimigos.add(koopaTroopa);

        this.world.removeTileAt(tile.x, tile.y);
      }
    }

    this.blocosInterativos = this.add.group();
    this.tijolos = this.add.group();

    this.world.forEachTile(criarBlocos.bind(this));

    function criarBlocos(tile) {
      if (tile.index === 2) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();

        let tijolo = this.physics.add.sprite(x, y, "brick");
        tijolo.setImmovable();

        this.tijolos.add(tijolo);

        this.world.removeTileAt(tile.x, tile.y);
      }

      if (tile.index === 25) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();

        let blocoInterativo = this.physics.add.sprite(x, y, "surpriseBlock");
        blocoInterativo.anims.play("Surprise Block Ativo");
        blocoInterativo.canDrop = true;
        blocoInterativo.setImmovable();

        this.blocosInterativos.add(blocoInterativo);

        this.world.removeTileAt(tile.x, tile.y);
      }
    }

    // Cursor
    this.cursor = this.input.keyboard.createCursorKeys();

    // Items Coletáveis
    this.itensColetaveis = this.add.group();

    // HUD
    this.pontuacao = 0;
    this.moedasColetadas = 0;

    this.txtPontuacao = this.add
      .text(0, 0, `Pontuação: ${this.pontuacao}`, { fontSize: "12px" })
      .setScrollFactor(0);
    this.txtMoedasColetadas = this.add
      .text(0, 16, `Moedas Coletadas: ${this.moedasColetadas}`, {
        fontSize: "12px",
      })
      .setScrollFactor(0);

    // Camera
    this.cameras.main.startFollow(this.jogador, true);
    this.cameras.main.setBounds(0, 0, 3584, 240);

    // Físicas
    this.physics.add.collider(this.jogador, this.world);
    this.physics.add.collider(
      this.jogador,
      this.tijolos,
      this.colisaoComOsTijolos,
      null,
      this
    );
    this.physics.add.collider(
      this.jogador,
      this.blocosInterativos,
      this.colisaoComOsBlocosInterativos,
      null,
      this
    );
    this.physics.add.overlap(
      this.jogador,
      this.itensColetaveis,
      this.coletarItem,
      null,
      this
    );
    this.physics.add.collider(
      this.jogador,
      this.inimigos,
      this.colisaoComOInimigo,
      null,
      this
    );

    this.physics.add.collider(this.inimigos, this.world);
    this.physics.add.collider(this.inimigos, this.tijolos);
    this.physics.add.collider(this.inimigos, this.blocosInterativos);

    this.physics.add.collider(this.itensColetaveis, this.world);
    this.physics.add.collider(this.itensColetaveis, this.tijolos);
    this.physics.add.collider(this.itensColetaveis, this.blocosInterativos);
  }

  update() {
    this.jogador.update(this.cursor);

    // Ou iterate
    this.inimigos.children.each((inimigo) => {
      inimigo.update();
    });
  }

  colisaoComOsTijolos(jogador, tijolo) {
    if (
      jogador.y - jogador.displayHeight / 2 >=
      tijolo.y + tijolo.displayHeight / 2
    ) {
      if (jogador.state.tamanho === "Grande") {
        this.breakBlockSFX.play()
        const particles = this.add.particles("brickParticle");
        particles.createEmitter({
          speed: { min: 50, max: 130 },
          gravityY: 300,
          quantity: 20,
          maxParticles: 20,
          rotate: { start: 0, end: 360 },
          lifespan: 1000,
          x: tijolo.x,
          y: tijolo.y,
        });

        tijolo.destroy();
      } else {
        const config = { objeto: tijolo, distancia: tijolo.displayHeight / 2 };
        this.animarObjeto(config, null);
      }
    }
  }

  colisaoComOsBlocosInterativos(jogador, bloco) {
    if (
      jogador.y - jogador.displayHeight / 2 >=
        bloco.y + bloco.displayHeight / 2 &&
      bloco.canDrop
    ) {
      const config = { objeto: bloco, distancia: bloco.displayHeight / 2 };
      this.animarObjeto(config, function animBlocoDesativado() {
        bloco.anims.play("Surprise Block Inativo");
      });

      let sorteio = Math.round(Math.random() * 100);

      if (sorteio < 1) {
        this.coinSFX.play()
        let moeda = this.add.sprite(
          bloco.x,
          bloco.y - bloco.displayHeight,
          "coin"
        );
        moeda.valor = 200;

        this.animarObjeto(moeda, moeda.displayHeight, () => {
          // console.log("Ganhou moedas")
          this.addPontuacao(moeda.valor);
          this.moedasColetadas += 1;
          this.txtMoedasColetadas.setText(
            `Moedas Coletadas: ${this.moedasColetadas}`
          );
        });
      } else {
        this.powerupAppearsSFX.play()
        let cogumelo = this.physics.add.sprite(
          bloco.x,
          bloco.y - bloco.displayHeight,
          "magicMushroom"
        );
        cogumelo.setGravityY(1200);
        cogumelo.nome = "cogumelo";

        const config = { objeto: cogumelo, distancia: cogumelo.displayHeight };
        this.animarObjeto(config, null);

        this.itensColetaveis.add(cogumelo);
      }
    }

    bloco.canDrop = false;
  }

  animarObjeto(config, onCompleteFn) {
    const {
      objeto,
      distancia = 0,
      ease = "Cubic",
      duration = 150,
      yoyo = true,
    } = config;
    this.tweens.add({
      targets: objeto,
      y: objeto.y - distancia,
      ease: ease,
      duration: 150, // ms
      onComplete: onCompleteFn,
      callbackScope: this,
      yoyo: yoyo,
    });
  }

  addPontuacao(pontos) {
    this.pontuacao += pontos;
    this.txtPontuacao.setText(`Pontuação: ${this.pontuacao}`);
  }

  coletarItem(jogador, item) {
    if (item.nome === "cogumelo") {
      if (this.jogador.state.tamanho === "Pequeno") {
        this.jogador.setVelocityY(-160);
      }
      this.powerUpSFX.play()
      this.jogador.state.tamanho = "Grande";
      this.itensColetaveis.remove(item, true, true);
    }
  }

  colisaoComOInimigo(jogador, inimigo) {
    if (
      jogador.y + jogador.displayHeight / 2 <=
        inimigo.y - inimigo.displayHeight / 2
    ) {
      jogador.setVelocityY(-300);
      jogador.hasJumped = true;
      jogador.state.stance = "Jump";

      if (inimigo.nome === "LittleGomba") {
        this.ganharPontosAoMatarOInimigo(jogador, inimigo);
        inimigo.anims.play("Little Gomba Dead");
        inimigo.canWalk = false;
        inimigo.disableBody(true);
        this.bumpSFX.play();

        this.time.addEvent({
          delay: 2000,
          callback: function removerInimigo() {
            this.inimigos.remove(inimigo, true, true);
          },
          callbackScope: this,
        });
      } else if (inimigo.nome === "KoopaTroopa") {
        if (!inimigo.foiAtingido) {
          this.ganharPontosAoMatarOInimigo(jogador, inimigo);
          inimigo.foiAtingido = true;
          inimigo.anims.play("Koopa Troopa Defend");
          inimigo.canWalk = false;
        } else if (inimigo.foiAtingido) {
          /*           if (!inimigo.canWalk) {
            inimigo.canWalk = true;
          } else {
            inimigo.canWalk = false;
          } */
          let direcao = 0;
          if (Math.random() < 0.5) {
            direcao = -1;
          } else {
            direcao = 1;
          }
          inimigo.direcao = direcao;
          inimigo.velocidade.x = 100;
          inimigo.canWalk = !inimigo.canWalk;
        }
      }

      // this.inimigos.remove(inimigo, true, true);
    } else if (
      inimigo.nome === "KoopaTroopa" &&
      inimigo.foiAtingido &&
      !inimigo.canWalk
    ) {
      if (jogador.x > inimigo.x) {
        inimigo.direcao = -1;
        inimigo.velocidade.x = 400;
        inimigo.canWalk = true;
      } else if (jogador.x < inimigo.x) {
        inimigo.direcao = 1;
        inimigo.velocidade.x = 400;
        inimigo.canWalk = true;
      }
    } else if (jogador.state.tamanho === "Grande") {
      if (inimigo.x > jogador.x) {
        jogador.setVelocity(-400, -100)
      } else {
        jogador.setVelocity(400, -100)
      }

      jogador.state.tamanho = "Pequeno";
      inimigo.setVelocityX(0);
      if (inimigo.nome === "KoopaTroopa" && inimigo.foiAtingido) {
        inimigo.canWalk = false;
      }
    } else {
      const data = {
        level: "Level1",
        texto: "World 1-1",
      };
/*       this.gameOverSFX.play();
      this.gameOverSFX.on("complete", () => {
        this.scene.start("GameOverScene", data);
      }) */
      this.gameOver();
      // this.scene.start("GameOverScene", data);
    }
  }

  ganharPontosAoMatarOInimigo(jogador, inimigo) {
    this.addPontuacao(inimigo.valor);
    const textoAnim = this.add.text(
      jogador.x,
      jogador.y - jogador.body.height,
      inimigo.valor,
      { fontSize: "8px" }
    );
    textoAnim.setOrigin(0.5, 0.5);
    const config = {
      objeto: textoAnim,
      distancia: 40,
      duration: 400,
      ease: "Circ",
      yoyo: false,
    };
    this.animarObjeto(config, function destruirTexto() {
      textoAnim.destroy();
    });
  }

  gameOver(){
    this.sound.pauseAll();
    this.anims.pauseAll();
    this.gameOverSFX.play();
    this.jogador.setActive(false);
    this.cameras.main.stopFollow();

    this.jogador.setVelocity(0);
    this.jogador.setAcceleration(0);

    this.inimigos.children.iterate((inimigo, index) => {
      inimigo.setVelocity(0, 0);
      inimigo.disableBody(true);
    });
  
    this.itensColetaveis.children.iterate((item, index) => {
      item.setVelocity(0, 0);
      item.disableBody(true);
    });

    this.physics.world.colliders.destroy()

    this.jogador.state.stance = "Dead";

    this.tweens.add({
      targets: this.jogador,
      y: this.jogador.y - this.jogador.body.halfHeight * 5,
      ease: "Circ",
      duration: 700,
    });

    let data = {
      level: "Level1",
      texto: "World 1-1",
    };

    this.gameOverSFX.once("complete", (music) => {
      this.scene.start("GameOverScene", data);
    });
  }
}
