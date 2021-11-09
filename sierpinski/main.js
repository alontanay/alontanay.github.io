let canvas = document.getElementById('canvas');
canvas.width = 5000;
canvas.height = 5000;
let screen = canvas.getContext('2d');
screen.lineWidth = 0.1;
const sqrt3 = Math.sqrt(3) * 2;

const toHex = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
function grey(x) {
    x *= 255;
    return '#'+(toHex[Math.floor(x/16)]+toHex[Math.floor(x%16)]).repeat(3);
}

function drawTriangle(x,y,size) {
    screen.beginPath();
    screen.moveTo(x-size/2,y-size/sqrt3);
    screen.lineTo(x+size/2,y-size/sqrt3)
    screen.lineTo(x,y+2*size/sqrt3);
    screen.lineTo(x-size/2,y-size/sqrt3);
    screen.stroke();
    screen.fill();
}

function sierpinski(x,y,size,depth) {
    screen.beginPath();
    screen.moveTo(x-size/2,y+size/sqrt3);
    screen.lineTo(x+size/2,y+size/sqrt3)
    screen.lineTo(x,y-2*size/sqrt3);
    screen.lineTo(x-size/2,y+size/sqrt3);
    screen.stroke();
    recursive(x,y,size/2,depth);
}
function recursive(x,y,size,depth,maxDepth=depth-1) {
    if(depth == 1) { 
        screen.fillStyle = 'black';
        drawTriangle(x,y,size);
        return;
    }
    screen.fillStyle = grey((depth-1)/maxDepth);
    drawTriangle(x,y,size);
    recursive(x,y-2*size/sqrt3,size/2,depth-1,maxDepth);
    recursive(x+size/2,y+size/sqrt3,size/2,depth-1,maxDepth);
    recursive(x-size/2,y+size/sqrt3,size/2,depth-1,maxDepth);
}

sierpinski(canvas.width/2,2*canvas.height/sqrt3,canvas.width - 100,10);