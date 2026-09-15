/* =========================================================
   RuiwGameWeb
   game.js
   贪吃蛇 + 经典俄罗斯方块
   ========================================================= */


/* =========================================================
   页面切换
   ========================================================= */

const homeScreen = document.getElementById("homeScreen");
const snakeScreen = document.getElementById("snakeScreen");
const tetrisScreen = document.getElementById("tetrisScreen");

function hideAllScreens() {
    homeScreen.classList.remove("active");
    snakeScreen.classList.remove("active");
    tetrisScreen.classList.remove("active");
}

function startSnake() {
    hideAllScreens();

    snakeScreen.classList.add("active");

    document.getElementById("snakeGameOver").classList.remove("show");

    initSnake();
}

function startTetris() {
    hideAllScreens();

    tetrisScreen.classList.add("active");

    document.getElementById("tetrisGameOver").classList.remove("show");

    initTetris();
}

function exitGame() {
    stopSnake();
    stopTetris();

    document.getElementById("snakeGameOver").classList.remove("show");
    document.getElementById("tetrisGameOver").classList.remove("show");

    hideAllScreens();

    homeScreen.classList.add("active");
}


/* =========================================================
   贪吃蛇
   ========================================================= */

const snakeCanvas = document.getElementById("snakeCanvas");
const snakeCtx = snakeCanvas.getContext("2d");

const SNAKE_SIZE = 20;

let snake = [];
let snakeFood = {};

let snakeDirection = {
    x: 1,
    y: 0
};

let snakeNextDirection = {
    x: 1,
    y: 0
};

let snakeScore = 0;
let snakeTimer = null;
let snakeRunning = false;


/* 初始化蛇 */

function initSnake() {

    stopSnake();

    const boardSize = 20;

    snakeCanvas.width = boardSize * SNAKE_SIZE;
    snakeCanvas.height = boardSize * SNAKE_SIZE;

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
        { x: 7, y: 10 }
    ];

    snakeDirection = {
        x: 1,
        y: 0
    };

    snakeNextDirection = {
        x: 1,
        y: 0
    };

    snakeScore = 0;

    document.getElementById("snakeScore").textContent =
        snakeScore;

    createSnakeFood();

    snakeRunning = true;

    drawSnake();

    /*
       贪吃蛇速度：
       180 毫秒移动一次
       比之前的 135 毫秒更慢
    */

    snakeTimer = setInterval(
        snakeGameLoop,
        180
    );
}


/* 停止蛇 */

function stopSnake() {

    snakeRunning = false;

    if (snakeTimer !== null) {

        clearInterval(snakeTimer);

        snakeTimer = null;
    }
}


/* 创建食物 */

function createSnakeFood() {

    const board = 20;

    while (true) {

        const food = {
            x: Math.floor(Math.random() * board),
            y: Math.floor(Math.random() * board)
        };

        let occupied = false;

        for (const part of snake) {

            if (
                part.x === food.x &&
                part.y === food.y
            ) {

                occupied = true;

                break;
            }
        }

        if (!occupied) {

            snakeFood = food;

            break;
        }
    }
}


/* 蛇游戏循环 */

function snakeGameLoop() {

    if (!snakeRunning) {
        return;
    }

    snakeDirection = {
        x: snakeNextDirection.x,
        y: snakeNextDirection.y
    };

    const head = snake[0];

    const newHead = {
        x: head.x + snakeDirection.x,
        y: head.y + snakeDirection.y
    };


    /* 撞墙 */

    if (
        newHead.x < 0 ||
        newHead.x >= 20 ||
        newHead.y < 0 ||
        newHead.y >= 20
    ) {

        snakeGameOver();

        return;
    }


    /* 撞自己 */

    for (let i = 0; i < snake.length; i++) {

        if (
            newHead.x === snake[i].x &&
            newHead.y === snake[i].y
        ) {

            snakeGameOver();

            return;
        }
    }


    snake.unshift(newHead);


    /* 吃到果子 */

    if (
        newHead.x === snakeFood.x &&
        newHead.y === snakeFood.y
    ) {

        snakeScore++;

        document.getElementById("snakeScore").textContent =
            snakeScore;

        createSnakeFood();

    } else {

        snake.pop();
    }

    drawSnake();
}


/* 绘制蛇 */

function drawSnake() {

    const size = SNAKE_SIZE;


    /* 背景 */

    snakeCtx.fillStyle = "#020617";

    snakeCtx.fillRect(
        0,
        0,
        snakeCanvas.width,
        snakeCanvas.height
    );


    /* 网格 */

    snakeCtx.strokeStyle =
        "rgba(255,255,255,0.035)";

    snakeCtx.lineWidth = 1;

    for (let x = 0; x <= 20; x++) {

        snakeCtx.beginPath();

        snakeCtx.moveTo(
            x * size,
            0
        );

        snakeCtx.lineTo(
            x * size,
            20 * size
        );

        snakeCtx.stroke();
    }

    for (let y = 0; y <= 20; y++) {

        snakeCtx.beginPath();

        snakeCtx.moveTo(
            0,
            y * size
        );

        snakeCtx.lineTo(
            20 * size,
            y * size
        );

        snakeCtx.stroke();
    }


    /* 红色果子 */

    snakeCtx.fillStyle = "#ef4444";

    snakeCtx.beginPath();

    snakeCtx.arc(
        snakeFood.x * size + size / 2,
        snakeFood.y * size + size / 2,
        size * 0.38,
        0,
        Math.PI * 2
    );

    snakeCtx.fill();


    /* 果子高光 */

    snakeCtx.fillStyle = "#fca5a5";

    snakeCtx.beginPath();

    snakeCtx.arc(
        snakeFood.x * size + size * 0.38,
        snakeFood.y * size + size * 0.35,
        size * 0.1,
        0,
        Math.PI * 2
    );

    snakeCtx.fill();


    /* 蛇 */

    snake.forEach((part, index) => {

        snakeCtx.fillStyle =
            index === 0
                ? "#4ade80"
                : "#22c55e";

        snakeCtx.beginPath();

        snakeCtx.roundRect(
            part.x * size + 1,
            part.y * size + 1,
            size - 2,
            size - 2,
            5
        );

        snakeCtx.fill();
    });


    /* 蛇头眼睛 */

    const head = snake[0];

    snakeCtx.fillStyle = "#052e16";

    let eye1;
    let eye2;

    if (snakeDirection.x !== 0) {

        eye1 = {
            x:
                head.x * size +
                size / 2 +
                snakeDirection.x * 5,

            y:
                head.y * size +
                size / 2 -
                4
        };

        eye2 = {
            x:
                head.x * size +
                size / 2 +
                snakeDirection.x * 5,

            y:
                head.y * size +
                size / 2 +
                4
        };

    } else {

        eye1 = {
            x:
                head.x * size +
                size / 2 -
                4,

            y:
                head.y * size +
                size / 2 +
                snakeDirection.y * 5
        };

        eye2 = {
            x:
                head.x * size +
                size / 2 +
                4,

            y:
                head.y * size +
                size / 2 +
                snakeDirection.y * 5
        };
    }


    snakeCtx.beginPath();

    snakeCtx.arc(
        eye1.x,
        eye1.y,
        2,
        0,
        Math.PI * 2
    );

    snakeCtx.fill();


    snakeCtx.beginPath();

    snakeCtx.arc(
        eye2.x,
        eye2.y,
        2,
        0,
        Math.PI * 2
    );

    snakeCtx.fill();
}


/* 蛇游戏结束 */

function snakeGameOver() {

    stopSnake();

    document.getElementById("snakeFinalScore").textContent =
        snakeScore;

    document.getElementById("snakeGameOver")
        .classList.add("show");
}


/* 重新开始 */

function restartSnake() {

    document.getElementById("snakeGameOver")
        .classList.remove("show");

    initSnake();
}


/* 改变蛇方向 */

function changeSnakeDirection(direction) {

    if (!snakeRunning) {
        return;
    }

    const opposite =
        snakeDirection.x + direction.x === 0 &&
        snakeDirection.y + direction.y === 0;

    if (opposite) {
        return;
    }

    snakeNextDirection = direction;
}


/* 手机方向按钮 */

document.querySelectorAll(
    ".snake-controls .control-button"
).forEach(button => {

    button.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            const direction =
                this.dataset.direction;


            if (direction === "up") {

                changeSnakeDirection({
                    x: 0,
                    y: -1
                });

            } else if (direction === "down") {

                changeSnakeDirection({
                    x: 0,
                    y: 1
                });

            } else if (direction === "left") {

                changeSnakeDirection({
                    x: -1,
                    y: 0
                });

            } else if (direction === "right") {

                changeSnakeDirection({
                    x: 1,
                    y: 0
                });
            }
        }
    );
});


/* =========================================================
   俄罗斯方块
   ========================================================= */

const tetrisCanvas =
    document.getElementById("tetrisCanvas");

const tetrisCtx =
    tetrisCanvas.getContext("2d");

const nextCanvas =
    document.getElementById("nextCanvas");

const nextCtx =
    nextCanvas.getContext("2d");


const TETRIS_COLS = 10;
const TETRIS_ROWS = 20;

let tetrisBoard = [];

let currentPiece = null;
let nextPiece = null;

let tetrisScore = 0;
let tetrisLevel = 1;

let tetrisTimer = null;
let tetrisRunning = false;

let lastDropTime = 0;


/* 七种经典方块 */

const TETRIS_SHAPES = [

    {
        name: "I",

        matrix: [
            [1, 1, 1, 1]
        ]
    },

    {
        name: "O",

        matrix: [
            [1, 1],
            [1, 1]
        ]
    },

    {
        name: "T",

        matrix: [
            [0, 1, 0],
            [1, 1, 1]
        ]
    },

    {
        name: "S",

        matrix: [
            [0, 1, 1],
            [1, 1, 0]
        ]
    },

    {
        name: "Z",

        matrix: [
            [1, 1, 0],
            [0, 1, 1]
        ]
    },

    {
        name: "J",

        matrix: [
            [1, 0, 0],
            [1, 1, 1]
        ]
    },

    {
        name: "L",

        matrix: [
            [0, 0, 1],
            [1, 1, 1]
        ]
    }

];


/* 方块颜色 */

const TETRIS_COLORS = {

    I: "#22d3ee",

    O: "#facc15",

    T: "#c084fc",

    S: "#4ade80",

    Z: "#f87171",

    J: "#60a5fa",

    L: "#fb923c"
};


/* 初始化俄罗斯方块 */

function initTetris() {

    stopTetris();

    tetrisCanvas.width = 300;
    tetrisCanvas.height = 600;

    nextCanvas.width = 100;
    nextCanvas.height = 100;

    tetrisBoard = [];

    for (
        let y = 0;
        y < TETRIS_ROWS;
        y++
    ) {

        tetrisBoard.push(
            new Array(TETRIS_COLS).fill(null)
        );
    }

    tetrisScore = 0;

    tetrisLevel = 1;

    updateTetrisScore();

    nextPiece = createTetrisPiece();

    spawnTetrisPiece();

    tetrisRunning = true;

    lastDropTime = performance.now();

    drawTetris();

    drawNextPiece();

    tetrisLoop();
}


/* 停止俄罗斯方块 */

function stopTetris() {

    tetrisRunning = false;

    if (tetrisTimer !== null) {

        cancelAnimationFrame(
            tetrisTimer
        );

        tetrisTimer = null;
    }
}


/* 创建随机方块 */

function createTetrisPiece() {

    const source =
        TETRIS_SHAPES[
            Math.floor(
                Math.random() *
                TETRIS_SHAPES.length
            )
        ];

    const matrix =
        source.matrix.map(
            row => [...row]
        );

    return {

        name: source.name,

        matrix: matrix,

        x:
            Math.floor(
                (
                    TETRIS_COLS -
                    matrix[0].length
                ) / 2
            ),

        y: 0
    };
}


/* 生成当前方块 */

function spawnTetrisPiece() {

    currentPiece = nextPiece;

    currentPiece.x =
        Math.floor(
            (
                TETRIS_COLS -
                currentPiece.matrix[0].length
            ) / 2
        );

    currentPiece.y = 0;

    nextPiece =
        createTetrisPiece();

    drawNextPiece();


    /* 如果一生成就碰撞 */

    if (
        tetrisCollision(
            currentPiece,
            0,
            0,
            currentPiece.matrix
        )
    ) {

        tetrisGameOver();
    }
}


/* 俄罗斯方块游戏循环 */

function tetrisLoop(time = 0) {

    if (!tetrisRunning) {
        return;
    }

    const speed =
        Math.max(
            90,
            750 -
            (tetrisLevel - 1) * 65
        );


    if (
        time - lastDropTime >= speed
    ) {

        moveTetrisDown();

        lastDropTime = time;
    }

    drawTetris();

    tetrisTimer =
        requestAnimationFrame(
            tetrisLoop
        );
}


/* 碰撞检测 */

function tetrisCollision(
    piece,
    offsetX,
    offsetY,
    matrix
) {

    for (
        let y = 0;
        y < matrix.length;
        y++
    ) {

        for (
            let x = 0;
            x < matrix[y].length;
            x++
        ) {

            if (!matrix[y][x]) {
                continue;
            }

            const newX =
                piece.x +
                x +
                offsetX;

            const newY =
                piece.y +
                y +
                offsetY;


            if (
                newX < 0 ||
                newX >= TETRIS_COLS ||
                newY >= TETRIS_ROWS
            ) {

                return true;
            }


            if (
                newY >= 0 &&
                tetrisBoard[newY][newX]
            ) {

                return true;
            }
        }
    }

    return false;
}


/* 左右移动 */

function moveTetrisHorizontal(amount) {

    if (!tetrisRunning) {
        return;
    }

    if (
        !tetrisCollision(
            currentPiece,
            amount,
            0,
            currentPiece.matrix
        )
    ) {

        currentPiece.x += amount;

        drawTetris();
    }
}


/* 向下移动 */

function moveTetrisDown() {

    if (!tetrisRunning) {
        return;
    }

    if (
        !tetrisCollision(
            currentPiece,
            0,
            1,
            currentPiece.matrix
        )
    ) {

        currentPiece.y++;

    } else {

        lockTetrisPiece();

        clearTetrisLines();

        spawnTetrisPiece();
    }

    drawTetris();
}


/* 旋转方块 */

function rotateTetrisPiece() {

    if (!tetrisRunning) {
        return;
    }

    const oldMatrix =
        currentPiece.matrix;

    const rows =
        oldMatrix.length;

    const cols =
        oldMatrix[0].length;

    const rotated = [];


    for (
        let x = 0;
        x < cols;
        x++
    ) {

        rotated[x] = [];

        for (
            let y = rows - 1;
            y >= 0;
            y--
        ) {

            rotated[x].push(
                oldMatrix[y][x]
            );
        }
    }


    /* 正常旋转 */

    if (
        !tetrisCollision(
            currentPiece,
            0,
            0,
            rotated
        )
    ) {

        currentPiece.matrix =
            rotated;
    }


    /* 贴墙时尝试向左 */

    else if (
        !tetrisCollision(
            currentPiece,
            -1,
            0,
            rotated
        )
    ) {

        currentPiece.x--;

        currentPiece.matrix =
            rotated;
    }


    /* 贴墙时尝试向右 */

    else if (
        !tetrisCollision(
            currentPiece,
            1,
            0,
            rotated
        )
    ) {

        currentPiece.x++;

        currentPiece.matrix =
            rotated;
    }

    drawTetris();
}


/* 直接落下 */

function hardDropTetris() {

    if (!tetrisRunning) {
        return;
    }

    let distance = 0;


    while (
        !tetrisCollision(
            currentPiece,
            0,
            1,
            currentPiece.matrix
        )
    ) {

        currentPiece.y++;

        distance++;
    }


    /* 硬降奖励 */

    tetrisScore +=
        distance * 2;

    updateTetrisScore();


    lockTetrisPiece();

    clearTetrisLines();

    spawnTetrisPiece();

    drawTetris();
}


/* 锁定方块 */

function lockTetrisPiece() {

    const matrix =
        currentPiece.matrix;

    for (
        let y = 0;
        y < matrix.length;
        y++
    ) {

        for (
            let x = 0;
        x < matrix[y].length;
        x++
        ) {

            if (!matrix[y][x]) {
                continue;
            }

            const boardY =
                currentPiece.y + y;

            const boardX =
                currentPiece.x + x;


            if (
                boardY >= 0 &&
                boardY < TETRIS_ROWS &&
                boardX >= 0 &&
                boardX < TETRIS_COLS
            ) {

                tetrisBoard[boardY][boardX] =
                    currentPiece.name;
            }
        }
    }
}


/* 消除完整行 */

function clearTetrisLines() {

    let lines = 0;


    for (
        let y = TETRIS_ROWS - 1;
        y >= 0;
        y--
    ) {

        const full =
            tetrisBoard[y].every(
                cell => cell !== null
            );


        if (full) {

            tetrisBoard.splice(
                y,
                1
            );

            tetrisBoard.unshift(
                new Array(
                    TETRIS_COLS
                ).fill(null)
            );

            lines++;

            y++;
        }
    }


    if (lines > 0) {

        const scoreTable = {

            1: 100,

            2: 300,

            3: 500,

            4: 800
        };


        tetrisScore +=
            (
                scoreTable[lines] ||
                800
            ) *
            tetrisLevel;


        tetrisLevel =
            Math.floor(
                tetrisScore / 1000
            ) + 1;


        updateTetrisScore();
    }
}


/* 更新分数 */

function updateTetrisScore() {

    document.getElementById(
        "tetrisScore"
    ).textContent =
        tetrisScore;


    document.getElementById(
        "tetrisLevel"
    ).textContent =
        tetrisLevel;
}


/* 绘制俄罗斯方块 */

function drawTetris() {

    const cellWidth =
        tetrisCanvas.width /
        TETRIS_COLS;

    const cellHeight =
        tetrisCanvas.height /
        TETRIS_ROWS;


    /* 背景 */

    tetrisCtx.fillStyle =
        "#020617";

    tetrisCtx.fillRect(
        0,
        0,
        tetrisCanvas.width,
        tetrisCanvas.height
    );


    /* 网格 */

    tetrisCtx.strokeStyle =
        "rgba(255,255,255,0.035)";

    tetrisCtx.lineWidth = 1;


    for (
        let x = 0;
        x <= TETRIS_COLS;
        x++
    ) {

        tetrisCtx.beginPath();

        tetrisCtx.moveTo(
            x * cellWidth,
            0
        );

        tetrisCtx.lineTo(
            x * cellWidth,
            tetrisCanvas.height
        );

        tetrisCtx.stroke();
    }


    for (
        let y = 0;
        y <= TETRIS_ROWS;
        y++
    ) {

        tetrisCtx.beginPath();

        tetrisCtx.moveTo(
            0,
            y * cellHeight
        );

        tetrisCtx.lineTo(
            tetrisCanvas.width,
            y * cellHeight
        );

        tetrisCtx.stroke();
    }


    /* 已落下的方块 */

    for (
        let y = 0;
        y < TETRIS_ROWS;
        y++
    ) {

        for (
            let x = 0;
            x < TETRIS_COLS;
            x++
        ) {

            if (
                tetrisBoard[y][x]
            ) {

                drawTetrisCell(
                    tetrisCtx,
                    x,
                    y,
                    tetrisBoard[y][x],
                    cellWidth,
                    cellHeight
                );
            }
        }
    }


    /* 当前方块 */

    if (currentPiece) {

        const matrix =
            currentPiece.matrix;


        for (
            let y = 0;
            y < matrix.length;
            y++
        ) {

            for (
                let x = 0;
                x < matrix[y].length;
                x++
            ) {

                if (!matrix[y][x]) {
                    continue;
                }


                const boardX =
                    currentPiece.x + x;

                const boardY =
                    currentPiece.y + y;


                if (boardY >= 0) {

                    drawTetrisCell(
                        tetrisCtx,
                        boardX,
                        boardY,
                        currentPiece.name,
                        cellWidth,
                        cellHeight
                    );
                }
            }
        }
    }
}


/* 绘制一个俄罗斯方块格子 */

function drawTetrisCell(
    ctx,
    x,
    y,
    name,
    width,
    height
) {

    const color =
        TETRIS_COLORS[name];

    ctx.fillStyle = color;


    ctx.fillRect(
        x * width + 1,
        y * height + 1,
        width - 2,
        height - 2
    );


    /* 高光 */

    ctx.fillStyle =
        "rgba(255,255,255,0.25)";


    ctx.fillRect(
        x * width + 2,
        y * height + 2,
        width - 4,
        Math.max(
            2,
            height * 0.12
        )
    );


    /* 边缘 */

    ctx.strokeStyle =
        "rgba(0,0,0,0.25)";

    ctx.lineWidth = 1;


    ctx.strokeRect(
        x * width + 1,
        y * height + 1,
        width - 2,
        height - 2
    );
}


/* 绘制下一个方块 */

function drawNextPiece() {

    nextCtx.fillStyle =
        "#1e293b";

    nextCtx.fillRect(
        0,
        0,
        nextCanvas.width,
        nextCanvas.height
    );


    if (!nextPiece) {
        return;
    }


    const matrix =
        nextPiece.matrix;

    const cell = 20;


    const width =
        matrix[0].length * cell;

    const height =
        matrix.length * cell;


    const offsetX =
        (
            nextCanvas.width -
            width
        ) / 2;


    const offsetY =
        (
            nextCanvas.height -
            height
        ) / 2;


    for (
        let y = 0;
        y < matrix.length;
        y++
    ) {

        for (
            let x = 0;
            x < matrix[y].length;
            x++
        ) {

            if (!matrix[y][x]) {
                continue;
            }


            const color =
                TETRIS_COLORS[
                    nextPiece.name
                ];


            nextCtx.fillStyle =
                color;


            nextCtx.fillRect(
                offsetX +
                x * cell +
                1,

                offsetY +
                y * cell +
                1,

                cell - 2,
                cell - 2
            );
        }
    }
}


/* 俄罗斯方块游戏结束 */

function tetrisGameOver() {

    stopTetris();

    document.getElementById(
        "tetrisFinalScore"
    ).textContent =
        tetrisScore;


    document.getElementById(
        "tetrisGameOver"
    ).classList.add("show");
}


/* 重新开始 */

function restartTetris() {

    document.getElementById(
        "tetrisGameOver"
    ).classList.remove("show");

    initTetris();
}


/* =========================================================
   俄罗斯方块手机按键
   ========================================================= */

document.querySelectorAll(
    ".tetris-controls [data-tetris]"
).forEach(button => {

    button.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            const action =
                this.dataset.tetris;


            if (action === "left") {

                moveTetrisHorizontal(-1);

            } else if (action === "right") {

                moveTetrisHorizontal(1);

            } else if (action === "down") {

                moveTetrisDown();

            } else if (action === "rotate") {

                rotateTetrisPiece();

            } else if (action === "drop") {

                hardDropTetris();
            }
        }
    );
});


/* =========================================================
   键盘控制
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        const key = event.key;


        /* =========================
           贪吃蛇
           ========================= */

        if (
            snakeScreen.classList.contains("active") &&
            snakeRunning
        ) {

            if (key === "ArrowUp") {

                event.preventDefault();

                changeSnakeDirection({
                    x: 0,
                    y: -1
                });

                return;
            }


            if (key === "ArrowDown") {

                event.preventDefault();

                changeSnakeDirection({
                    x: 0,
                    y: 1
                });

                return;
            }


            if (key === "ArrowLeft") {

                event.preventDefault();

                changeSnakeDirection({
                    x: -1,
                    y: 0
                });

                return;
            }


            if (key === "ArrowRight") {

                event.preventDefault();

                changeSnakeDirection({
                    x: 1,
                    y: 0
                });

                return;
            }
        }


        /* =========================
           俄罗斯方块
           ========================= */

        if (
            tetrisScreen.classList.contains("active") &&
            tetrisRunning
        ) {

            if (key === "ArrowLeft") {

                event.preventDefault();

                moveTetrisHorizontal(-1);

            } else if (key === "ArrowRight") {

                event.preventDefault();

                moveTetrisHorizontal(1);

            } else if (key === "ArrowDown") {

                event.preventDefault();

                moveTetrisDown();

            } else if (key === "ArrowUp") {

                event.preventDefault();

                rotateTetrisPiece();

            } else if (key === " ") {

                event.preventDefault();

                hardDropTetris();
            }
        }

    }
);


/* =========================================================
   防止手机游戏时页面滑动
   ========================================================= */

document.addEventListener(
    "touchmove",
    function (event) {

        if (
            snakeScreen.classList.contains("active") ||
            tetrisScreen.classList.contains("active")
        ) {

            if (
                event.target.closest(
                    ".mobile-controls"
                )
            ) {

                event.preventDefault();
            }
        }

    },
    {
        passive: false
    }
);
