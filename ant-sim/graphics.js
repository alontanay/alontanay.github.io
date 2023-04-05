function fillRect(x, y, dx, dy, color) {
    screen.fillStyle = color;
    screen.fillRect(x, y, dx, dy);
}

function strokeRect(x, y, dx, dy, color, lineWidth) {
    screen.strokeStyle = color;
    screen.lineWidth = lineWidth;
    screen.strokeRect(x, y, dx, dy);
}

function drawRect(x, y, dx, dy, fillColor, strokeColor, lineWidth) {
    fillRect(x, y, dx, dy, fillColor);
    strokeRect(x, y, dx, dy, strokeColor, lineWidth);
}

function fillText(text, font, fillStyle, x, y) {
    screen.font = font;
    screen.fillStyle = fillStyle;
    screen.fillText(text, x, y);
}

function drawText(text, font, fillStyle, strokeStyle, lineWidth, x, y) {
    screen.font = font;
    screen.fillStyle = fillStyle;
    screen.strokeStyle = strokeStyle;
    screen.lineWidth = lineWidth;
    screen.fillText(text, x, y);
    screen.strokeText(text, x, y);
}

function fillCircle(x, y, r, fillColor) {
    screen.fillStyle = fillColor;
    screen.beginPath();
    screen.arc(x, y, r, 0, 2 * Math.PI);
    screen.fill();
}

function drawCircle(x, y, r, fillColor, strokeColor, lineWidth) {
    screen.fillStyle = fillColor;
    screen.strokeStyle = strokeColor;
    screen.lineWidth = lineWidth;
    screen.beginPath();
    screen.arc(x, y, r, 0, 2 * Math.PI);
    screen.stroke();
    screen.fill();
}
function drawCircleSlice(x, y, r, sAngle, eAngle, fillColor, strokeColor, lineWidth) {
    screen.fillStyle = fillColor;
    screen.strokeStyle = strokeColor;
    screen.lineWidth = lineWidth;
    screen.beginPath();
    screen.arc(x, y, r, sAngle, eAngle);
    screen.lineTo(x,y);
    screen.closePath();
    screen.stroke();
    screen.fill();
}

function clearScreen() {
    fillRect(0, 0, 1000, 600, BACKGROUND_COLOR);
}