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
    distSqTo(vec) {
        return ((this.x-vec.x) * (this.x-vec.x) + (this.y-vec.y) * (this.y-vec.y));
    }
    toArray() {
        return [this.x, this.y];
    }
};


function posInRect(pos,rect) {
    return (rect[0] < pos[0] && pos[0] < rect[0] + rect[2] && rect[1] < pos[1] && pos[1] < rect[1] + rect[3]);
}
function addVec(v1, v2) {
    return [v1[0]+v2[0],v1[1]+v2[1]];
}
function subVec(v1, v2) {
    return [v1[0]-v2[0],v1[1]-v2[1]];
}
function mulVec(l,v) {
    return [l*v[0], l*v[1]];
}
function size(v) {
    return Math.sqrt(v[0]*v[0]+v[1]*v[1]);
}
function dirVec(v) {
    return resizeVec(1,v);
}
function resizeVec(l, v) {
    return mulVec(l/size(v),v);
}

function lineIntersectRect(line, rect) {
    let [x,y,w,h] = rect;
    let [a,b] = line;


    if(a[0] == b[0]) {
        return ((x < a[0]) && (a[0] < x + w) && ((a[1] < y && b[1] > y + h) || (b[1] < y && a[1] > y + h)));
    }
    if(a[1] == b[1]) {
        return ((y < a[1]) && (a[1] < y + h) && ((a[0] < x && b[0] > x + w) || (b[0] < x && a[0] > x + w)));
    }
    // if obviously not intersecting:
    if(x > Math.max(a[0],b[0])) {
        return false;
    }
    if(x+w < Math.min(a[0],b[0])) {
        return false;
    }
    if(y > Math.max(a[1],b[1])) {
        return false;
    }
    if(y+h < Math.min(a[1],b[1])) {
        return false;
    }
    leftY = yAt(line, x);
    rightY = yAt(line, x + w);
    upperX = xAt(line, y);
    lowerX = xAt(line, y + h);
    return (((y < leftY) && (leftY < y + h)) || ((y < rightY) && (rightY < y + h)) || ((x < upperX) && (upperX < x + w)) || ((x < lowerX) && (lowerX < x + w)));
}
function circleIntersectRect(circle, rect) {
    let [x, y, r] = circle;
    let [rx, ry, rw, rh] = rect;
    
    if(ry < y && y < ry + rh) {
        if(Math.abs(x-rx) < r) {
            return true;
        }
        if(Math.abs(x-rx-rw) < r) {
            return true;
        }
        return false;
    }

    if(rx < x && x < rx + rw) {
        if(Math.abs(y-ry) < player_radius) {
            return true;
        }
        if(Math.abs(y-ry-rh) < player_radius) {
            return true;
        }
        return false;
    }

    if(size(x-rx, y-ry) < player_radius || size(x-rx-rw, y-ry) < player_radius || size(x-rx-rw, y-ry-rh) < player_radius || size(x-rx, y-ry-rh) < player_radius) {
        return true;
    }
    return false;
}

function yAt(line, x) {
    let [a, b] = line;
    return a[1] + (b[1] - a[1])/(b[0]-a[0])*(x-a[0]);
}
function xAt(line, y) {
    let [a, b] = line;
    return a[0] + (b[0]-a[0])/([b[1]-a[1]])*(y-a[1]);
}


function isDigit(c) { 
    return /\d/.test(c); 
}



function drawRotated(image, x, y, degrees){
    screen.save();
    screen.translate(x,y);
    screen.rotate(degrees*Math.PI/180);
    screen.drawImage(image,-image.width/2,-image.height/2);
    screen.restore();
}


function strokeLine(pos1, pos2, width, color='#000000') {
    screen.strokeStyle = color
    screen.lineWidth = width
    screen.beginPath()
    screen.moveTo(pos1[0],pos1[1])
    screen.lineTo(pos2[0],pos2[1])
    screen.stroke()
}

function fillRect(x, y, dx, dy, color) {
    screen.fillStyle = color
    screen.fillRect(x,y,dx,dy)
}

function strokeRect(x, y, dx, dy, color, lineWidth) {
    screen.strokeStyle = color
    screen.lineWidth = lineWidth
    screen.strokeRect(x,y,dx,dy)
}

function drawRect(x, y, dx, dy, fillColor, strokeColor, lineWidth) {
    fillRect(x,y,dx,dy,fillColor)
    strokeRect(x,y,dx,dy,strokeColor, lineWidth)
}

function fillText(text, font, fillStyle, x, y) {
    screen.font = font
    screen.fillStyle = fillStyle
    screen.fillText(text, x, y)
}

function drawText(text, font, fillStyle, strokeStyle, lineWidth, x, y) {
    screen.font = font
    screen.fillStyle = fillStyle
    screen.strokeStyle = strokeStyle
    screen.lineWidth = lineWidth
    screen.fillText(text, x, y)
    screen.strokeText(text, x, y)
}

function drawRoundedRect(x, y, dx, dy, r, fillColor, strokeColor, lineWidth) {
    screen.fillStyle = fillColor
    screen.strokeStyle = strokeColor
    screen.lineWidth = lineWidth
    screen.beginPath()
    screen.moveTo(x + r, y)
    screen.lineTo(x + dx - r, y)
    screen.quadraticCurveTo(x + dx, y, x + dx, y + r)
    screen.lineTo(x + dx, y + dy - r)
    screen.quadraticCurveTo(x + dx, y + dy, x + dx - r, y + dy)
    screen.lineTo(x + r, y + dy)
    screen.quadraticCurveTo(x, y + dy, x, y + dy - r)
    screen.lineTo(x, y + r)
    screen.quadraticCurveTo(x, y, x + r, y)
    screen.closePath()
    screen.fill()
    screen.stroke()
}

function drawCircle(x,y,r,fillColor, strokeColor, lineWidth) {
    screen.fillStyle = fillColor
    screen.strokeStyle = strokeColor
    screen.lineWidth = lineWidth
    screen.beginPath()
    screen.arc(x, y, r, 0, 2 * Math.PI)
    screen.stroke()
    screen.fill()
}
