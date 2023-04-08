console.log('hi :)')

let canvas = document.getElementById('canvas');
let screen = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 600;

let toggles = {};

toggles['separate_shadows'] = document.getElementById('vis-shadows-separately');
toggles['shadow_ranges'] = document.getElementById('vis-shadow-ranges');
toggles['shadow_line'] = document.getElementById('vis-mid-shadow');
toggles['blister_range'] = document.getElementById('vis-blister-range');
toggles['speed'] = document.getElementById('speed');

class Line {
    constructor(x,y1,y2,color='black',lineWidth=5) {
        this.x = x;
        this.y1 = y1;
        this.y2 = y2;
        this.color = color;
        this.lineWidth = lineWidth;
    }
    draw() {
        screen.strokeStyle = this.color;
        screen.lineWidth = this.lineWidth;
        screen.beginPath();
        screen.moveTo(this.x,this.y1);
        screen.lineTo(this.x,this.y2);
        screen.stroke();
    }
}

let wallColor = 'white';

let up = true;
let speed = 1;
let yLwBound = 200;
let yUpBound = 400;

let source = new Line(800,canvas.height/2-100,canvas.height/2+100,'yellow');
let wall = new Line(200,0,canvas.height,wallColor);
let lower = new Line(400,0,280);
let upper = new Line(600,yUpBound,canvas.height);

function drawLines() {
    wall.draw();
    source.draw();
    lower.draw();
    upper.draw();
}

function drawDot(x,y,color='black',r=5) {
    screen.fillStyle = color;
    screen.beginPath();
    screen.arc(x, y, r, 0, 2 * Math.PI);
    screen.fill();
}

function drawGradLine(x1,y1,x2,y2,color='black',width=8) {
    let grad= screen.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, 'black');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    screen.lineWidth = width;
    screen.strokeStyle = grad;
    screen.beginPath();
    screen.moveTo(x1,y1);
    screen.lineTo(x2,y2);
    screen.stroke();
}

function drawLine(x1,y1,x2,y2,color='black',width=8) {
    screen.strokeStyle = color;
    screen.lineWidth = width;
    screen.beginPath();
    screen.moveTo(x1,y1);
    screen.lineTo(x2,y2);
    screen.stroke();
}

function cast(x1,y1,x2,y2,x3) {
    return y1 + (y2-y1)*(x3-x1)/(x2-x1);
}

function drawShadow() {
    let bndSrc = cast(lower.x,lower.y2,upper.x,upper.y1,source.x);
    // let bndSrc = lower.y2 + (upper.y1-lower.y2)*(source.x-lower.x)/(upper.x-lower.x);
    screen.strokeStyle = 'blue';
    screen.lineWidth = 7;

    if(bndSrc <= source.y1) {
        // no light
        drawLine(wall.x,0,wall.x,canvas.height);
    } else {
        let uy;
        if(bndSrc < source.y2) {
            // partial
            uy = bndSrc;
            if(toggles['shadow_line'].checked) { drawDot(source.x,uy,'orange',4); }
        } else {
            uy = source.y2;
        }
        let uPart = cast(source.x,uy,upper.x,upper.y1,wall.x);
        let uFull = cast(source.x,source.y1,upper.x,upper.y1,wall.x);

        let lFull = cast(source.x,uy,lower.x,lower.y2,wall.x);
        let lPart = cast(source.x,source.y1,lower.x,lower.y2,wall.x);
        if(bndSrc < source.y2) {
            if(toggles['shadow_line'].checked) {
                drawLine(wall.x,uPart,source.x,uy,'lime',1);
            }
            if(uPart > lower.y2 && toggles['blister_range'].checked) {
                drawLine(wall.x-10,uPart,wall.x-10,lower.y2,'red',3);
                drawLine(wall.x-10,uPart,wall.x-5,uPart,'red',3);
                drawLine(wall.x-10,lower.y2,wall.x-5,lower.y2,'red',3);
                
            }
        }
        drawGradLine(wall.x,uFull,wall.x,uPart);
        drawGradLine(wall.x,lFull,wall.x,lPart);
        
        drawLine(wall.x,uFull,wall.x,canvas.height);
        drawLine(wall.x,0,wall.x,lFull);
        
        if(toggles['shadow_ranges'].checked) {
            drawDot(wall.x,uPart,'lime');
            drawDot(wall.x,uFull,'green');
            drawDot(wall.x,lFull,'blue');
            drawDot(wall.x,lPart,'cyan');
        }
        // partial
    }
}

setInterval(()=>{
    screen.clearRect(0,0,canvas.width,canvas.height);
    screen.fillStyle = '#BA8C63';
    screen.fillRect(0,0,wall.x,canvas.height);
    let speed = (toggles['speed'].value-1)/20;
    // let speed = (1-(1/(1+(toggles['speed'].value-1)/10)))*2;
    if(up) {
        upper.y1 -= speed
        if(upper.y1 < yLwBound) {
            upper.y1 = yLwBound;
            up = false;
        }
    } else {
        upper.y1 += speed;
        if(upper.y1 > yUpBound) {
            upper.y1 = yUpBound;
            up = true;
        }
    }
    drawLines();
    drawShadow();
},40);