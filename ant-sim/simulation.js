function gen2dArray(rows, cols, map = () => { return undefined; }) {
    let res = new Array(rows);
    for (let row = 0; row < rows; row++) {
        res[row] = new Array(cols);
        for (let col = 0; col < cols; col++) {
            res[row][col] = map(row, col);
        }
    }
    return res;
}

class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    size() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    squaredSize() {
        return (this.x * this.x + this.y * this.y);
    }
    rotate(deg) {
        const newX = this.x * cos(deg) + this.y * sin(deg);
        const newY = -this.x * sin(deg) + this.y * cos(deg);
        this.x = newX;
        this.y = newY;
    }
    randomize(n) {
        const dir = Math.random() * 2 * Math.PI;
        let difVec = new Vec2(Math.cos(dir), Math.sin(dir));
        this.x += difVec.x * n;
        this.y += difVec.y * n;
    }
    clampMagnitude(maxSize) {
        if (this.size() == 0) { return; }
        let size = maxSize / this.size();
        if (size < 1) {
            this.x *= size;
            this.y *= size;
        }
    }
    resize(size) {
        if (this.size() == 0) { this.randomize(size); return; }
        let coef = size / this.size();
        this.x *= coef;
        this.y *= coef;
    }
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    calcDeg() {
        return Math.atan2(this.y, this.x);
    }
};

class Food {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    draw() {
        drawCircle(this.x, this.y, FOOD_STYLE.r, FOOD_STYLE.fillStyle, FOOD_STYLE.strokeStyle, FOOD_STYLE.lineWidth);
    }
    squaredDistTo(x, y) {
        return (this.x - x) * (this.x - x) + (this.y - y) * (this.y - y);
    }
}

class Ant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = new Vec2(Math.random() - 0.5, Math.random() - 0.5);
        this.desiredDirection = new Vec2(Math.random() - 0.5, Math.random() - 0.5);
        this.targetFood = null;
        this.carrying = false;
        this.lastMilestone = performance.now();
        this.lastPheromoneTime = performance.now();
    }
    squaredDistTo(x, y) {
        return (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y);
    }
    canSee(x, y, radius) {
        let dif = new Vec2(x - this.x, y - this.y);
        let angleDif = Math.abs(dif.calcDeg() - this.velocity.calcDeg());
        return this.squaredDistTo(x, y) <= radius * radius && (angleDif < SIGHT_RANGE || angleDif > 2 * Math.PI - SIGHT_RANGE)
    }
    seekPheromones(timeNow, pheromoneMap) {
        let avarage = new Vec2(0, 0);
        let totalAge = 0;
        for (let x = Math.round(Math.max((this.x - PHEROMONE_SENSOR_RADIUS), 0)); x < Math.round(Math.min(this.x + PHEROMONE_SENSOR_RADIUS, SCREEN_WIDTH)); x++) {
            for (let y = Math.round(Math.max(this.y - PHEROMONE_SENSOR_RADIUS, 0)); y < Math.round(Math.min(this.y + PHEROMONE_SENSOR_RADIUS, SCREEN_HEIGHT)); y++) {
                if (!this.canSee(x, y, PHEROMONE_SENSOR_RADIUS)) {
                    continue;
                }
                let pheromoneAge = (timeNow - pheromoneMap[x][y]) / PHEROMONE_LIFETIME;
                if (pheromoneAge <= 1 && ((this.x - x) * (this.x - x) + (this.y - y) * (this.y - y) <= PHEROMONE_SENSOR_RADIUS * PHEROMONE_SENSOR_RADIUS)) {
                    avarage.move(x * pheromoneAge, y * pheromoneAge);
                    totalAge += pheromoneAge;
                }
            }
        }
        if (totalAge == 0) { return }
        avarage.x /= totalAge;
        avarage.y /= totalAge;

        this.desiredDirection.x = avarage.x - this.x;
        this.desiredDirection.y = avarage.y - this.y;

        this.desiredDirection.resize(1);
    }
    seekColony(timeNow) {

        if (this.canSee(COLONY.x, COLONY.y, COLONY_SENSOR_RADIUS + COLONY.r) || this.squaredDistTo(COLONY.x, COLONY.y) <= COLONY.r * COLONY.r) {
            this.desiredDirection.x = COLONY.x - this.x;
            this.desiredDirection.y = COLONY.y - this.y;
            if (this.desiredDirection.squaredSize() <= COLONY.r * COLONY.r) {
                this.carrying = false;
                this.lastMilestone = timeNow;
                colonyCounter++;
            }

            this.desiredDirection.resize(1);
        } else {
            this.seekPheromones(timeNow, homePheromoneMap);
        }
    }

    seekFood(timeNow) {
        if (this.targetFood === null) {
            let bx = Math.floor(this.x / FOOD_SENSOR_RADIUS);
            let by = Math.floor(this.y / FOOD_SENSOR_RADIUS);

            for (let blockR = Math.max(0, bx - 1); blockR < Math.min(foodBlockRows, bx + 2) && this.targetFood === null; blockR++) {
                for (let blockC = Math.max(0, by - 1); blockC < Math.min(foodBlockCols, by + 2) && this.targetFood === null; blockC++) {
                    this.targetFood = foodBlocks[blockR][blockC].findAndRemove((food) => {
                        return this.canSee(food.x, food.y, FOOD_SENSOR_RADIUS);
                    });
                }
            }
            this.seekPheromones(timeNow, foodPheromoneMap);
        } else {
            this.desiredDirection.x = this.targetFood.x - this.x;
            this.desiredDirection.y = this.targetFood.y - this.y;

            if (this.desiredDirection.squaredSize() <= PICKUP_RADIUS * PICKUP_RADIUS) {
                this.targetFood = null;
                this.lastMilestone = timeNow;
                this.carrying = true;
                this.desiredDirection.randomize(1000);
            }
            this.desiredDirection.resize(1);
        }
    }

    update(deltaTime, timeNow) {
        if (this.carrying) {
            if (timeNow - this.lastMilestone <= PHEROMONE_STOP && (timeNow - this.lastPheromoneTime) >= PHEROMONE_INTERVAL) {
                this.lastPheromoneTime = timeNow;
                foodPheromoneMap[Math.floor(this.x)][Math.floor(this.y)] = timeNow;
            }
            this.seekColony(timeNow);
        } else {
            if (timeNow - this.lastMilestone <= PHEROMONE_STOP && (timeNow - this.lastPheromoneTime) >= PHEROMONE_INTERVAL) {
                this.lastPheromoneTime = timeNow;
                try {
                    homePheromoneMap[Math.floor(this.x)][Math.floor(this.y)] = timeNow - (timeNow - this.lastMilestone);
                } catch (e) {
                    console.log(this.x, this.y);
                }
            }
            this.seekFood(timeNow);
        }

        this.desiredDirection.randomize(WANDER_STRENGTH);
        this.desiredDirection.resize(1);

        let desiredForce = new Vec2((this.desiredDirection.x * MAX_SPEED - this.velocity.x) * STEER_STRENGTH, (this.desiredDirection.y * MAX_SPEED - this.velocity.y) * STEER_STRENGTH);
        desiredForce.clampMagnitude(STEER_STRENGTH);

        this.velocity.x += desiredForce.x * deltaTime;
        this.velocity.y += desiredForce.y * deltaTime;
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        if (this.x < 0) {
            this.x = 0;
            this.velocity.x *= -1;
            this.desiredDirection.x *= -1;
        } else if (this.x > SCREEN_WIDTH) {
            this.x = SCREEN_WIDTH;
            this.velocity.x *= -1;
            this.desiredDirection.x *= -1;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity.y *= -1;
            this.desiredDirection.y *= -1;
        } else if (this.y > SCREEN_HEIGHT) {
            this.y = SCREEN_HEIGHT;
            this.velocity.y *= -1;
            this.desiredDirection.y *= -1;
        }
    }

    draw() {
        let dirAngle = this.velocity.calcDeg();
        if (displaySettings.SHOW_COLONY_SENSOR) {
            screen.globalAlpha = 0.1;
            drawCircleSlice(this.x, this.y, COLONY_SENSOR_RADIUS, dirAngle - SIGHT_RANGE, dirAngle + SIGHT_RANGE, COLONY_SENSOR_STYLE.fillStyle, COLONY_SENSOR_STYLE.strokeStyle, COLONY_SENSOR_STYLE.lineWidth);
            screen.globalAlpha = 1;
        }
        if (displaySettings.SHOW_FOOD_SENSOR) {
            screen.globalAlpha = 0.2;
            drawCircleSlice(this.x, this.y, FOOD_SENSOR_RADIUS, dirAngle - SIGHT_RANGE, dirAngle + SIGHT_RANGE, FOOD_SENSOR_STYLE.fillStyle, FOOD_SENSOR_STYLE.strokeStyle, FOOD_SENSOR_STYLE.lineWidth);
            screen.globalAlpha = 1;
        }
        let widthVec = new Vec2(- this.velocity.y, this.velocity.x);
        widthVec.resize(ANT_STYLE.width / 2);
        let heightVec = this.velocity;
        heightVec.resize(ANT_STYLE.height / 2);
        screen.fillStyle = ANT_STYLE.fillStyle;
        screen.strokeStyle = ANT_STYLE.strokeStyle;
        screen.lineWidth = ANT_STYLE.lineWidth;

        screen.beginPath();
        screen.moveTo(this.x - widthVec.x - heightVec.x, this.y - widthVec.y - heightVec.y);
        screen.lineTo(this.x + widthVec.x - heightVec.x, this.y + widthVec.y - heightVec.y);
        screen.lineTo(this.x + widthVec.x + heightVec.x, this.y + widthVec.y + heightVec.y);
        screen.lineTo(this.x - widthVec.x + heightVec.x, this.y - widthVec.y + heightVec.y);
        screen.lineTo(this.x - widthVec.x - heightVec.x, this.y - widthVec.y - heightVec.y);
        screen.fill();
        screen.stroke();

        if (this.carrying) {
            drawCircle(this.x + heightVec.x, this.y + heightVec.y, FOOD_STYLE.r, FOOD_STYLE.fillStyle, FOOD_STYLE.strokeStyle, FOOD_STYLE.lineWidth);
        }
    }
};

let mousePos = new Vec2();
let pressingMouse = false, usingFoodBrush = false;
let lastFoodInsertion = performance.now();

let canvas = document.getElementById('screen');
let screen = canvas.getContext('2d');

// Simulation variables ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let ants, colonyCounter;

let foodBlockRows, foodBlockCols, foodBlocks;

let homePheromoneMap, foodPheromoneMap;

let lastTick = performance.now();

// Simulation methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function initSimulation() {
    canvas.height = SCREEN_HEIGHT;
    canvas.width = SCREEN_WIDTH;

    ants = [];
    colonyCounter = 0;

    homePheromoneMap = gen2dArray(SCREEN_WIDTH + 1, SCREEN_HEIGHT + 1);
    foodPheromoneMap = gen2dArray(SCREEN_WIDTH + 1, SCREEN_HEIGHT + 1);

    foodBlockRows = Math.ceil(SCREEN_WIDTH / FOOD_SENSOR_RADIUS);
    foodBlockCols = Math.ceil(SCREEN_HEIGHT / FOOD_SENSOR_RADIUS);

    foodBlocks = gen2dArray(foodBlockRows, foodBlockCols, () => { return new LinkedList(); });
}

function startSimulation(antCount) {
    for (let i = 0; i < antCount; i++) {
        ants.push(new Ant(COLONY.x, COLONY.y));
    }

    for (let x = 550, y = 540; x < 1000; x += 300, y -= 400) {
        for (let foodI = 0; foodI < 200; foodI++) {
            let dist = FOOD_INSERTION_RADIUS * Math.sqrt(Math.random());
            let angle = Math.random() * 2 * Math.PI;
            let foodX = x + dist * Math.cos(angle);
            let foodY = y + dist * Math.sin(angle);
            insertFood(foodX, foodY);
        }
    }

    let timeNow;

    let simInterval = setInterval(function () {
        clearScreen();
        timeNow = performance.now();

        for (let x = 0; x < SCREEN_WIDTH; x++) {
            for (let y = 0; y < SCREEN_HEIGHT; y++) {
                if (displaySettings.SHOW_HOME_PHEROMONES) {
                    if (timeNow - homePheromoneMap[x][y] < PHEROMONE_LIFETIME) {
                        screen.globalAlpha = ((PHEROMONE_LIFETIME + homePheromoneMap[x][y] - timeNow) / PHEROMONE_LIFETIME) / 2;
                        fillCircle(x, y, HOME_PHEROMONE_STYLE.r, HOME_PHEROMONE_STYLE.fillStyle);
                    }
                }
                if (displaySettings.SHOW_FOOD_PHEROMONES) {
                    if (timeNow - foodPheromoneMap[x][y] < PHEROMONE_LIFETIME) {
                        screen.globalAlpha = ((PHEROMONE_LIFETIME + foodPheromoneMap[x][y] - timeNow) / PHEROMONE_LIFETIME) / 2;
                        fillCircle(x, y, FOOD_PHEROMONE_STYLE.r, FOOD_PHEROMONE_STYLE.fillStyle);
                    }
                }
            }
        }

        screen.globalAlpha = 1;

        ants.forEach((ant) => {
            ant.update((timeNow - lastTick) / DELTA_TIME_CONSTANT, timeNow);
            ant.draw();
            if (ant.targetFood !== null) {
                ant.targetFood.draw();
            }
        });

        foodBlocks.forEach((column) => {
            column.forEach((block) => {
                block.findAndRemove((node) => {
                    node.draw();
                })
            })
        });

        drawCircle(COLONY.x, COLONY.y, COLONY.r, COLONY.fillStyle, COLONY.strokeStyle, COLONY.lineWidth);

        screen.textAlign = 'center';
        let textHeight = 70 - 12 * Math.floor(Math.log10(Math.max(1, colonyCounter)));
        drawText(colonyCounter, `${textHeight}px verdena`, 'white', 'white', 1, COLONY.x, COLONY.y + textHeight / 3);
        screen.textAlign = 'start';

        if (usingFoodBrush && pressingMouse) {
            while (timeNow - lastFoodInsertion > 0) {
                lastFoodInsertion += FOOD_INSERTION_INTERVAL;
                let dist = FOOD_INSERTION_RADIUS * Math.sqrt(Math.random());
                let angle = Math.random() * 2 * Math.PI;
                let foodX = mousePos.x + dist * Math.cos(angle);
                let foodY = mousePos.y + dist * Math.sin(angle);
                insertFood(foodX, foodY);
            }
        }

        lastTick = timeNow;
    }, TICK_LENGTH);
    return simInterval;
}
initSimulation();
let simInterval = startSimulation(100);

function insertFood(x, y) {
    foodBlocks[Math.floor(x / FOOD_SENSOR_RADIUS)][Math.floor(y / FOOD_SENSOR_RADIUS)].push(new Food(x, y));
}

// Binding simulation to page ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let brushPoint = document.getElementById('brush-point');
let brushSpray = document.getElementById('brush-spray');

function toggleFoodBrush() {
    if (usingFoodBrush) {
        brushPoint.style.zIndex = 2;
        brushSpray.style.zIndex = 1;
    } else {
        brushPoint.style.zIndex = 1;
        brushSpray.style.zIndex = 2;
    }
    usingFoodBrush = !usingFoodBrush;
}

function mousemove(e) {
    const canvasBoundingRect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - Math.floor(canvasBoundingRect.left) - 5;
    mousePos.y = e.clientY - Math.floor(canvasBoundingRect.top) - 5;
}

function mousedown() {
    pressingMouse = true;
    lastFoodInsertion = performance.now();
    if (!usingFoodBrush) {
        insertFood(mousePos.x, mousePos.y);
    }
}
function mouseup() {
    pressingMouse = false;
}

canvas.addEventListener('mousedown', mousedown);
canvas.addEventListener('mousemove', mousemove);
canvas.addEventListener('mouseup', mouseup);
