class Vec2 {
    constructor(x = 0,y = 0) {
        this.x = x;
        this.y = y;
    }
    rotate(deg) {
        const new_x = this.x * cos(deg) + this.y * sin(deg);
        const new_y = -this.x * sin(deg) + this.y * cos(deg);
        this.x = new_x;
        this.y = new_y;
    }
    randomize(n) {
        const dir = Math.random() * 2 - 1;
        this.x += dir * n;
        this.y += Math.sqrt(1 - dir * dir) * n * (Math.random() >= 0.5 ? 1 : -1);
    }
    clampMagnitude(max_val) {
        let size = max_val / Math.sqrt(this.x * this.x + this.y * this.y);
        if (size < 1) {
            this.x *= size;
            this.y *= size;
        }
    }
    resize(new_size) {
        let size = new_size / Math.sqrt(this.x * this.x + this.y * this.y);
        this.x *= size;
        this.y *= size;
    }
    sizeSq() {
        return (this.x * this.x + this.y * this.y);
    }
};

let settings = {
    'grid': {
        'color': '#6d6c56',
        'lineWidth': 5,
        'bombColor': '#dda096',
        'highlightColor': '#abc0d8'
    }
};

let mousePos = new Vec2();

let canvas = document.getElementById('screen');
let cols = 8;
let rows = 6;
let blockSize = 100;
canvas.width = cols * blockSize;
canvas.height = rows * blockSize;

canvas.style.backgroundColor = '#b2b097'
let screen = canvas.getContext('2d');
const canvas_rect = canvas.getBoundingClientRect();

let xmark = document.getElementById('xmark');

canvas.addEventListener('mousedown', mousedown);
canvas.addEventListener('mousemove', mousemove);

function mousemove(e) {
    mousePos.x = e.clientX - Math.floor(canvas_rect.left) - 5, 
    mousePos.y = e.clientY - Math.floor(canvas_rect.top) - 5;
}

//------------------------------------------------------

let board = [];
for(let i = rows*cols; i > 0; i --) {
    board.push(false);
}
let dp = [];
for(let i = pw2(rows+cols+2); i > 0; i --) {
    dp.push(-2);
}
dp[pw2(rows)-1] = -3;

function sqr(n) {return n*n;}
function pw2(n) {
    if(n == 1) {return 2;}
    return sqr(pw2(Math.floor(n/2)))*(n % 2 ? 2 : 1);
}

function encode(b) {
    let res = 0;
    let x = cols;
    let y = 0;
    let pow = 1;
    for(let i = 0; ; i ++) {
        if(x == 0) {
            while(y <= rows-1) {
                res += pow;
                pow *= 2;
                y ++;
            }
            return res;
        }
        if(y == rows) {
            return res;
        }
        if(b[x-1+y*cols]) {
            res += pow;
            y ++;
        } else {
            x --;
        }
        pow *= 2;
    }
}

function getNextMove(b) {
    let encoding = encode(b);
    if(dp[encoding] != -2) {
        return dp[encoding];
    };
    let nb = {};
    for(let i = 0; i < cols*rows; i ++) {nb[i] = b[i];}
    for(let r = 0; r < rows; r ++) {
        for(let i = 0; i < cols*r; i ++) {nb[i] = b[i];}
        for(let c = 0; c < cols; c ++) {
            if(b[c + r*cols]) { continue; }
            for(let ri = 0; ri <= r; ri ++) {nb[c + ri*cols] = true;}
            if(getNextMove(nb) == -1) {
                dp[encoding] = c+r*cols;
                return c+r*cols;
            }
        }
    }
    dp[encoding] = -1;
    return -1;
}

//------------------------------------------------------

let lastMove;
function mousedown() {
    let xBlock = Math.floor(mousePos.x/blockSize);
    let yBlock = Math.floor(mousePos.y/blockSize);
    let clickedBlock = xBlock + yBlock * cols;
    if(clickedBlock == cols*rows-1) {
        for(let i = rows*cols-1; i >= 0; i --) {board[i] = false;}
        clearScreen();
        lastMove = getNextMove(board);
        fillBoard(lastMove);
    } else if(!board[clickedBlock]) {
        fillBoard(xBlock, yBlock);
        lastMove = getNextMove(board);
        fillBoard(lastMove);
    }
    drawBoard(lastMove);
    console.log(lastMove);
}

function fillBoard(...args) {
    let x,y;
    if(args.length == 1) {
        x = args[0]%cols;
        y = Math.floor(args[0]/cols);
    } else {
        x = args[0];
        y = args[1];
    }
    for(let i = 0; i <= x; i ++) {
        for(let j = 0; j <= y; j ++) {
            board[i+j*cols] = true;
        }
    }
}

drawBoard();

function strokeLine(pos1, pos2, width, color='#000000') {
    screen.strokeStyle = color
    screen.lineWidth = width
    screen.beginPath()
    screen.moveTo(pos1[0],pos1[1])
    screen.lineTo(pos2[0],pos2[1])
    screen.stroke()
}

function clearScreen() {
    screen.clearRect(0,0,canvas.width,canvas.height);
}

function drawGrid() {
    for(let x = blockSize; x < canvas.width; x += blockSize) {
        screen.strokeStyle = settings.grid.color;
        screen.lineWidth = settings.grid.lineWidth;
        screen.beginPath();
        screen.moveTo(x,0);
        screen.lineTo(x,canvas.height);
        screen.stroke();
    }
    for(let y = blockSize; y < canvas.height; y += blockSize) {
        screen.strokeStyle = settings.grid.color;
        screen.lineWidth = settings.grid.lineWidth;
        screen.beginPath();
        screen.moveTo(0,y);
        screen.lineTo(canvas.width,y);
        screen.stroke();
    }
}

function drawBoard(...args) {
    clearScreen();
    if(args.length == 1) {
        screen.fillStyle = settings.grid.highlightColor;
        screen.fillRect((args[0]%cols)*blockSize,(Math.floor(args[0]/cols))*blockSize,blockSize,blockSize);
    }
    screen.fillStyle = settings.grid.bombColor;
    screen.fillRect((cols-1)*blockSize,(rows-1)*blockSize,blockSize,blockSize);
    drawGrid();
    for(let x = 0; x < cols; x ++) {
        for(let y = 0; y < rows; y ++) {
            if(board[x + y*cols]) {
                screen.drawImage(xmark, x*blockSize, y*blockSize, blockSize, blockSize);
            }
        }
    }
}

function is_digit(c) { 
    return /\d/.test(c); 
}

setTimeout(function() {
    lastMove = getNextMove(board);
    fillBoard(lastMove);
    drawBoard(lastMove);
},100);