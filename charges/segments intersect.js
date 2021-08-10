class Point {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
}

let o1
let o2
let o3
let o4

function between(p1, p2, p3) {
    return ( (p2.x <= Math.max(p1.x, p3.x)) && (p2.x >= Math.min(p1.x, p3.x)) && 
           (p2.y <= Math.max(p1.y, p3.y)) && (p2.y >= Math.min(p1.y, p3.y)))
}

function curve_order(a, b, c) {
    let val = ((b.y - a.y) * (c.x - b.x)) - ((b.x - a.x) * (c.y - b.y)) 
    if (val > 0){ 
        return 1
    }
    else if (val < 0) { 
        return 2
    } 
    return 0
}  
function segments_intersect(a1,a2,b1,b2) {
      
    o1 = curve_order(a1, a2, b1) 
    o2 = curve_order(a1, a2, b2) 
    o3 = curve_order(b1, b2, a1) 
    o4 = curve_order(b1, b2, a2) 
  
    if ((o1 != o2) && (o3 != o4)) {
        return true
    }
  
    // Special Cases

    if((o1 == 0) && between(a1, b1, a2)){
        return true
    } 
    if((o2 == 0) && between(a1, b2, a2)){
        return true
    }
    if((o3 == 0) && between(b1, a1, b2)){
        return true 
    }
    if((o4 == 0) && between(b1, a2, b2)){
        return true
    }
    return false
}
// Driver program to test above functions: 
let p1 = new Point(1, 1) 
let q1 = new Point(10, 1) 
let p2 = new Point(1, 2) 
let q2 = new Point(10, 2) 
  
if (segments_intersect(p1, q1, p2, q2)) { 
    console.log("Yes") 
} else { 
    console.log("No") 
}
p1 = new Point(10, 0)
q1 = new Point(0, 10)
p2 = new Point(0, 0)
q2 = new Point(10,10)

if (segments_intersect(p1, q1, p2, q2)) {
    console.log("Yes") 
} else {
    console.log("No") 
}
p1 = new Point(-5,-5) 
q1 = new Point(0, 0) 
p2 = new Point(1, 1) 
q2 = new Point(10, 10) 
  
if (segments_intersect(p1, q1, p2, q2)) {
    console.log("Yes") 
} else {
    console.log("No") 
}



console.log(between(new Point(0,0),new Point(2,2),new Point(1,1)))
console.log(between(new Point(2,-1),new Point(2,-1),new Point(-10,-1)))
console.log(between(new Point(2,-1),new Point(1,-1),new Point(-10,-1)))
