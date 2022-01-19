const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let imagePlayer = new Image();

alert("ARE YOU READY TO PLAY THIS GAME!");

class asteroids {
    constructor(x, y, r, color, speed) {
        this.color = color || "BLACK";
        this.x = x || console.log("BRUH");
        this.y = y || console.log("ehmmmm");
        this.r = r || console.log("radius bruh")
        this.speed = speed || console.log("speed")
    }

    draw(context) {
        ctx.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        context.fill();
        ctx.closePath();

                this.x = this.x - this.speed;
    }
}

let player = {
    /* position */
    x: 0,
    y: canvas.height / 2,

    /* collider */
    w: 30,
    h: 30,
    color: "BLUE", //collider color
    speed: 5,

    imagePlayer: {
        width: 32,
        height: 32,
        time_collums: 4,
        collums_value: 5,
    },

    showCollision: false,
    score: 0,
    die: false
}

let gameFrame = 0

let fps = 50;
let game_time = 1000 / fps;

let controller = {
  RIGHT: false,
  LEFT: false,
  UP: false,
  DOWN: false,
};

let spawnerLimits = 30
let timeSpawn = 500 / 15
let asteroidsArray = []

function spawner() {
    setInterval(() => {
        let x = canvas.width + 15;
        let y = Math.random() * canvas.height;
        let speed = Math.random() + 4;
        let size = Math.random() * (20 - 9) + 9

        if (asteroidsArray.length <= spawnerLimits) {
            if (y >= 0 || y <= canvas.height - 70) {
                asteroidsArray.push(new asteroids(x, y, size, "RED", speed));
            }
        }
    }, timeSpawn);
}

function RectCircleColliding(circle, rect) {
  var distX = Math.abs(circle.x - rect.x - rect.w / 2);
  var distY = Math.abs(circle.y - rect.y - rect.h / 2);

  if (distX > rect.w / 2 + circle.r) {
    return false;
  }
  if (distY > rect.h / 2 + circle.r) {
    return false;
  }

  if (distX <= rect.w / 2) {
    return true;
  }
  if (distY <= rect.h / 2) {
    return true;
  }

  var dx = distX - rect.w / 2;
  var dy = distY - rect.h / 2;
  return dx * dx + dy * dy <= circle.r * circle.r;
}

function game() {
    let position = Math.floor(gameFrame / player.imagePlayer.time_collums) % player.imagePlayer.collums_value;
    let collums = position * player.imagePlayer.width;
    ctx.fillStyle = "RGBA(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    imagePlayer.src = "spaceShip.png"

    if (player.showCollision) {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.w, player.h);
    }

        ctx.save()
          ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
          ctx.drawImage(
            imagePlayer /* source */,

            0/* collumsX A.K.A sourceX sx */,

            collums /* collumsY A.K.A sourceY sy*/,

            player.imagePlayer.width /* sourceWidth sw */,

            player.imagePlayer.height /* sourceHeight sh */,

            player.x - 30 /* image position on the screen A.K.A dataX dx*/,

            player.y - 25/* image position on the screen A.K.A dataY dy*/,

            100 /* image data width dw */,

            100/* image data height dh */
          );
    ctx.restore();

    asteroidsArray.forEach((asteroids, index) => {
        asteroids.draw(ctx);

        if (asteroids.x <= -60) {
            asteroidsArray.splice(index, 1);
            player.score += 1
        }

        if (RectCircleColliding(asteroids, player) && !player.die) {
            player.die = true;
            location.reload()
            alert("you lose and your score is: " + player.score)
        }        
    })

    gameFrame++
}

function controllerFunction() {
    if (controller.RIGHT && player.x <= canvas.width - 30) {
        player.x += player.speed
    }

    if (controller.LEFT && player.x >= 0) {
        player.x -= player.speed
    }

    if (controller.UP && player.y >= 0) {
        player.y -= player.speed
    }

    if (controller.DOWN && player.y <= canvas.height - 30) {
        player.y += player.speed
    }
}


addEventListener("keydown", function (e) {
  console.log(e.keyCode, ` keyName: ${e.key}`);
  /* 65 " keyName: a"
 87 " keyName: w"
 68 " keyName: d"
 83 " keyName: s" */
    switch (e.keyCode) {
        case 87:
            controller.UP = true;
            break;
        case 83:
            controller.DOWN = true;
            break;
        case 65:
            controller.LEFT = true;
            break;
        case 68:
            controller.RIGHT = true;
            break;
        default:
            controller.UP = false;
            controller.DOWN = false;
            controller.LEFT = false;
            controller.RIGHT = false;
        break;
  }
})

addEventListener("keyup", function (e) {
switch (e.keyCode) {
        case 87:
            controller.UP = false;
            break;
        case 83:
            controller.DOWN = false;
            break;
        case 65:
            controller.LEFT = false;
            break;
        case 68:
            controller.RIGHT = false;
            break;
        default:
            controller.UP = false;
            controller.DOWN = false;
            controller.LEFT = false;
            controller.RIGHT = false;
        break;
  }
})

addEventListener("resize", () => {
    location.reload();
})


function init() {
    spawner()
  setInterval(() => {
      game();
      controllerFunction();
  }, game_time);
}

init();