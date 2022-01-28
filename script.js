const Game = {};



class Tea {
    constructor(x, gravity) {
        this.gravity = gravity;
        this.velocity = 0;
        this.y = Game.heightSenpai;
        this.x = x;

        this.div = $('<div class="tea">');

        this.update();

        this.div.appendTo(Game.div);
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        this.div.css('top', this.y+ 'px').css('left', this.x + 'px');
    }

    remove() {
        clearInterval(this.interval);
        this.div.remove();
    }

    start(gameOver, onclick) {
        let self = this;
        this.div.click(onclick);
        this.div[0].ontouchstart = onclick;
        this.interval = setInterval(() => {
            if (self.y > Game.height + Game.heightTea) {
                gameOver();
                clearInterval(this.interval);
            } else {
                self.update();
            }
        }, 1000 / Game.FPS);
    }
}

class Senpai {
    constructor() {
        this.div = $('#senpai');
    }

    get x() {
        return parseInt(this.div.css('left'));
    }
}

(function(g) {
    g.div = $('#game');
    g.width = g.div.width();
    g.height = g.div.height();
    g.heightTea = 100;
    g.widthSenpai = 75;
    g.heightSenpai = 75;
    g.teaIntervalMS = 750;
    g.lineY = g.height * 0.7;
    g.FPS = 60;
    g.animation = $('#animation');
    g.initHP = 3;

    createjs.Sound.registerSound({
        src: "./music/drink.mp3",
        id: "drink"
    });

    createjs.Sound.registerSound({
        src: "./music/error.mp3",
        id: "error"
    });

    createjs.Sound.registerSound({
        src: "./music/end.mp3",
        id: "end"
    });

    function play(name) {
        createjs.Sound.stop();
        createjs.Sound.play(name);
    }

    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    g.setEvents = function() {
        $('#senpai').addClass('senpaimove');
    }

    function gameOver(score) {
        const senpai = $('#senpai');
        senpai.css('left', senpai.css('left')).removeClass('senpaimove');
        $('#score').text(score);
        $('#game-over').modal({backdrop: 'static'}).modal('show');
        play("end");
    }

    function updateHP(hp) {
        $('#hp').text(hp);
    }

    g.start = function() {
        $('.tea').each((i, t) => t.remove());

        let score = 0, hp = g.initHP;
        updateHP(hp);

        const senpai = new Senpai();
        const set = new Set();
        g.setEvents();
        createjs.Sound.stop();

        let teaInterval = setInterval(() => {
            let t = new Tea(senpai.x, randInt(15, 65) / 100);
            set.add(t);
            t.start(() => {
                hp--;
                updateHP(hp);
                if (hp !== 0) {
                    play("error");
                } else {
                    clearInterval(teaInterval);
                    set.forEach(t => clearInterval(t.interval));
                    gameOver(score);
                }
            }, () => {
                if (t.y + g.heightTea > g.lineY) {
                    play("drink");
                    set.delete(t);
                    t.remove();
                    score++;
                }
            });
        }, g.teaIntervalMS);
    }
}) (Game);

function closeWelcome() {
    $('#welcome').removeClass('welcome');
    $('#welcome-board').css('display', 'none');
    $('#game').css('display', '');
}