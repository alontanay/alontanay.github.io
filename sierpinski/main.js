const ZOOM_TICK_MSS = 20;
const SINGLE_ZOOM_DELAY = 500;
const ZOOM_SPEED = 1.048;

const RADIUS_RECURSION_LIMIT = 1;
const LINE_WIDTH = 0.5;

const sqrt3 = Math.sqrt(3);

let canvas = document.getElementById('canvas');
let displayDiv = document.getElementById('display');


let screen = canvas.getContext('2d');
let canvasBound = canvas.getBoundingClientRect();
screen.lineWidth = 0.1;


// View ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let view = {
    left: -1,
    top: -1.25,
    width: 2,
    height: 2
};
function resizeCanvas() {
    let coefWidth = canvas.width;
    let coefHeight = canvas.height;
    canvas.height = document.documentElement.scrollHeight - 150;
    canvas.width = document.documentElement.scrollWidth * 0.8;
    coefWidth /= canvas.width;
    coefHeight /= canvas.height;
    displayDiv.style.width = `${canvas.getBoundingClientRect().width}px`;
    displayDiv.style.height = `${canvas.getBoundingClientRect().height}px`;
    let relSize = Math.max(view.width / canvas.width, view.height / canvas.height);
    resizeViewCentered(relSize * canvas.width, relSize * canvas.height);
    drawSierpinski();
    // let initViewHeight = Math.max(2.0, 1.4 * canvas.height / canvas.width);
    // let initViewWidth = initViewHeight * canvas.width / canvas.height;
    // let view = {
    //     left: 0,
    //     top: 1 / 4,
    //     width: 0,
    //     height: 0
    // };
}
resizeCanvas();

function resizeViewCentered(width, height) {
    view.left += view.width / 2 - width / 2;
    view.top += view.height / 2 - height / 2;
    view.width = width;
    view.height = height;
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.onresize = resizeCanvas;

function crossProduct(vec1, vec2) {
    return vec1.y * vec2.x - vec1.x * vec2.y;
}

function calcViewX(x) {
    return (x - view.left) / view.width * canvas.width;
}
function calcViewY(y) {
    return (y - view.top) / view.height * canvas.height;
}

function clearScreen() {
    screen.fillStyle = 'white';
    screen.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSierpinskiRec(center = { x: 0, y: 0 }, radius = 1.0) {
    // stop if outside view:

    // screen.beginPath();
    // screen.arc(calcViewX(center.x), calcViewY(center.y), 2, 0, 2 * Math.PI);
    // screen.fillStyle = 'red';
    // screen.fill();
    if (center.y + radius / 2 < view.top) { return; } // above
    if (center.y - radius > view.top + view.height) { return; } // below
    if (center.x + sqrt3 * radius / 2 < view.left) { return; } // left
    if (center.x - sqrt3 * radius / 2 > view.left + view.width) { return; } // right
    // console.log('    passed simple bound');
    let cornerVec = { x: 1, y: sqrt3 };
    if (crossProduct(cornerVec, { x: center.x - view.left, y: center.y - radius - view.top - view.height }) < 0) { return; } // bottom-left
    cornerVec.x = -cornerVec.x;
    if (crossProduct(cornerVec, { x: center.x - view.left - view.width, y: center.y - radius - view.top - view.height }) > 0) { return; } // bottom-right

    if (radius * canvas.width / view.width <= RADIUS_RECURSION_LIMIT) {
        screen.strokeStyle = 'black';
        screen.lineWidth = LINE_WIDTH;
        screen.beginPath();
        screen.moveTo(calcViewX(center.x), calcViewY(center.y - radius));
        screen.lineTo(calcViewX(center.x + radius * sqrt3 / 2), calcViewY(center.y + radius / 2));
        screen.lineTo(calcViewX(center.x - radius * sqrt3 / 2), calcViewY(center.y + radius / 2));
        screen.closePath();
        screen.stroke();
        return;
    }
    drawSierpinskiRec({ x: center.x, y: center.y - radius / 2 }, radius / 2);
    drawSierpinskiRec({ x: center.x + radius * sqrt3 / 4, y: center.y + radius / 4 }, radius / 2);
    drawSierpinskiRec({ x: center.x - radius * sqrt3 / 4, y: center.y + radius / 4 }, radius / 2);
}

function drawSierpinski() {
    clearScreen();
    drawSierpinskiRec({ x: 0, y: 0 }, 1);
}

// window.requestAnimationFrame(drawSierpinski);

function drawView() {

    const S = 100;
    screen.fillStyle = 'white';
    screen.fillRect(0, 0, canvas.width, canvas.height);
    screen.lineWidth = 2;
    screen.strokeStyle = 'black';
    let box = {
        left: canvas.width / 2 - S,
        top: canvas.height / 2 - S,
        width: 2 * S,
        height: 2 * S
    }
    screen.strokeRect(box.left, box.top, box.width, box.height);
    let viewPos = {
        left: box.left + box.width * (view.left + 2) / 4,
        top: box.top + box.height * (view.top + 2) / 4,
        width: box.width * view.width / 4,
        height: box.height * view.height / 4
    }
    screen.fillStyle = 'red';
    screen.globalAlpha = 0.5;
    screen.fillRect(viewPos.left, viewPos.top, viewPos.width, viewPos.height);
    screen.strokeRect(viewPos.left, viewPos.top, viewPos.width, viewPos.height);
    screen.globalAlpha = 1;

    // screen.beginPath();
    // screen.arc(view[0], view[1], 2, 0, 2 * Math.PI);
    // screen.fillStyle = 'red';
    // screen.fill();
}

// Zoom ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let zoomCoef;
let smoothZoomTimeout;
let zoomInterval;
let zoomStart;
let lastTime;
function zoomTick() {
    let timeNow = performance.now();
    let curZoomCoef = lastTime ? zoomCoef ** ((timeNow-lastTime) / ZOOM_TICK_MSS) : zoomCoef;
    lastTime = timeNow;
    resizeViewCentered(view.width*curZoomCoef,view.height*curZoomCoef);
    // let newWidth = view.width * curZoomCoef;
    // let newHeight = view.height * curZoomCoef;
    // view.left += view.width / 2 - newWidth / 2;
    // view.top += view.height / 2 - newHeight / 2;
    // view.width = newWidth;
    // view.height = newHeight;
    clearScreen();
    drawSierpinski();
}
function startZoom(zoomIn) {
    console.log('start');
    zoomCoef = zoomIn ? 1 / ZOOM_SPEED : ZOOM_SPEED;
    lastTime = undefined;
    zoomTick();
    smoothZoomTimeout = setTimeout(() => {
        lastTime = undefined;
        zoomInterval = setInterval(zoomTick, ZOOM_TICK_MSS);
    }, SINGLE_ZOOM_DELAY
    );
}
function stopZoom() {
    console.log('stop');
    clearTimeout(smoothZoomTimeout);
    clearInterval(zoomInterval);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


let dragging = false;
let mousePos = [0, 0];
function mouseMove(event) {
    canvasBound = canvas.getBoundingClientRect();
    let newMousePos = [event.clientX - canvasBound.left, event.clientY - canvasBound.top];
    if (dragging) {
        view.left -= (newMousePos[0] - mousePos[0]) * view.width / canvasBound.width;
        view.top -= (newMousePos[1] - mousePos[1]) * view.height / canvasBound.height;
        clearScreen();
        drawSierpinski();
    }
    mousePos = newMousePos;
}

function mouseDown() {
    if(mousePos[0] < 0 || mousePos[0] > canvas.width || mousePos[1] < 0 || mousePos[1] > canvas.height) {
        return;
    }
    dragging = true;
    canvas.style.cursor = 'grabbing';
}
function mouseUp() {
    dragging = false;
    canvas.style.cursor = 'grab';
}

document.body.addEventListener('mousemove', mouseMove);
document.body.addEventListener('mousedown', mouseDown);
document.body.addEventListener('mouseup', mouseUp);

function keyUp(event) {
    if (!['-', '+', '=', '_'].includes(event.key)) { return; }
    if ((zoomCoef < 1) ^ (event.key == '-')) {
        console.log('hi');
        stopZoom();
    }

}

function keyDown(event) {
    if (event.repeat) { return; }
    if (!['-', '+', '=', '_'].includes(event.key)) { return; }
    stopZoom();
    startZoom(event.key == '+' || event.key == '=');
}
let zoomedViaButton = false;
document.body.addEventListener('mouseup', () => { if (zoomedViaButton) stopZoom(); });
document.body.addEventListener('keydown', keyDown);
document.body.addEventListener('keyup', keyUp)