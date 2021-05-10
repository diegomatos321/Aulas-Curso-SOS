let pontuacaoMaxima = 0; // Number

const config = {
  width: 320,
  height: 480,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0
      }
    } // ARCADE, MATTER E IMPACT
  },
  scene: [MenuScene, GameScene, GameOverScene],
  backgroundColor: "#5c94fc",
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}

new Phaser.Game(config);