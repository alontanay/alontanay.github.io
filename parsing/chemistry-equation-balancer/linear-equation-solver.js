Array.prototype.clone = function () {
    return this.slice();
};

function gen2dArray(h, w) {
    let res = new Array(h);
    for (let i = 0; i < h; i++) {
        res[i] = new Array(w);
    }
    return res;
}

function gcd(a, b) {
    if (b == 0) { return a; }
    return gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

/**
 * Inefficient class for rational numbers.
 * unfortunately custom operators aren't an option in js, so it uses
 */
class Rational {
    constructor() {
        if (arguments[0] instanceof Rational) {
            this.numer = arguments[0].numer;
            this.denom = arguments[0].denom;
            return;
        }
        this.numer = arguments[0];
        this.denom = arguments.length == 2 ? arguments[1] : 1;
        this.reduce();
    }
    set(val) {
        val = new Rational(val);
        this.numer = val.numer;
        this.denom = val.denom;
    }
    reduce() {
        const common = gcd(this.numer, this.denom);
        this.numer /= common;
        this.denom /= common;
    }
    inverse() {
        this.set(this.retInverse());
    }
    mul(val) {
        this.set(this.retMul(val));
    }
    div(val) {
        this.set(this.retDiv(val));
    }
    add(val) {
        this.set(this.retAdd(val));
    }
    sub(val) {
        this.set(this.retSub(val));
    }
    neg() {
        this.set(this.retNeg());
    }
    retReduce() {
        let copy = this.clone();
        copy.reduce();
        return copy;
    }
    retInverse() {
        return new Rational(this.denom, this.numer);
    }
    retMul(val) {
        val = new Rational(val);
        return new Rational(this.numer * val.numer, this.denom * val.denom);
    }
    retDiv(val) {
        val = new Rational(val);
        return new Rational(this.numer * val.denom, this.denom * val.numer);
    }
    retAdd(val) {
        val = new Rational(val);
        return new Rational(this.numer * val.denom + val.numer * this.denom, this.denom * val.denom);
    }
    retSub(val) {
        val = new Rational(val);
        return new Rational(this.numer * val.denom - val.numer * this.denom, this.denom * val.denom);
    }
    retNeg() {
        return new Rational(-this.numer, this.denom);
    }
    toString() {
        return String(this.numer) + '/' + String(this.denom);
    }
    equal(val) {
        val = new Rational(val);
        return this.numer * val.denom == val.numer * this.denom;
    }
    getVal() {
        return this.numer / this.denom;
    }
    clone() {
        return new Rational(this);
    }
}

/**
 * js isn't nice for working with types like rationals explicitly since it isn't strongly typed :(
 * I mean, they say only a bad craftsman blames his tools, but it clearly doesn't apply here :]
 */
class RatMatrix {
    constructor() {
        if (arguments.length == 2) {
            this.height = arguments[0];
            this.width = arguments[1];
            this.table = gen2dArray(this.height, this.width);
        } else if (arguments.length == 1) {
            this.height = arguments[0].height;
            this.width = arguments[0].width;
            this.table = gen2dArray(this.height, this.width);
            for (let row = 0; row < this.height; row++) {
                for (let col = 0; col < this.width; col++) {
                    this.table[row][col] = arguments[0].table[row][col].clone();
                }
            }
        } else {
            this.height = 0;
            this.width = 0;
            this.table = [];
        }
    }
    setMat(table) {
        this.height = table.length;
        this.width = table[0].length;
        this.table = gen2dArray(this.height, this.width);
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                this.table[row][col] = new Rational(table[row][col]);
            }
        }
    }
    appendCol(col) {
        if (!col) {
            col = new Array(this.height).fill(0);
        }
        this.width++;
        for (let row = 0; row < this.height; row++) {
            this.table[row].push(new Rational(col[row]));
        }
    }
    popCol() {
        this.width--;
        for (let row = 0; row < this.height; row++) {
            this.table[row].pop();
        }
    }
    appendRow(ro) {
        if (!ro) {
            ro = new Array(this.width).fill(0);
        }
        this.table.push([]);
        for (let col = 0; col < this.width; col++) {
            this.table[this.height].push(new Rational(ro[col]));
        }
        this.height++;
    }
    popRow() {
        this.height--;
        this.table.pop();
    }
    resolveHom() {
        let dependentCoords = []
        let dependentCount = 0;
        for (let col = 0; col < this.width; col++) {
            let nonZeroRow = dependentCount;
            while (nonZeroRow < this.height && this.table[nonZeroRow][col].equal(0)) {
                nonZeroRow++;
            }
            if (nonZeroRow == this.height) { continue; }
            this.swapRow(nonZeroRow, dependentCount);
            for (let row = 0; row < this.height; row++) {
                if (row == dependentCount || this.table[row][col].equal(0)) { continue; }
                this.addMulRow(row, dependentCount, this.table[row][col].retDiv(this.table[dependentCount][col]).retNeg())
            }
            dependentCoords.push([dependentCount, col]);
            dependentCount++;
        }
        return dependentCoords
    }
    solveHom() {
        let backup = new RatMatrix(this);
        let dependentCoords = this.resolveHom();
        let sol = [];
        for (let col = 0; col < this.width; col++) { sol.push(new Rational(1)); }
        for (let [row, col] of dependentCoords) {
            let curVal = new Rational(0);
            for (let fcol = col + 1; fcol < this.width; fcol++) {
                curVal.sub(this.table[row][fcol].retMul(sol[fcol]));
            }
            curVal.div(this.table[row][col]);
            sol[col] = curVal;
        }
        this.setMat(backup.table);
        return sol;
    }
    solveHomWholes() {
        let sol = this.solveHom();
        let commonDenom = 1;
        for (let val of sol) {
            commonDenom = lcm(commonDenom, val.denom);
        }
        let wholes = [];
        for (let val of sol) {
            wholes.push((val.numer * commonDenom) / val.denom);
        }
        return wholes;
    }
    solveLinear(values) {
        if (values.length != this.height) {
            console.log('Matrix/Column dimensions don\'t match');
            return false;
        }
        this.appendCol(values);
        for (let row = 0; row < this.height; row++) {
            this.table[row][this.width - 1].neg();
        }
        let sol = this.solveHom();
        this.popCol();
        if (sol[this.width].equal(1)) {
            sol.pop();
            return sol;
        }
        // no solution
        return false
    }
    addMulRow(r1, r2, k) {
        for (let col = 0; col < this.width; col++) {
            let tmp = new Rational(this.table[r1][col]);
            this.table[r1][col].add(this.table[r2][col].retMul(k));
        }
    }
    swapRow(r1, r2) {
        const tmp = this.table[r1];
        this.table[r1] = this.table[r2];
        this.table[r2] = tmp;
    }
}