let all = 1000000000, cnt = 151149277;
let iter = 800000000;
const x1 = 3, y1 = 0;
const x2 = 4, y2 = 4*Math.sqrt(3);
const xmid = 3.5, ymid = 2*Math.sqrt(3);
for(let i = 0; i < iter; i ++) {
    let w1 = Math.random();
    let w2 = Math.random();
    if(w1 + w2 > 1) {
        w1 = 1 - w1;
        w2 = 1 - w2;
    }
    const x = w1 * x1 + w2 * x2;
    const y = w1 * y1 + w2 * y2;
    if((x*x+y*y<=1) || ((x-x1)*(x-x1)+(y-y1)*(y-y1)<=1) || ((x-x2)*(x-x2)+(y-y2)*(y-y2)<=1)) {
        cnt ++;
    }
}
all += iter;

console.log(cnt/all);
console.log(`cnt: ${cnt}, all: ${all}`);
