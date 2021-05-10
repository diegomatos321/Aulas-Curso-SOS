
/*
*   If you want the main loop to just run and you do not need easy (direct) access to it, you could create 
*   it as an Immediately-Invoked Function Expression (IIFE).
*   When the browser comes across this IIFE, it will define your main loop and immediately queue it for the 
*   next frame.
*   Fonte: https://developer.mozilla.org/en-US/docs/Games/Anatomy
*/
; (function () {
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    // Canvas e Layers
    let canvas = [
        window.document.getElementById("background-layer"),
        window.document.getElementById("pipeSouth-layer"),
        window.document.getElementById("ground-layer"),
        window.document.getElementById("game-layer"),
        window.document.getElementById("hud-layer")
    ]
    // ATENÇÃO: POSIÇÃO DOS ELEMENTOS NA ARRAY ESTAO EM ORDEM DE PROFUNDIDADE
    // DEFINIDO VIA CSS
    let ctx = [
        canvas[0].getContext("2d"), // Z=0
        canvas[1].getContext("2d"), // Z=1
        canvas[2].getContext("2d"), // Z=2
        canvas[3].getContext("2d"), // Z=3
        canvas[4].getContext("2d")  // Z=4
    ]

    let GameScreen = window.document.getElementById("GameScreen");
    // Variaveis responsáveis pela responsividade

    let GAME_WIDTH = 320;
    let GAME_HEIGHT = 480;

    let ratio = 0, currentWidth = 0, currentHeight = 0;
    let android = false, ios = false;

    // Variaveis GLOBAIS

    const GRAVIDADE = new Vector(0, 1400);
    let player = undefined, fundo = undefined;
    let entityList = new Array();
    let score = 0, highScore = 0;
    let spawnTime = 1600; //ms
    let totalDeArquivos = 0, arquivosCarregados = 0;
    let tempoInicial = 0;
    let divLoading = document.getElementById("loading-txt");

    // Galeria de imagens e audios

    let Galeria =
    {
        // As imagens ficarão guardadas aqui
        imagens: {},
        audio: {},

        // Função responsável por carregar a imagem
        CarregarImagem: function (nome, source, callback) {
            console.log(`Carregando: ${nome} (${arquivosCarregados}/${totalDeArquivos}) `)

            divLoading.textContent = `Carregando: ${nome} (${arquivosCarregados}/${totalDeArquivos}) `;

            // Cria um objeto "Image" dentro de "imagens"
            Galeria.imagens[nome] = new Image();

            // Ao ser carregado, chama uma função anônima
            Galeria.imagens[nome].addEventListener("load", function () {
                arquivosCarregados++;
                console.log(`CARREGADO: ${nome} (${arquivosCarregados}/${totalDeArquivos}) `);

                divLoading.textContent = `CARREGADO: ${nome} (${arquivosCarregados}/${totalDeArquivos}) `;

                if (arquivosCarregados == totalDeArquivos) callback();
            })

            // Atribui a source da imagem para o objeto
            Galeria.imagens[nome].src = source;
        },

        CarregarAudio: function (nome, source) {
            arquivosCarregados++;
            Galeria.audio[nome] = new Audio();
            Galeria.audio[nome].src = source;

            console.log(`CARREGADO: ${nome} (${arquivosCarregados}/${totalDeArquivos}) `)
            divLoading.textContent = `CARREGADO: ${nome} (${arquivosCarregados}/${totalDeArquivos}) `;
        }
    }

    class Sprite {
        constructor(sprite, x, y, width, height, name) {
            this.name = name;

            this.image = Galeria.imagens[sprite];

            //console.log(sprite)
            this.width = width || Galeria.imagens[sprite].width;
            this.height = height || Galeria.imagens[sprite].height;

            this.velocity = new Vector(0, 0);

            this.position = new Vector(x, y);

            this.active = true;

            this.anims = {
                isPlaying: false
            }
        }

        draw() {
            if (this.anims.isPlaying) {
                ctx[3].drawImage(this.image, this.anims.current.originX, this.anims.current.originY, this.width, this.height, this.position.getX(), this.position.getY(), this.width, this.height);
            } else if (!this.anims.isPlaying) {
                ctx[3].drawImage(this.image, this.position.getX(), this.position.getY(), this.width, this.height);
            }
        }
        update(deltaTime) {
            if (this.anims.isPlaying) {
                this.processAnimation(deltaTime);
            }
        }
        setSpriteSheetConfig(frameWidth, frameHeight) {
            this.anims.config = {
                frameWidth: frameWidth,
                frameHeight: frameHeight,
                rowNumber: Math.round(this.image.height / frameHeight),
                columnNumber: Math.round(this.image.width / frameWidth)
            }
        }

        addAnimation(name, frames, delay) {
            this.anims[name] = {
                frames: frames,
                originX: 0,
                originY: 0,
                currentTime: 0,
                currentFrame: frames[0],
                delay: delay // Em ms
            }
        }

        playAnimation(name) {
            this.anims.current = this.anims[name];
            this.anims.isPlaying = true;
        }

        processAnimation(deltaTime) {
            this.anims.current.currentTime += deltaTime * 1000;
            if (this.anims.current.currentTime < this.anims.current.delay) { return; }

            let frames = this.anims.current.frames;
            let currentFrame = this.anims.current.currentFrame;
            let linhas = this.anims.config.rowNumber;
            let colunas = this.anims.config.columnNumber;
            let stoped = false;

            if (frames.indexOf(currentFrame) == -1) {
                currentFrame = frames[0];
                this.anims.current.currentFrame = frames[0];
            }

            let contador = 0;
            for (let coluna = 0; coluna < colunas && !stoped; coluna++) {
                for (let linha = 0; linha < linhas; linha++) {
                    if (contador == currentFrame && frames.indexOf(currentFrame) != -1) {
                        this.anims.current.originY = linha * this.anims.config.frameHeight;
                        this.anims.current.originX = coluna * this.anims.config.frameWidth;
                        this.anims.current.currentFrame++;
                        this.anims.current.currentTime = 0;
                        stoped = true;
                        break;
                    }
                    contador++;
                }
            }
        }
    }
    /* Object Pool
        O objeto "Pool" é responsável por controlar os objetos. A array de objetos (entityList) guarda todos
        os objetos sendo usados em cena, e o "Pool" guarda todos os objetos que não estao sendo usados. Por guardar 
        os objetos que seriam inicialmente deletados, nós podemos reutilizá-los ao invés de criar totalmente novas 
        instancias com o operador "new". Reciclar objetos salva memória ! 
    */
    let Pool = {

        // Declarando as classes

        Bird: class Bird extends Sprite {
            constructor(parameters) {

                super(parameters.sprite, parameters.x, parameters.y, parameters.width, parameters.height, parameters.name)

                this.GAME_STATE = Game.STATE.MENU;

                this.angle = 0;
                this.ANGULAR_VELOCITY = 45;

                this.FORCE_JUMP = new Vector(0, -350);
            }

            draw() {
                // Salva o contexto atual
                ctx[3].save();

                // Reposiciona o contexto para o centro do nosso jogador
                ctx[3].translate(this.position.getX() + this.width / 2, this.position.getY() + this.height / 2);

                // Rotaciona o contexto, dando uma ILUSAO que o jogador rotacionou
                ctx[3].rotate(this.angle);

                // Desenha nosso jogador
                if (this.anims.isPlaying) {
                    ctx[3].drawImage(this.image, this.anims.current.originX, this.anims.current.originY, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
                } else if (!this.anims.isPlaying) {
                    ctx[3].drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
                }

                // Restaura o contexto para o salvo previamente
                ctx[3].restore();
            }
            update(deltaTime) {
                // Retorna se não estiver "rodando"

                if (this.GAME_STATE != Game.STATE.RUNNING) { return; }

                // Velocity aumenta com a gravidade

                this.velocity.addTo(GRAVIDADE.multiply(deltaTime))

                // Os quadrantes do circulo trigonométrico no canvas é diferente do tradicional, nele o 1º Quadrante é
                // equivalente ao 4º Quadrante do tradicional
                // Como eu quero que o personagem "olhe para cima" quando voar e "olha para baixo" quando estiver caindo
                // defini que o angulo máximo é:
                //      Circulo tradicional : - Máximo 20°
                //                            - Minimo 340°
                //      No canvas           : - Máximo 340°
                //                            - Minimo 20°
                // Ou seja, ele tem que ser MENOR que 20° OU MAIOR que 340°, fora disso, nao mudo seu angulo

                if (this.angle < Math.PI / 180 * 20 || this.angle >= Math.PI / 180 * 340) {
                    // Aumenta pela queda
                    this.addAngle(Math.PI / 180 * this.ANGULAR_VELOCITY * deltaTime)
                }

                // A posição no eixo Y aumenta pela speedY, dando o efeito de queda

                this.position.addTo(this.velocity.multiply(deltaTime));

                // Tela de GameOver se estiver fora do CANVAS

                if (this.position.getY() + this.height >= GAME_HEIGHT || this.position.getY() <= 0) {
                    gameOver();
                }

                // Animação
                if (this.anims.isPlaying) {
                    this.processAnimation(deltaTime);
                }
            }

            addAngle(angle) {
                this.angle += angle;
            }

            setAngle(newAngle) {
                this.angle = newAngle;
            }

            moveUp() {
                if (this.GAME_STATE != Game.STATE.RUNNING) { return; }

                // "Voo"

                this.velocity.setY(this.FORCE_JUMP.getY());

                this.setAngle(Math.PI / 180 * 340)

                //Galeria.audio.fly_Music.currentTime = 0;
                Galeria.audio.fly_Music.load();
                Galeria.audio.fly_Music.play();
            }

            reset() {
                this.angle = 0;

                this.velocity.setLength(0);

                this.position.setXY(GAME_WIDTH / 10 - 17, GAME_HEIGHT / 4)
            }
        },

        Background: class Background {
            constructor(parameters) {
                this.name = parameters.name;

                // POSIÇÃO PAR NA ARRAY -> CHAO
                // POSIÇÃO IMPAR NA ARRAY -> FUNDO
                this.imagens = [Galeria.imagens.chao, Galeria.imagens.background]

                this.velocity = [new Vector(-100, 0), new Vector(-10, 0)]; // CHAO ACOMPANHA OS CANOS

                this.active = true;

                // Dois fundos ( BACKGROUND E CHAO ), quatro posições ( DOIS PARA CADA )
                this.positions =
                    [
                        new Vector(parameters.x, parameters.y + 382), // CHAO
                        new Vector(parameters.x, parameters.y + 273), // BACKGROUND
                        new Vector(parameters.x + this.imagens[0].width, parameters.y + 382),  // CHAO
                        new Vector(parameters.x + this.imagens[1].width, parameters.y + 273) // BACKGROUND
                    ]
            }

            draw() {

                // Desenha o background Parallax

                this.positions.forEach((position, index) => {
                    let i = index % 2 // PAR OU IMPAR

                    if (i == 0) { // PAR = CHAO ; IMPAR = BACKGROUND
                        //Contexto de z-index/depth= 02 (coloquei elas na msm ordem de profundidade, para nao confundir)
                        ctx[2].drawImage(this.imagens[0], position.getX(), position.getY());
                    } else if (i == 1) {
                        //Contexto de z-index/depth= 02 (coloquei elas na msm ordem de profundidade, para nao confundir)
                        ctx[0].drawImage(this.imagens[1], position.getX(), position.getY());
                    }
                });
            }

            update(deltaTime) {
                if (player.GAME_STATE != Game.STATE.RUNNING) { return; }

                // Reposiciona o ELEMENTO da esquerda para o final, dando o efeito de looping
                this.positions.forEach((position, index) => {
                    let i = index % 2;

                    if (i == 0) { // PAR = CHAO
                        if (position.getX() + this.imagens[0].width < 0) {
                            if (index == 0) {
                                position.setX(this.positions[2].getX() + this.imagens[0].width);
                            } else if (index == 2) {
                                position.setX(this.positions[0].getX() + this.imagens[0].width);
                            }
                        }
                    } else if (i == 1) { // IMPAR = BACKGROUND
                        if (position.getX() + this.imagens[1].width < 0) {
                            if (index == 1) {
                                position.setX(this.positions[3].getX() + this.imagens[1].width);
                            } else if (index == 3) {
                                position.setX(this.positions[1].getX() + this.imagens[1].width);
                            }
                        }
                    }

                    // Efeito parallax
                    position.addTo(this.velocity[i].multiply(deltaTime));
                });
            }
        },

        Pipe: class Pipe extends Sprite {
            constructor(parameters) {

                super(parameters.sprite, parameters.x, parameters.y, parameters.width, parameters.height, parameters.name)

                this.velocity = new Vector(-100, 0);
            }

            draw() {
                if (this.name == "Pipe North") {
                    ctx[3].drawImage(this.image, this.position.getX(), this.position.getY())
                } else if (this.name == "Pipe South") {
                    ctx[1].drawImage(this.image, this.position.getX(), this.position.getY())
                }
            }
            update(deltaTime) {
                if (player.GAME_STATE != Game.STATE.RUNNING) { return; }

                this.position.addTo(this.velocity.multiply(deltaTime));

                if (this.position.getX() + this.image.width < 0) {
                    this.active = false;
                }

                if (this.name == "Pipe North" &&
                    player.position.getX() >= this.position.getX() + this.image.width &&
                    player.position.getX() <= this.position.getX() + this.image.width + -this.velocity.getX() * deltaTime) {
                    addScore();
                }
            }
            resetAt(parameters) {
                this.position.setX(parameters.x);
                this.position.setY(parameters.y);
                this.active = true;
            }
        },

        Coin: class Coin extends Sprite {
            constructor(parameters) {
                super(parameters.sprite, parameters.x, parameters.y, parameters.width, parameters.height, parameters.name);
            }
        },

        stored: new Array(),

        // Tenta pegar um objeto armazenado
        get: function (className, name, parameters) {
            let index = -1;

            // Percorre a array e verifica se o objeto requisitado já existe
            for (let i = 0; i < this.stored.length; i++) {
                const element = this.stored[i];
                if (element.name == name) {
                    index = i;
                    // Se sim, termina o loop
                    break;
                }
            }

            // Objeto requisitado existe
            if (index >= 0) {
                let GAMEOBJECT = this.stored[index];

                // Retira o objeto requisitado da array
                this.stored.splice(index, 1)

                // Reseta o GAMEOBJECT
                GAMEOBJECT.resetAt(parameters);

                // Retorna o objeto requisitado
                return GAMEOBJECT;
            }

            // Objeto ainda nao foi armazenado, retorna um novo
            return this.create(className, parameters);
        },

        // Cria um novo objeto / classe
        create: function (className, parameters) {
            // new this[className] -> Cria um novo objeto a partir de uma classe que existe dentro da pool (this)
            let myObj = new this[className](parameters);

            // retorna ele
            return myObj;
        },

        // Adiciona um novo objeto a pool
        add: function (GameObject) {
            // Posso passar como parametro uma array de objetos
            if (GameObject.length > 0) {
                GameObject.forEach(element => {
                    this.stored.push(element);
                });
            }
            // Ou apenas um objeto
            else {
                this.stored.push(GameObject);
            }
        }
    }

    // Objeto game
    let Game = {
        // Todos os estados do jogo
        STATE:
        {
            RUNNING: 0,
            MENU: 1,
            PAUSED: 2,
            GAME_OVER: 3
        },

        // Primeira função a ser executado do game
        init: function () {
            // Verifica que tipo de dispositivo é
            userAgent = navigator.userAgent.toLocaleLowerCase();
            android = userAgent.indexOf('android') > -1 ? true : false;
            ios = (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1) ? true : false;

            // Determina o width e o height do canvas

            canvas.forEach(element => {
                element.width = GAME_WIDTH;
                element.height = GAME_HEIGHT;
            });

            ratio = GAME_WIDTH / GAME_HEIGHT;

            // Resize
            Display.resize();

            // Carregando as imagens

            let imagens = [["background", "./assets/imagens/Background.webp"], ["chao", "./assets/imagens/Floor.webp"], ["pipeNorth_img", "./assets/imagens/PipeNorth.webp"], ["pipeSouth_img", "./assets/imagens/PipeSouth.webp"], ["bird_sprite", "./assets/imagens/BirdSprite.webp"], ["coin_sprite", "./assets/imagens/CoinSprite.webp"], ["enter_btn", "./assets/imagens/Enter_btn.webp"], ["gameOverScreen", "./assets/imagens/GameOverScreen.webp"], ["startMenuScreen", "./assets/imagens/StartMenu.webp"]]
            let audios = [["fly_Music", "./assets/sounds/fly.mp3"], ["score_Music", "./assets/sounds/score.mp3"]]

            totalDeArquivos += imagens.length;
            totalDeArquivos += audios.length;

            // Objeto Map -> A partir de uma array, cria um key -> value para cada 2 elementos
            imagens = new Map(imagens);
            audios = new Map(audios);

            imagens.forEach((value, key) => {
                Galeria.CarregarImagem(key, value, Game.start)
            });

            audios.forEach((value, key) => {
                Galeria.CarregarAudio(key, value, Game.start)
            });

        },

        // Inicio do jogo, chamado após carregar os arquivos ( imagens e audios )
        start: function () {
            // Remove o element responsável por aparecer loading ao usuário
            window.document.body.removeChild(divLoading);

            // Recupera a pontuação maxima do navegador do cliente
            highScore = window.localStorage.getItem("javascript-flappy-bird-storage")

            // Se nao existir, cria um novo e delimita como zero
            if (!highScore) {
                window.localStorage.setItem("javascript-flappy-bird-storage", "0")
                highScore = 0;
            }

            // Criando GameObjects

            player = Pool.get("Bird", "Bird", { sprite: "bird_sprite", x: GAME_WIDTH / 10 - 17, y: GAME_HEIGHT / 4, width: 34, height: 22.333, name: "Bird" });
            player.setSpriteSheetConfig(34, 67 / 3);
            player.addAnimation("Voo", [0, 1, 2], 80);
            player.playAnimation("Voo");

            fundo = Pool.get("Background", "Background", { x: 0, y: 0, name: "Background" });

            Display.drawHUD(Game.STATE.MENU, 0);

            // Cria interatividade com a janela
            GameScreen.addEventListener('click', function (e) {
                if (player.GAME_STATE == Game.STATE.RUNNING) {
                    player.moveUp();
                } else if (player.GAME_STATE == Game.STATE.MENU) {
                    startGame();
                }
                else if (player.GAME_STATE == Game.STATE.GAME_OVER) {
                    let buttonWidth = (Galeria.imagens.enter_btn.width * currentWidth) / GAME_WIDTH;
                    let buttonHeight = (Galeria.imagens.enter_btn.height * currentHeight) / GAME_HEIGHT;
                    let buttonX = currentWidth / 2 - (buttonWidth / 2);
                    let buttonY = currentHeight / 3 - (buttonHeight / 2) + ((100 * currentHeight) / GAME_HEIGHT);

                    if (e.x >= buttonX && e.x <= buttonX + buttonWidth &&
                        e.y >= buttonY && e.y <= buttonY + buttonHeight) {
                        startGame();
                    }
                }
            }, { passive: false });

            // A cada spawnTime (em ms) a função addPipe é acionada
            window.setInterval(addPipe, spawnTime);

            // Chamando o GameLoop
            requestAnimFrame(Game.Engine.GameLoop);
        },

        // Responsável pela lógica do jogo
        Engine: {
            // Responsável pelo Gameloop
            GameLoop: function (tempoAtual) {

                // Responsável por chamar o GameLoop
                requestAnimFrame(Game.Engine.GameLoop);

                tempoAtual = tempoAtual / 1000;

                deltaTime = tempoAtual - tempoInicial;
                tempoInicial = tempoAtual;

                // Atualiza
                Game.Engine.update();
                // Desenha
                Display.render();
            },

            update: function () {
                // Para facilitar a lógica, decidir separar os objetos "player" e "background" dos canos (que pertencem a entityList)
                // porque seus comportamentos sao únicos, facilitando suas manipulações;
                fundo.update(deltaTime); // Atualiza o fundo

                player.update(deltaTime); // Atualiza o player

                if (player.position.getY() + player.height >= 382) {
                    gameOver();
                }

                let recycle = entityList.filter((entity) => { // Filtra apenas os objetos inativos (OBS: Apenas os canos estão na entityList)
                    return entity.active == false;
                })

                // Caso tenha items para serem recilados, chama o objeto Pool
                if (recycle.length > 0) {
                    Pool.add(recycle);
                }

                // Retira da array os objetos desativados (OBS: Apenas os canos estão na entityList)
                entityList = entityList.filter((entity) => { // Filtra apenas os objetos ativos
                    return entity.active == true;
                })

                // Atualiza os objetos e verifica colisao (OBS: Apenas os canos estão na entityList)
                entityList.forEach(entity => {
                    entity.update(deltaTime)

                    let distance = entity.position.getX() - (player.position.getX() + player.width)
                    // Verifica a colisao apenas nos canos próximos, para evitar loop/calculo desnecessários
                    // "200 * deltaTime" é a velocidade do cano
                    if (distance <= 200 * deltaTime && distance >= -(entity.image.width + player.width)) {
                        if (player.position.getX() + player.width >= entity.position.getX() &&
                            player.position.getX() <= entity.position.getX() + entity.image.width &&
                            player.position.getY() <= entity.position.getY() + entity.image.height &&
                            player.position.getY() + player.height >= entity.position.getY()) {
                            gameOver();
                        }
                    }
                });
            }
        }
    }

    // Tela do jogo
    Display = {
        // Desenha
        render: function () {

            ctx.forEach((element, index) => {
                if (index == 4) { return; }
                element.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT); // Limpa o canvas
            });

            fundo.draw();  // Desenha o fundo

            player.draw(); // Desenha o jogador

            // Desenha os objetos da entityList (OBS: Apenas os canos estão na entityList)
            entityList.forEach(entity => {
                entity.draw()
            });

            // Desenha o HUD
            if (player.GAME_STATE == Game.STATE.RUNNING) {
                ctx[4].clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                Display.drawHUD(Game.STATE.RUNNING, deltaTime);
            }
        },

        drawHUD: function (hud, deltaTime) {
            if (hud == Game.STATE.MENU) {
                // MENU
                ctx[4].drawImage(Galeria.imagens.startMenuScreen, GAME_WIDTH / 2 - (Galeria.imagens.startMenuScreen.width / 2), GAME_HEIGHT / 3 - (Galeria.imagens.startMenuScreen.height / 2))
                ctx[4].font = "24px Source Code Pro";
                ctx[4].textAlign = "center";
                ctx[4].fillStyle = "white";
                ctx[4].fillText("Clone do Flappy Bird", GAME_WIDTH / 2, GAME_HEIGHT - 48);
                ctx[4].fillText("Por Diego Matos", GAME_WIDTH / 2, GAME_HEIGHT - 24);  
            }

            if (hud == Game.STATE.PAUSED) {
                // PAUSADO
                ctx[4].fillStyle = "rgba(0, 0, 0, 0.5)"
                ctx[4].fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
                ctx[4].font = "26px Arial";
                ctx[4].textAlign = "center";
                ctx[4].fillStyle = "white";
                ctx[4].fillText("PAUSADO", GAME_WIDTH / 2, GAME_HEIGHT / 2);
            }

            if (hud == Game.STATE.GAME_OVER) {
                // GAME OVER
                ctx[4].drawImage(Galeria.imagens.gameOverScreen, GAME_WIDTH / 2 - (Galeria.imagens.gameOverScreen.width / 2), GAME_HEIGHT / 3 - (Galeria.imagens.gameOverScreen.height / 2))

                ctx[4].drawImage(Galeria.imagens.enter_btn, GAME_WIDTH / 2 - (Galeria.imagens.enter_btn.width / 2), GAME_HEIGHT / 3 - (Galeria.imagens.enter_btn.height / 2) + 100)

                if(score < 50){
                    ctx[4].drawImage(Galeria.imagens.coin_sprite, 46, 45, 46, 45, 72, 166, 46, 45);
                }
                else if(score < 100){
                    ctx[4].drawImage(Galeria.imagens.coin_sprite, 46, 0, 46, 45, 72, 166, 46, 45);
                }
                else{
                    ctx[4].drawImage(Galeria.imagens.coin_sprite, 0, 45, 46, 45, 72, 166, 46, 45);
                }
                // Desenha os pontos
                ctx[4].font = "14px Arial";
                ctx[4].fillStyle = "black"
                ctx[4].textAlign = "center"
                ctx[4].fillText(`${score}`, 230, 170);

                // HighScore
                ctx[4].font = "14px Arial";
                ctx[4].textAlign = "center";
                ctx[4].fillText(`${highScore}`, 232, 210);
            }

            if (hud == Game.STATE.RUNNING) {

                // Desenha os pontos
                ctx[4].font = "24px Arial";
                ctx[4].fillStyle = "black"
                ctx[4].textAlign = "left"
                ctx[4].fillText(`${score}`, 20, 30);

                // Aparece em todos os casos
                // Desenha o FPS
                ctx[4].font = "14px Arial";
                ctx[4].fillStyle = "black"
                ctx[4].textAlign = "right"
                FPS = 1000 / (deltaTime * 1000);
                ctx[4].fillText(`FPS: ${FPS.toFixed(2)}`, GAME_WIDTH, 14);
            }
        },

        // Chamado quando a tela mudar de tamanho / para redimensionar a tela
        resize: function () {
            if (android || ios) {
                // Certifica de manter as dimensoes retangulares, tanto com o celular na horizontal qnt na vertical
                if (window.innerHeight > window.innerWidth) {
                    ratio = window.innerWidth / window.innerHeight
                } else {
                    ratio = window.innerHeight / window.innerWidth
                }
            } else {
                ratio = GAME_WIDTH / GAME_HEIGHT
            }
            currentHeight = window.innerHeight;
            currentWidth = currentHeight * ratio;

            // Graficamente, por meio do css, redimensionamos o canvas.

            canvas.forEach(element => {
                element.style.width = currentWidth + 'px';
                element.style.height = currentHeight + 'px';
            });
        }
    }

    function addPipe() {
        if (player.GAME_STATE != Game.STATE.RUNNING) { return; } // Retornar se NAO estiver jogando/RUNNING

        newPosY = Math.round(Math.random() * -233); // Criar uma posição y randômica entre 0 (topo do cano) e -185 (subir o cano até 185px)
        GAP = Galeria.imagens.pipeNorth_img.height + 100 // Distancia de um cano ao outro

        let northPipe = Pool.get("Pipe", "Pipe North", { sprite: "pipeNorth_img", x: GAME_WIDTH, y: newPosY, name: "Pipe North" });
        let southPipe = Pool.get("Pipe", "Pipe South", { sprite: "pipeSouth_img", x: GAME_WIDTH, y: newPosY + GAP, name: "Pipe South" });

        entityList.push(northPipe);
        entityList.push(southPipe);
    }

    function startGame() {
        if (player.GAME_STATE == Game.STATE.MENU || player.GAME_STATE == Game.STATE.GAME_OVER) {

            ctx[4].clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT); // Limpa o HUD

            player.reset();

            score = 0;

            let recycle = entityList.filter((entity) => { // Filtra apenas os objetos inativos (OBS: Apenas os canos estão na entityList)
                return entity.name == "Pipe North" || "Pipe South";
            })
            if (recycle.length > 0) {
                Pool.add(recycle)
            }
            entityList.length = 0; // Limpa a array

            player.GAME_STATE = Game.STATE.RUNNING; // Volta a jogar
        }
    }

    function tooglePaused() {
        if (player.GAME_STATE == Game.STATE.PAUSED) {
            startGame();
        }
        else if (player.GAME_STATE == Game.STATE.RUNNING) {
            player.GAME_STATE = Game.STATE.PAUSED;
        }
    }

    function addScore() {
        //Galeria.audio.score_Music.currentTime = 0;
        Galeria.audio.score_Music.load();
        Galeria.audio.score_Music.volume = 0.5;
        Galeria.audio.score_Music.play();
        score ++;
    }

    function gameOver() {
        if (score > highScore) {
            highScore = score;
            window.localStorage.setItem("javascript-flappy-bird-storage", highScore)
        }
        player.GAME_STATE = Game.STATE.GAME_OVER;

        Display.drawHUD(Game.STATE.GAME_OVER, 0)
    }

    window.addEventListener("load", Game.init, false);
    window.addEventListener("resize", Display.resize, false);
})();