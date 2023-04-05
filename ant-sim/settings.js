const SCREEN_HEIGHT = 600;
const SCREEN_WIDTH = 1000;

const FOOD_INSERTION_INTERVAL = 50;
const FOOD_INSERTION_RADIUS = 50;

const BACKGROUND_COLOR = '#977d60';

const ANT_STYLE = {
    width: 5,
    height: 10,
    fillStyle: 'black',
    strokeStyle: 'black',
    lineWidth: 1
};

const FOOD_STYLE = {
    r: 5,
    fillStyle: '#00FF00',
    strokeStyle: '#004400',
    lineWidth: 3
};

const HOME_PHEROMONE_STYLE = {
    r: 4,
    fillStyle: '#3135FF',
    strokeStyle: 'black',
    lineWidth: 1
};

const FOOD_PHEROMONE_STYLE = {
    r: 4,
    fillStyle: 'red',
    strokeStyle: 'black',
    lineWidth: 1
};

const FOOD_SENSOR_STYLE = {
    fillStyle: 'orange',
    strokeStyle: 'black',
    lineWidth: 3
};

const COLONY_SENSOR_STYLE = {
    fillStyle: 'yellow',
    strokeStyle: 'black',
    lineWidth: 3
};


const MAX_SPEED = 20;
const STEER_STRENGTH = 2;
const WANDER_STRENGTH = 0.1;

const PHEROMONE_STOP = 20000;
const PHEROMONE_INTERVAL = 300;
const PHEROMONE_LIFETIME = 30000;
const PHEROMONE_SENSOR_RADIUS = 50;

const PICKUP_RADIUS = 10;
const FOOD_SENSOR_RADIUS = 50;

const SIGHT_RANGE = 2;

const COLONY_SENSOR_RADIUS = 100;
const COLONY = {
    x: 100,
    y: 100,
    r: 40,
    fillStyle: '#422518', //'#1A0D00',
    strokeStyle: 'black',
    lineWidth: 6
};

const TICK_LENGTH = 50;
const DELTA_TIME_CONSTANT = 100;

let displaySettings = {
    SHOW_HOME_PHEROMONES: true,
    SHOW_FOOD_PHEROMONES: true,
    SHOW_FOOD_SENSOR: false,
    SHOW_COLONY_SENSOR: false
};