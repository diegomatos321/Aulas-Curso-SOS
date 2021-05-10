let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade:{
            gravity:{y: 250},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload()
{
    this.load.image("bomba", "./assets/bomb.png");
    this.load.image("plataforma", "./assets/platform.png");
    this.load.image("bgSky", "./assets/sky.png");
    this.load.image("star", "./assets/star.png");
    this.load.spritesheet("player", "./assets/dude.png",
    {   
        frameWidth: 32, frameHeight: 48
    });
}

let plataformas, player, cursor, stars, bombas;
let pontuacao = 0;
let txtPontuacao;
const SPEED = 150;
const JUMP_FORCE = 450;

function create()
{
    this.add.image(0, 0, "bgSky").setOrigin(0,0);

    plataformas = this.physics.add.staticGroup();

    plataformas.create(400, 568, 'plataforma').setScale(2).refreshBody();
    plataformas.create(600, 400, 'plataforma');
    plataformas.create(50, 250, 'plataforma');
    plataformas.create(750, 220, 'plataforma');

    player = this.physics.add.sprite(100, 480, "player");

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(300);

    this.anims.create(
    {
        key: "Left",
        frames: this.anims.generateFrameNumbers("player", {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create(
    {
        key: "Idle",
        frames: [ { key: "player", frame: 4}] ,
        frameRate: 10,
        repeat: -1
    });
    this.anims.create(
    {
            key: "Right",
            frames: this.anims.generateFrameNumbers("player", {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
    });

    this.physics.add.collider(player, plataformas);
    cursor = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group(
    {
        key: "star",
        repeat: 11,
        setXY: {x: 0, y: 0, stepX: 70}
    });

    stars.children.iterate((child) =>
    {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    })

    this.physics.add.collider(stars, plataformas);
    this.physics.add.overlap(player, stars, collectStar);

    txtPontuacao = this.add.text(16, 16, "Score: 0", {fontSize: "32px", fill: "#000"});

    bombas = this.physics.add.group();

    this.physics.add.collider(bombas, plataformas);
    this.physics.add.collider(bombas, player, restart);
    this.physics.add.collider(bombas);
}

function update()
{
    movePlayer();
}

function collectStar(player, star)
{
    star.disableBody(true, true);

    addPontos();
    
    let isOver = stars.countActive(true) == 0;
    isOver ? restart() : addBomba();
}
function addPontos()
{
    pontuacao += 10;
    txtPontuacao.setText("Score: " + pontuacao);
}
function restart()
{
    stars.children.iterate((child) =>
    {
        child.enableBody(true, child.x, 0, true, true)
    })
    bombas.clear(true, true);
}
function addBomba()
{
    let newX = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    let bomba = bombas.create(newX, 0, "bomba");
    bomba.setBounce(1);
    bomba.setCollideWorldBounds(true);
}

function movePlayer(){
    if (player.body.touching.down){
        player.anims.play("Idle");
    }
    if (cursor.left.isDown)
    {
        player.setVelocityX(-SPEED);
        if (player.body.touching.down) {
            player.anims.play("Left", true);
        }
    }
    else if (cursor.right.isDown)
    {
        player.setVelocityX(SPEED);
        if (player.body.touching.down) {
            player.anims.play("Right", true);
        }
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play("Idle");
    }

    if(cursor.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-JUMP_FORCE);
    }
}
