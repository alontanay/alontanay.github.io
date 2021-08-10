class Text {
    constructor(text, font, pos, style='black') {
        this.text = text
        this.font = font
        this.x = pos[0]
        this.y = pos[1]
        this.fillStyle = style
    }
    draw() {
        fillText(this.text, this.font, this.fillStyle, this.x, this.y)
    }
}
class Player {
    constructor(pos, sign, weight) {
        this.x = pos[0]
        this.y = pos[1]
        this.sign = sign
        this.weight = weight
        this.xvelocity = 0
        this.yvelocity = 0
        this.xforce = 0
        this.yforce = 0
    }
    update() {
        this.xforce = 0
        this.yforce = 0
        for(let i = 0; i < charges.length; i ++) {
            let c = charges[i]
            let force_direction = [this.x-c.x, this.y-c.y]
            let f_size = size(force_direction)
            let f_multiplyer

            f_multiplyer = Math.min(1/f_size/f_size, max_force_const)
            f_multiplyer *= this.sign*c.sign

            this.xforce += f_multiplyer * force_direction[0] / f_size
            this.yforce += f_multiplyer * force_direction[1] / f_size
        }
        this.xforce *= force_const
        this.yforce *= force_const
    
        this.xvelocity += this.xforce / this.weight
        this.yvelocity += this.yforce / this.weight
        
        this.x += this.xvelocity
        this.y += this.yvelocity
    }
    draw() {
        drawCircle(this.x,this.y+toolbar_height,player_radius, playerStyle.fill, playerStyle.stroke, playerStyle.width)
        screen.strokeStyle = '#ffff00'
        screen.lineWidth = 3
        screen.beginPath()
        screen.moveTo(this.x, this.y+toolbar_height)
        screen.lineTo(this.x+this.xforce*10000, this.y+toolbar_height+this.yforce*10000)
        screen.stroke()
        screen.closePath()
    }
}
class Button {
    constructor(button_rect, text, font, text_coords, onClick, style) {
        this.rect = button_rect
        this.x = button_rect[0]
        this.y = button_rect[1]
        this.w = button_rect[2]
        this.h = button_rect[3]
        this.text = text
        this.font = font
        this.tx = text_coords[0]
        this.ty = text_coords[1]
        this.onClick = onClick
        this.fillColor = style[0]
        this.strokeColor = style[1]
        this.lineWidth = style[2]
    }
    clicked() {
        return pos_in_rect(clickedPos, this.rect)
    }
    draw(clicked) {
        drawRect(this.x,this.y-toolbar_height,this.w,this.h, (clicked ? darken(this.fillColor, darken_button_const) : this.fillColor), this.strokeColor, this.lineWidth)
        fillText(this.text, this.font, '#000000', this.x+this.tx+(clicked ? 2 : 0), this.h+this.y-this.ty)
    }
    bright() {
        this.draw()
        screen.globalAlpha = 0.4
        screen.fillStyle = 'white'
        screen.fillRect(this.x,this.y,this.w,this.h)
        screen.globalAlpha = 1
    }
}

class Charge {
    constructor(x,y,sign) {
        this.x = x
        this.y = y
        this.sign = sign
    }
    draw() {
        screen.drawImage(((this.sign == 1) ? (positive_img): (negative_img)), this.x-player_radius, toolbar_height+this.y-player_radius, player_radius*2,player_radius*2)    
    }
    clicked() {
        return (mousePos[0]-this.x)*(mousePos[0]-this.x)+(mousePos[1]-toolbar_height-this.y)*(mousePos[1]-toolbar_height-this.y) <= player_radius*player_radius
    }
    move(pos) {
        this.x = pos[0]
        this.y = pos[1]
    }
    invert_sign() {
        this.sign = -this.sign
    }
    copy() {
        return new Charge(this.x, this.y, this.sign)
    }
}

class RectObstacle {
    constructor(x,y,w,h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    hit() {
        let moveLine1 = moveLines[0]
        let moveLine2 = moveLines[1]
        if(circle_intersect_rect([player.x,player.y,player_radius], [this.x,this.y,this.w,this.h])) {
            return true
        }
        if(line_intersect_rect(moveLine1, [this.x,this.y,this.w,this.h]) || line_intersect_rect(moveLine2, [this.x,this.y,this.w,this.h])) {
            return true
        }
        return false
    }
    draw() {
        drawRect(this.x,this.y,this.w,this.h, obstacleStyle.fill, obstacleStyle.stroke, obstacleStyle.width)
    }
}
class Goal extends RectObstacle {
    draw() {
        drawRect(this.x,this.y,this.w,this.h, goalStyle.fill, goalStyle.stroke, goalStyle.width)        
    }
}
// GLOBAL VARIABLE DECLARATIONS:
// basic
htonD = {'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'a':10,'b':11,'c':12,'d':13,'e':14,'f':15}
ntohD = {0:'0',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'a',11:'b',12:'c',13:'d',14:'e',15:'f'}

// canvas
let canvas = document.getElementById('screen')
canvas.width = 1000
canvas.height = 600
let screen = canvas.getContext('2d')
const canvas_rect = canvas.getBoundingClientRect()
let positive_img
let negative_img
let arrow_img
let trash_img

// evenet vars
let mousePos
let clickedPos
let mouseupPos
canvas.addEventListener('mousedown', mousedown)
canvas.addEventListener('mouseup', mouseup)
canvas.addEventListener('mousemove', mousemove)
window.addEventListener('keydown', keypress)
window.addEventListener('keyup', keyup)
window.addEventListener('scroll', scroll)
// some constants
const player_radius = 10
const toolbar_height = 50
const darken_button_const = 80
const winScreen = [
    160,
    100,
    700,
    380,
    50
]
const helpScreen = [
    150,
    100,
    700,
    400,
    50
]
const leaderScreen = [
    150,
    100,
    700,
    400,
    50
]

const confScreen = [
    245,
    225,
    510,
    150,
    50
]
const loadFailedScreen = [
    245,
    225,
    510,
    150,
    50
]
const trashRect = [
    900,
    500,
    50,
    70
]
const addPChargeRect = [
    505,
    8,
    30,
    30
]
const px = addPChargeRect[0] 
const py = addPChargeRect[1] 
const pw = addPChargeRect[2] 
const ph = addPChargeRect[3] 

const addNChargeRect = [
    545,
    8,
    30,
    30
]
const nx = addNChargeRect[0] 
const ny = addNChargeRect[1] 
const nw = addNChargeRect[2] 
const nh = addNChargeRect[3] 

const obstacleStyle = {
    'fill':'#ffc0c0',
    'stroke':'#000000',
    'width': 3
}
const goalStyle = {
    'fill': '#c9ffcb',
    'stroke': 'black',
    'width': 3
}
const playerStyle = {
    'fill':'#313131',
    'stroke':'#000000',
    'width': 5
}

// control:
let stop_button = new Button([80,8,60,30], 'Stop', '20px Arial', [8,7], clear_sim_interval, ['#b0b0b0','#000000',3])
let buttons = [
    stop_button,
    new Button([10,8,60,30], 'Start', '20px Arial', [8,7], start_sim, ['#b0b0b0','#000000',3]), // start simulation and exit edit mode
    new Button([150,8,60,30], 'Clear', '20px Arial', [5,7], function() {request_confirmation(clear)}, ['#b0b0b0','#000000',3]), // clear all changes and enter edit mode
    new Button([220,8,60,30], 'Save', '20px Arial', [7,7], save, ['#b0b0b0','#000000',3]), // saves the solution (client side) in a text format
    new Button([290,8,60,30], 'Load', '20px Arial', [7,7], switch_divs, ['#b0b0b0','#000000',3]), // saves the solution (client side) in a text format
    new Button([360,8,135,30], 'Leader Board', '20px Arial', [7,7], leader, ['#b0b0b0','#000000',3]), // clear all changes and enter edit mode
    new Button([960,8,30,30], '?', '20px Arial', [9, 7], help, ['#b0b0b0','#000000',3])
]
let disabled_buttons = [
    true,
    false,
    false,
    false,
    false,
    false,
    false
]
let pressingX = false
let pressingZ = false
let deleting = false // charges
let switching_buttons = false
clicked_button_index = -1
let code_state = 'edit'
let scrollPos = 0
let user_scrolling = true
const document_scroll_height = 770
let window_rect = -1
let confirm_rect = [330,315,150,50]
let cancel_rect = [520,315,150,50]
let chosen_option = -1
let requested_func = -1
/* 
    help: help screen (no controls, no buttons), 
    edit: edit (control, buttons)
    simu: simulation (no control, buttons)
    anim: animation (no control, no buttons)
*/

// simulator stats
let time = 0
let player = new Player([50, 200], 1, 1)
let obstacles = [
    new RectObstacle(100, 0, 40, 300),
    new RectObstacle(100, 400, 400, 50),
    new RectObstacle(500, 50, 50, 50),
]
const startingPos = [50, 200]
let lastPlayerX = -1
let lastPlayerY = -1
let moveLines
let goal = new Goal(800, 300, 100, 100)
const deadly_walls = false
const force_const = 200
const max_force_const = 0.001
const min_f_size = 30
let charges = []
let draggedCharge = {
    'sign': 0,
    'index': -1
}
let sim_interval
let end_message_timeout

screen.fillStyle = '#000000'
screen.font = '100px Arial'
screen.fillText('Loading...', 250, 310)
let dots = 0


loading_screen = setInterval(() => {
    if(loading_left == 0) {
        start_main()
    }
    if(dots == 3){
        dots = 0
        screen.fillStyle = 'white'
        screen.fillRect(615, 300, 66, 10)
        screen.fillStyle = '#000000'
        return 0
    }
        
    screen.fillRect(615+(dots)*28, 300, 10, 10)
    dots ++
}, 400)


// events:
function keypress(event) {
    let keyCode = event.which || event.keyCode
    if(keyCode == 90) {
        if(pressingZ) {
            return 0
        }
        if(code_state != 'edit') {
            return 0
        }
        pressingZ = true
        if (mouseupPos[0] <= 1000 && mouseupPos[0] >= 0 && mouseupPos[1] <= 600 && mouseupPos[1] >= toolbar_height) {
            charges.push(new Charge(mousePos[0], mousePos[1] - toolbar_height, 1))
            renderCanvas()
        }
    }
    if(keyCode == 88) {
        if(pressingX) {
            return 0
        }
        if(code_state != 'edit') {
            return 0
        }
        pressingX = true
        if (mouseupPos[0] <= 1000 && mouseupPos[0] >= 0 && mouseupPos[1] <= 600 && mouseupPos[1] >= toolbar_height) {
            charges.push(new Charge(mousePos[0], mousePos[1] - toolbar_height, -1))
            renderCanvas()
        }
    }
}

function keyup(event) {
    let keyCode = event.which || event.keyCode
    if(keyCode == 90) {
        pressingZ = false
    }
    if(keyCode == 88) {
        pressingX = false
    }
}

function scroll() {
    if(code_state != 'edit'){
        window.scrollTo(0,0)
    }
}
function mousemove(event) {
    mousePos = [event.clientX - Math.floor(canvas_rect.left) - 5, event.clientY - Math.floor(canvas_rect.top) - 5]
    // hovering above trash can:
    hovering_above_trash = pos_in_rect(mousePos, trashRect)
    // if deleting:
    if(deleting && code_state == 'edit') {
        for(let i = 0; i < charges.length; i ++) {
            if(charges[i].clicked()) {
                charges.splice(i, 1)
                renderCanvas()
                return 0
            }
        }
    }

    // if dragging:
    if(draggedCharge.sign != 0) {
        renderCanvas(draggedCharge.index)
        draw_dragged_charge()
    }
}

function mousedown(event) {
    
    clickedPos = mousePos
    // if not a left click

    if(event.which == 3) {
        if(draggedCharge.sign != 0) {
            return 0
        }
        deleting = true
        if(code_state == 'edit') {
            for(let i = 0; i < charges.length; i ++) {
                if(charges[i].clicked()) {
                    charges.splice(i, 1)
                    renderCanvas()
                    return 0
                }
            }
        }
        return 0
    }
    if(event.which == 2) {
        
    }
    if(event.which != 1) {
        return 0
    }
    if(code_state == 'info') {
        if(!pos_in_rect(clickedPos, window_rect)) {
            code_state = 'edit'
            reset_stats()
            disabled_buttons = [true, false, false, false, false, false, false]
            renderScreen()
        }
        return 0
    }
    if(code_state == 'conf') {
        if(!pos_in_rect(clickedPos, window_rect)) {
            renderScreen()
            code_state = 'edit'
            return 0
        }
        if(pos_in_rect(clickedPos, confirm_rect)) {
            chosen_option = 'confirm'
            draw_conf_buttons([true,false])
            return 0
        }
        if(pos_in_rect(clickedPos, cancel_rect)) {
            chosen_option = 'cancel'
            draw_conf_buttons([false,true])
            return 0
        }
        return 0
    }
    if(code_state == 'simu') {
        // if pressed the stop button:
        if(pos_in_rect(clickedPos, [80,8,60,30])) {
            clicked_button_index = 0
            stop_button.draw(true)
            stop_sim()
        }
        return 0
    }
    if(code_state == 'edit') {
        if(mousePos[1] < toolbar_height) {
            if(pos_in_rect(mousePos, addPChargeRect)) {
                draggedCharge.sign = 1
                draggedCharge.index = -1
            }
            if(pos_in_rect(mousePos, addNChargeRect)) {
                draggedCharge.sign = -1
                draggedCharge.index = -1
            }
        }
        for(let i = charges.length-1; i >= 0; i --) {
            if(charges[i].clicked()) {
                let charge = charges[i]
                draggedCharge.index = i
                draggedCharge.sign = charge.sign
                draggedCharge.x = mousePos[0]
                draggedCharge.y = mousePos[1]
                renderCanvas(i)
                draw_dragged_charge()
                return 0
            }
        }
    }
    if(clickedPos[1] < toolbar_height){
        for(let i = 1; i < buttons.length; i ++) {
            let b = buttons[i]
            if(b.clicked()) {
                clicked_button_index = i
                b.draw((b.text != 'Load'))
                b.onClick()
                clicked_button_index = ((b.text == 'Load') ? -1 : clicked_button_index)
                return 0
            }
        }
        return 0
    }             
}

function mouseup(event) {
    if(event.which == 3) {
        deleting = false
        return 0
    }

    mouseupPos = mousePos
    if(clicked_button_index != -1) {
        if(code_state != 'simu' && clicked_button_index != 0) {
            buttons[clicked_button_index].draw(false)
        }
        clicked_button_index = -1
        return 0
    }
    // if in the confirm box:
    if(code_state == 'conf') {
        if(pos_in_rect(mouseupPos, confirm_rect) && chosen_option == 'confirm') {
            code_state = 'edit'
            requested_func()
            renderCanvas()
            return 0
        }
        if(pos_in_rect(mouseupPos, cancel_rect) && chosen_option == 'cancel') {
            code_state = 'edit'
            renderCanvas()
            return 0
        }
        draw_conf_buttons()
        chosen_option = -1
        return 0
    }
    if(draggedCharge.sign != 0) {
        if (mouseupPos[0] <= 1000 && mouseupPos[0] >= 0 && mouseupPos[1] <= 600 && mouseupPos[1] >= toolbar_height){
            if(draggedCharge.index == -1) {
                charges.push(new Charge(mousePos[0], mousePos[1] - toolbar_height, draggedCharge.sign))
            } else {    
                charges[draggedCharge.index].x = mousePos[0]
                charges[draggedCharge.index].y = mousePos[1] - toolbar_height
            }
        } else {
            if(draggedCharge.index != -1) {
                charges.splice(draggedCharge.index, 1)
            }
        }
        draggedCharge.sign = 0
        renderCanvas()
        return 0
    }
    return 0
}

// graphic:
function renderCanvas(excluding=-1) {
    renderScreen(excluding)
    fill_toolbar()
    draw_buttons()
    draw_charge_dispensers()
}

function renderScreen(excluding=-1) {
    clear_screen()
    obstacles.forEach(function(o) {
        o.draw()
    })
    goal.draw()
    for(let i = 0; i < charges.length; i ++) {
        if(i != excluding) {
            charges[i].draw()
        }
    }
    player.draw()
}

function strokeLine(pos1, pos2, width, color='#000000') {
    screen.strokeStyle = color
    screen.lineWidth = width
    screen.beginPath()
    screen.moveTo(pos1[0],pos1[1]+toolbar_height)
    screen.lineTo(pos2[0],pos2[1]+toolbar_height)
    screen.stroke()
}

function fillRect(x, y, dx, dy, color) {
    screen.fillStyle = color
    screen.fillRect(x,y+toolbar_height,dx,dy)
}

function strokeRect(x, y, dx, dy, color, lineWidth) {
    screen.strokeStyle = color
    screen.lineWidth = lineWidth
    screen.strokeRect(x,y+toolbar_height,dx,dy)
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

function clear_screen() {
    fillRect(0,0,1000,600-toolbar_height, 'white')
}
function fill_toolbar() {
    screen.fillStyle = '#f0f0f0'
    screen.strokeStyle = '#000000'
    screen.lineWidth = 3
    screen.beginPath()
    screen.fillRect(-3,-3,1006,toolbar_height+3)
    screen.moveTo(0,toolbar_height-1)
    screen.lineTo(1000,toolbar_height-1)
    screen.stroke()
    screen.closePath()
}
function draw_buttons() {
    for(let i = 0; i < buttons.length; i ++) {
        if(disabled_buttons[i]) {
            buttons[i].bright()
            continue
        }
        buttons[i].draw()
    }
}
function draw_charge_dispensers() {
    // optimize:
    drawRect(px,py-toolbar_height,pw,ph, '#aaffaa', 'black', 3)
    screen.drawImage(positive_img, px+pw/2-player_radius, py+ph/2-player_radius, player_radius*2,player_radius*2)
    
    drawRect(nx,ny-toolbar_height,nw,nh, '#aaffaa', 'black', 3)
    screen.drawImage(negative_img, nx+nw/2-player_radius, ny+nh/2-player_radius, player_radius*2,player_radius*2)
    
}

function draw_dragged_charge() {
    let x = mousePos[0]
    let y = mousePos[1]
    if(mousePos[1] < toolbar_height || mousePos[1] > 600) {
        screen.globalAlpha = 0.5
        screen.drawImage(((draggedCharge.sign == 1) ? (positive_img): (negative_img)), x-player_radius, y-player_radius, player_radius*2,player_radius*2)
        screen.globalAlpha = 1
        screen.strokeStyle = 'black'
        screen.lineWidth = 3
        screen.beginPath()
        screen.moveTo(x-player_radius, y-player_radius)
        screen.lineTo(x+player_radius, y+player_radius)
        screen.moveTo(x-player_radius, y+player_radius)
        screen.lineTo(x+player_radius, y-player_radius)
        screen.stroke()
        return 0
    }
    screen.drawImage(((draggedCharge.sign == 1) ? (positive_img): (negative_img)), x-player_radius, y-player_radius, player_radius*2,player_radius*2)
    
}
//________________________

// simulator:
function request_confirmation(func) {
    chosen_option = -1
    code_state = 'conf'
    requested_func = func

    window_rect = confScreen

    drawRoundedRect(confScreen[0], confScreen[1], confScreen[2], confScreen[3], confScreen[4], '#e4e4e4', 'black', 3)

    fillText('Warning: This will delete your solution!', 'bold 20px Arial', '#000000', 320, 265)
    fillText('Make sure to save what you need before continuing', 'bold 20px Arial', '#000000', 255, 295)
    draw_conf_buttons()
}

function show_info(screen, texts) {
    window_rect = screen
    code_state = 'info'
    drawRoundedRect(screen[0], screen[1], screen[2], screen[3], screen[4], '#e4e4e4', 'black', 3)
    
    texts.forEach(function(text) {
        fillText(text[0], text[1], text[2], text[3], text[4])
    })
}
// function try_clear() {
//     chosen_option = -1
//     code_state = ['conf','clear']
//     window_rect = [confScreen.x,confScreen.y,confScreen.width,confScreen.height]

//     screen.fillStyle = '#e4e4e4'
//     screen.lineWidth = 3
//     screen.strokeStyle = '#000000'

//     screen.beginPath()
//     screen.moveTo(confScreen.x + confScreen.radius, confScreen.y)
//     screen.lineTo(confScreen.x + confScreen.width - confScreen.radius, confScreen.y)
//     screen.quadraticCurveTo(confScreen.x + confScreen.width, confScreen.y, confScreen.x + confScreen.width, confScreen.y + confScreen.radius)
//     screen.lineTo(confScreen.x + confScreen.width, confScreen.y + confScreen.height - confScreen.radius)
//     screen.quadraticCurveTo(confScreen.x + confScreen.width, confScreen.y + confScreen.height, confScreen.x + confScreen.width - confScreen.radius, confScreen.y + confScreen.height)
//     screen.lineTo(confScreen.x + confScreen.radius, confScreen.y + confScreen.height)
//     screen.quadraticCurveTo(confScreen.x, confScreen.y + confScreen.height, confScreen.x, confScreen.y + confScreen.height - confScreen.radius)
//     screen.lineTo(confScreen.x, confScreen.y + confScreen.radius)
//     screen.quadraticCurveTo(confScreen.x, confScreen.y, confScreen.x + confScreen.radius, confScreen.y)
//     screen.closePath()

//     screen.fill()
//     screen.stroke()

//     fillText('Warning: This will delete your solution!', 'bold 20px Arial', '#000000', 320, 265)
//     fillText('Make sure to save what you need before continuing', 'bold 20px Arial', '#000000', 255, 295)
//     draw_conf_buttons()
// }
function draw_conf_buttons(clicked = [false,false]) {
    screen.beginPath()
    screen.fillStyle = clicked[0] ? darken('#22ff44', darken_button_const) : '#22ff44'
    screen.rect(confirm_rect[0],confirm_rect[1],confirm_rect[2],confirm_rect[3])
    screen.fill()
    screen.stroke()
    
    screen.beginPath()
    screen.fillStyle = clicked[1] ? darken('#ff2222', darken_button_const) : '#ff2222'
    screen.rect(cancel_rect[0],cancel_rect[1],cancel_rect[2],cancel_rect[3])
    screen.fill()
    screen.stroke()

    fillText('Confirm', '35px Arial', '#000000', 343 + (clicked[0] ? 2 : 0), 352)
    fillText('Cancel', '35px Arial', '#000000', 540 + (clicked[1] ? 2 : 0), 352)
}
function clear() {
    charges = []
    renderScreen()
    code_state = 'edit'
}
function save() {
    file_name = prompt('Please name your solution:')
    if(file_name == null) {
        return 0;
    }
    solution = ''
    charges.forEach(function(c) {
        solution += `${c.x}${(c.sign==1)?('P'):('N')}${c.y}\n`
    })
    let blob = new Blob([solution], {
        type: 'text/plain;charset=utf-8'
      });
    if(file_name.length == 0) {
        file_name = 'Charges Solution'
    }
    saveAs(blob, `${file_name}.txt`)
}
function switch_divs() {
    if(main_div.style.display == 'none') {
        main_div.style.display = 'block'
        upload_div.style.display = 'none'
        return 0
    }
    main_div.style.display = 'none'
    upload_div.style.display = 'block'
}
function load_failed(message) {
    console.log(`load failed. Reason: ${message}`)
    show_info(loadFailedScreen, [['Error: The uploaded solution was rejected!', '25px Arial', 'black', 200, 200],[`Reason: ${message}`, '25px Arial', 'black', 200, 200]])
}

function load() {
    console.log('file uploaded and confirmed by user')
    new_charges = []
    let char
    let sol_len = reader.result.length
    let new_charge = new Charge(0,0,1)
    let x_focused = true
    let dot_appeared = false
    let coord_str = ''
    let x,y,sign
    if(sol_len > 10000) {
        load_failed('Solution file is too big / too many charges')
        return 0
    }
    for(let i = 0; i < sol_len; i ++) {
        char = reader.result[i]
        if(char.charCodeAt(0) == 13) {
            continue
        }
        switch(char) {
            case '\n':
                if(!valid_coord) {
                    load_failed('Empty y coordinate')
                    return 0
                }
                y = Number(coord_str)
                if(y > 600-toolbar_height || y < 0) {
                    load_failed('Charges can\'t be placed outside the screen')
                    return 0
                }
                new_charges.push(new Charge(x, y, sign))
                x_focused = true
                coord_str = ''
                dot_appeared = false
                valid_coord = false
                continue
            case 'P':
                if(!x_focused) {
                    load_failed('Sign declaration after y coordinate')
                    return 0
                }
                if(!valid_coord) {
                    load_failed('Empty x coordinate')
                    return 0
                }
                x = Number(coord_str)
                if(x > 1000 || x < 0) {
                    load_failed('Charges can\'t be placed outside the screen')
                    return 0
                }
                sign = 1
                x_focused = false
                dot_appeared = false
                valid_coord = false
                coord_str = ''
                continue
            case 'N':
                if(!x_focused) {
                    load_failed('Sign declaration after y coordinate')
                    return 0
                }
                if(!valid_coord) {
                    load_failed('Empty x coordinate')
                    return 0
                }
                x = Number(coord_str)
                if(x > 1000 || x < 0) {
                    load_failed('Charges can\'t be placed outside the screen')
                    return 0
                }
                sign = -1
                x_focused = false
                dot_appeared = false
                valid_coord = false
                coord_str = ''
                continue
            case '.':
                if(dot_appeared) {
                    load_failed('Charge\'s coordinates must be numbers')
                    return 0
                }
                dot_appeared = true
                coord_str += '.'
                continue
        }
        if(is_digit(char)) {
            coord_str += char
            valid_coord = true
            continue
        }
        load_failed('Charge\'s coordinates must be numbers')
        return 0
    }
    if(x_focused = false) {
        load_failed('Incomplete coordinates list. make sure')
    }
    charges = new_charges.slice()
    code_state = 'edit'
    return 1
}

function start_sim() {
    reset_stats()
    time = 0
    disabled_buttons = [false, true, true, true, true, true, true]
    draggedCharge.sign = 0
    
    code_state = 'simu'
    lastPlayerX = player.x
    lastPlayerY = player.y
    // sim_timeout = setTimeout(timed_out, 1000000)
    sim_interval = setInterval(sim_tick, 1)
    renderCanvas()
}
// function timed_out() {
//     clear_sim_interval()

// }
function reset_stats() {
    player.xforce = 0
    player.yforce = 0
    player.xvelocity = 0
    player.yvelocity = 0
    player.x = startingPos[0]
    player.y = startingPos[1]
}

function stop_sim(render=true) {
    clear_sim_interval()
    reset_stats()
    code_state = 'edit'

    disabled_buttons = [true, false, false, false, false, false, false]
    if(render) { renderCanvas() }
}

function clear_sim_interval() {
    if(code_state == 'simu') {
        clearInterval(sim_interval)
    }
    // clearTimeout(sim_timeout)
}

function leader() {
    show_info(leaderScreen, [['Coming Soon...', '40px Arial', 'black', 350, 300]])

    // fillText('Name:', '25px Arial', '#000000', 170, 190)
    // fillText('Time:', '25px Arial', '#000000', 270, 190)
    // strokeLine([255,110],[255,400],3,'black')
    // fillText('Name:', '25px Arial', '#000000', 370, 190)
    // fillText('Charges:', '25px Arial', '#000000', 470, 190)
    // strokeLine([460,110],[460,400],3,'black')

}

function help() {
    show_info(helpScreen, [
        ['Drag charges and drop them in the field', '20px Arial', '#000000', 320, 150],
        ['Commands:', '25px Arial', '#000000', 170, 190],
        ['Start: starts simulation', '20px Arial', '#000000', 170, 230],
        ['Stop: resets the simulation and keeps the charges setup', '20px Arial', '#000000', 170, 270],
        ['Clear: clears all proggress and charges from the board', '20px Arial', '#000000', 170, 310],
        ['Save: saves your solution (downloadable)', '20px Arial', '#000000', 170, 350],
        ['Load: opens an existing solution from your computer', '20px Arial', '#000000', 170, 390],
        ['Leader Board: shows current leader board', '20px Arial', '#000000', 170, 430]
    ])
}

function lose() {
    clear_sim_interval()
    drawText('Failed', 'bold 130px Arial', 'red', 'black', 3, 300, 280)
    end_message_timeout = setTimeout(function() {
        stop_sim()
    }, 500)
}
function win() {
    stop_sim(false)
    draw_buttons()
    show_info(winScreen, [
        ['Success!', 'bold 55px Arial', 'green', 360, 180],
        [`Your time: ${time}`, 'bold 30px Arial', 'black', 200, 260],
        [`Number of charges: ${charges.length}`, 'bold 30px Arial', 'black', 200, 310],
        ['Note: The time is measured in ticks, meaning your browser\'s','24px Arial', 'black', 180, 360],
        ['performance does not affect it','24px Arial', 'black', 310, 390],
        ['You can save and share your solution using the [Save] button', '20px Arial', 'black', 230, 435],
    ])
}

// vector calculus:
function pos_in_rect(pos,rect) {
    return (rect[0] < pos[0] && pos[0] < rect[0] + rect[2] && rect[1] < pos[1] && pos[1] < rect[1] + rect[3])
}
function add_vec(v1, v2) {
    return [v1[0]+v2[0],v1[1]+v2[1]]
}
function sub_vec(v1, v2) {
    return [v1[0]-v2[0],v1[1]-v2[1]]
}
function mul_vec(l,v) {
    return [l*v[0], l*v[1]]
}
function size(v) {
    return Math.sqrt(v[0]*v[0]+v[1]*v[1])
}
function dir_vec(v) {
    return resize_vec(1,v)
}
function resize_vec(l, v) {
    return mul_vec(l/size(v),v)
}

function lines_intersect(a_1,a_2,b_1,b_2) {

}
function line_intersect_rect(line, rect) {
    let [x,y,w,h] = rect
    let [a,b] = line


    if(a[0] == b[0]) {
        return ((x < a[0]) && (a[0] < x + w) && ((a[1] < y && b[1] > y + h) || (b[1] < y && a[1] > y + h)))
    }
    if(a[1] == b[1]) {
        return ((y < a[1]) && (a[1] < y + h) && ((a[0] < x && b[0] > x + w) || (b[0] < x && a[0] > x + w)))
    }
    // if obviously not intersecting:
    if(x > Math.max(a[0],b[0])) {
        return false
    }
    if(x+w < Math.min(a[0],b[0])) {
        return false
    }
    if(y > Math.max(a[1],b[1])) {
        return false 
    }
    if(y+h < Math.min(a[1],b[1])) {
        return false
    }
    left_y = y_at(line, x)
    right_y = y_at(line, x + w)
    upper_x = x_at(line, y)
    lower_x = x_at(line, y + h)
    return (((y < left_y) && (left_y < y + h)) || ((y < right_y) && (right_y < y + h)) || ((x < upper_x) && (upper_x < x + w)) || ((x < lower_x) && (lower_x < x + w)))
}
function circle_intersect_rect(circle, rect) {
    let [x, y, r] = circle
    let [rx, ry, rw, rh] = rect
    
    if(ry < y && y < ry + rh) {
        if(Math.abs(x-rx) < r) {
            return true
        }
        if(Math.abs(x-rx-rw) < r) {
            return true
        }
        return false
    }

    if(rx < x && x < rx + rw) {
        if(Math.abs(y-ry) < player_radius) {
            return true
        }
        if(Math.abs(y-ry-rh) < player_radius) {
            return true
        }
        return false
    }

    if(size(x-rx, y-ry) < player_radius || size(x-rx-rw, y-ry) < player_radius || size(x-rx-rw, y-ry-rh) < player_radius || size(x-rx, y-ry-rh) < player_radius) {
        return true
    }
    return false
}

function y_at(line, x) {
    let [a, b] = line
    return a[1] + (b[1] - a[1])/(b[0]-a[0])*(x-a[0]) 
}
function x_at(line, y) {
    let [a, b] = line
    return a[0] + (b[0]-a[0])/([b[1]-a[1]])*(y-a[1])
}

// color and math:
function darken(color, a) {
    a /= 100
    return '#' + ntoh(Math.floor(hton(color.substr(1,2))*a)) + ntoh(Math.floor(hton(color.substr(3,2))*a)) + ntoh(Math.floor(hton(color.substr(5,2))*a))
}
function hton(str) {
    return htonD[str[0].toLowerCase()] * 16 + htonD[str[1].toLowerCase()]
}
function ntoh(n) {
    return ntohD[Math.floor(n/16)]+ntohD[n%16]
}

function is_digit(c) { 
    return /\d/.test(c); 
}

function start_main() {
    clearInterval(loading_screen)
    setTimeout(main, 400)
}

function main() {    
    positive_img = document.getElementById('positive_img')
    negative_img = document.getElementById('negative_img')
    arrow_img = document.getElementById('arrow_img')
    trash_img = document.getElementById('trash_img')
    console.log('main function called')
    
    renderCanvas()
}


function sim_tick() {
    time ++
    player.update()
    let ortho_vec = resize_vec(player_radius,[lastPlayerY-player.y, player.x-lastPlayerX])
    let ortho_x = ortho_vec[0]
    let ortho_y = ortho_vec[1]
    moveLines = [[[lastPlayerX + ortho_x, lastPlayerY + ortho_y],[player.x + ortho_x, player.y + ortho_y]], [[lastPlayerX - ortho_x, lastPlayerY - ortho_y],[player.x - ortho_x, player.y - ortho_y]]]
    renderCanvas()
    // if hit
    obstacles.forEach(function(o) {
        if(o.hit()) {
            lose()
        }
    })
    // walls
    if(deadly_walls) {
        // if walls are deadly
        if(!pos_in_rect([player.x,player.y],[player_radius, player_radius, 1000-player_radius*2, 600-toolbar_height-player_radius*2])) {
            lose()
        }
    } else {
        // if walls are not deadly
        if(player.x < player_radius) {
            player.x = player_radius
            player.xvelocity = 0
        }
        if(player.x > 1000-player_radius) {
            player.x = 1000-player_radius
            player.xvelocity = 0
        }
        if(player.y < player_radius) {
            player.y = player_radius
            player.yvelocity = 0
        }
        if(player.y > 600-toolbar_height-player_radius) {
            player.y = 600-toolbar_height-player_radius
            player.yvelocity = 0
        }
    }
    // goal
    if(goal.hit()) {
        win()
    }
    lastPlayerX = player.x
    lastPlayerY = player.y
}

function brighten_button(b) {
    b.draw()
    screen.globalAlpha = 0.4
    screen.fillStyle = 'white'
    screen.fillRect(b.x,b.y,b.w,b.h)
    screen.globalAlpha = 1
}