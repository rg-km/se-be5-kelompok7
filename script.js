const CELL_SIZE = 20;
const CANVAS_SIZE = 590;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
let MOVE_INTERVAL = 120;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        level: 1,
    }
}
let snake = initSnake("purple");
// let snake2 = initSnake("blue");

let apple = {
    color: "red",
    position: initPosition(),
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// function score
function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake.color) {
        scoreCanvas = document.getElementById("score1Board");
    } else {
        level = document.getElementById("level");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "50px Poppins";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 140, 90);
}


// function level
function drawLevel(snake) {
    let levelSnake;
    if (snake.color == snake.color) {
        levelSnake = document.getElementById("level");
    }

    let level = levelSnake.getContext("2d");

    level.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    level.font = "50px Poppins";
    level.fillStyle = snake.color
    level.fillText(snake.level, 140, 90);

    let score = snake.score
    if (score  === 5){
        snake.level = 2
        MOVE_INTERVAL = 90
    }else if (score === 10){
        snake.level = 3
        MOVE_INTERVAL = 70
    }else if (score === 15){
        snake.level = 4
        MOVE_INTERVAL = 50
    }else if (score === 20){
        snake.level = 5
        MOVE_INTERVAL = 30
    }

}


function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        drawCell(ctx, snake.head.x, snake.head.y, snake.color);
        for (let i = 1; i < snake.body.length; i++) {
            drawCell(ctx, snake.body[i].x, snake.body[i].y, snake.color);
        }
        // drawCell(ctx, snake2.head.x, snake2.head.y, snake2.color);
        // for (let i = 1; i < snake2.body.length; i++) {
        //     drawCell(ctx, snake2.body[i].x, snake2.body[i].y, snake2.color);
        // }
        drawCell(ctx, apple.position.x, apple.position.y, apple.color);

        drawScore(snake);
        drawLevel(snake);
        // drawScore(snake2);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apple) {
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
        apple.position = initPosition();
        snake.score++;
        snake.body.push({x: snake.head.x, y: snake.head.y});
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple);
}

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    if (isCollide) {
        alert("Game over");
        snake = initSnake("purple");
        
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake, DIRECTION.DOWN);
    }

    // if (event.key === "a") {
    //     turn(snake2, DIRECTION.LEFT);
    // } else if (event.key === "d") {
    //     turn(snake2, DIRECTION.RIGHT);
    // } else if (event.key === "w") {
    //     turn(snake2, DIRECTION.UP);
    // } else if (event.key === "s") {
    //     turn(snake2, DIRECTION.DOWN);
    // }
})

function initGame() {
    move(snake);
    // move(snake2);
}

initGame();