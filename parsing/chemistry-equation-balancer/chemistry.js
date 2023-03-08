Array.prototype.top = function () {
    return this[this.length];
}

const ELEMENTS = {
    'Ac': 'Actinium',
    'Ag': 'Silver',
    'Al': 'Aluminum',
    'Am': 'Americium',
    'Ar': 'Argon',
    'As': 'Arsenic',
    'At': 'Astatine',
    'Au': 'Gold',
    'B': 'Boron',
    'Ba': 'Barium',
    'Be': 'Beryllium',
    'Bh': 'Bohrium',
    'Bi': 'Bismuth',
    'Bk': 'Berkelium',
    'Br': 'Bromine',
    'C': 'Carbon',
    'Ca': 'Calcium',
    'Cd': 'Cadmium',
    'Ce': 'Cerium',
    'Cf': 'Californium',
    'Cl': 'Chlorine',
    'Cm': 'Curium',
    'Cn': 'Copernicium',
    'Co': 'Cobalt',
    'Cr': 'Chromium',
    'Cs': 'Cesium',
    'Cu': 'Copper',
    'Db': 'Dubnium',
    'Ds': 'Darmstadtium',
    'Dy': 'Dysprosium',
    'Er': 'Erbium',
    'Es': 'Einsteinium',
    'Eu': 'Europium',
    'F': 'Fluorine',
    'Fe': 'Iron',
    'Fl': 'Flerovium',
    'Fm': 'Fermium',
    'Fr': 'Francium',
    'Ga': 'Gallium',
    'Gd': 'Gadolinium',
    'Ge': 'Germanium',
    'H': 'Hydrogen',
    'He': 'Helium',
    'Hf': 'Hafnium',
    'Hg': 'Mercury',
    'Ho': 'Holmium',
    'Hs': 'Hassium',
    'I': 'Iodine',
    'In': 'Indium',
    'Ir': 'Iridium',
    'K': 'Potassium',
    'Kr': 'Krypton',
    'La': 'Lanthanum',
    'Li': 'Lithium',
    'Lr': 'Lawrencium',
    'Lu': 'Lutetium',
    'Lv': 'Livermorium',
    'Mc': 'Moscovium',
    'Md': 'Mendelevium',
    'Mg': 'Magnesium',
    'Mn': 'Manganese',
    'Mo': 'Molybdenum',
    'Mt': 'Meitnerium',
    'N': 'Nitrogen',
    'Na': 'Sodium',
    'Nb': 'Niobium',
    'Nd': 'Neodymium',
    'Ne': 'Neon',
    'Nh': 'Nihonium',
    'Ni': 'Nickel',
    'No': 'Nobelium',
    'Np': 'Neptunium',
    'O': 'Oxygen',
    'Og': 'Oganesson',
    'Os': 'Osmium',
    'P': 'Phosphorus',
    'Pa': 'Protactinium',
    'Pb': 'Lead',
    'Pd': 'Palladium',
    'Pm': 'Promethium',
    'Po': 'Polonium',
    'Pr': 'Praseodymium',
    'Pt': 'Platinum',
    'Pu': 'Plutonium',
    'Ra': 'Radium',
    'Rb': 'Rubidium',
    'Re': 'Rhenium',
    'Rf': 'Rutherfordium',
    'Rg': 'Roentgenium',
    'Rh': 'Rhodium',
    'Rn': 'Radon',
    'Ru': 'Ruthenium',
    'S': 'Sulfur',
    'Sb': 'Antimony',
    'Sc': 'Scandium',
    'Se': 'Selenium',
    'Sg': 'Seaborgium',
    'Si': 'Silicon',
    'Sm': 'Samarium',
    'Sn': 'Tin',
    'Sr': 'Strontium',
    'Ta': 'Tantalum',
    'Tb': 'Terbium',
    'Tc': 'Technetium',
    'Te': 'Tellurium',
    'Th': 'Thorium',
    'Ti': 'Titanium',
    'Tl': 'Thallium',
    'Tm': 'Thulium',
    'Ts': 'Tennnessine',
    'U': 'Uranium',
    'V': 'Vanadium',
    'W': 'Tungsten',
    'Xe': 'Xenon',
    'Y': 'Yttrium',
    'Yb': 'Ytterbium',
    'Zn': 'Zinc',
    'Zr': 'Zirconium'
}


function is_digit(char) {
    return /\d/.test(char);
}

class Homonuclear {
    constructor(el = '', cnt = 1) {
        this.el = el;
        this.cnt = cnt;
    }
    toString() {
        return this.el + (this.cnt == 1 ? '' : String(this.cnt));
    }
    toHTML() {
        return this.el + (this.cnt == 1 ? '' : '<sub>' + String(this.cnt) + '</sub>');
    }
    countEls() {
        let res = {}; res[this.el] = this.cnt;
        return res;
    }
}

class Molecule {
    constructor(parts = [], coef = 1) {
        this.coef = coef;
        this.parts = parts;
    }
    add(comp) {
        this.parts.push(comp);
    }
    toString() {
        let res = (this.coef == 1 ? '' : String(this.coef)) + '(';
        for (let part of this.parts) {
            res += part.toString() + ' ';
        }
        return res.slice(0, -1) + ')';
    }
    toHTML() {
        let res = (this.coef == 1 ? '' : '<span class="mol-coef">' + String(this.coef) + '</span>');
        for (let part of this.parts) {
            res += part.toHTML();
        }
        return res;
    }
    countEls() {
        let res = {};
        for(let part of this.parts) {
            let histo = part.countEls();
            for (const [el, cnt] of Object.entries(histo)) {
                if (!(el in res)) {
                    res[el] = 0;
                }
                res[el] += cnt
            }
        }
        return res;
    }
}


// Molecules separated by +'s
class Expression {
    constructor() {
        this.mols = [];
    }
    add(mol) {
        this.mols.push(mol);
    }
    toString() {
        let res = '{';
        for (let mol of this.mols) {
            res += mol.toString() + ' + ';
        }
        return res.slice(0, -1) + '}';
    }
    toHTML() {
        let res = ''
        for (let mol of this.mols) {
            res += mol.toHTML() + ' + ';
        }
        return res.slice(0, -3);
    }
}

function get_next(automata, c) {
    let move = undefined;
    if (/[a-z]/.test(c)) {
        move = 'lower';
    } else if (/[A-Z]/.test(c)) {
        move = 'upper';
    } else if (/\d/.test(c)) {
        move = 'digit';
    } else {
        move = c;
    }
    console.log('   move', move);
    return (move in automata ? automata[move] : -1);
}

const parsingErrorMessages = new Map([
    ['default', 'Unnamed Error'],
    [-1, 'Unexpected Symbol'],
    [-2, 'invalid start to element\ name, must start with upper-case character'],
    [-3, 'invalid element name, can\'t have more than one lower-case character'],
    [-4, 'expected molecule before next \'+\' or end of expression'],
    [-5, 'molecule isn\'t complete, only a number']
]);

class ParsingError {
    constructor(idx, code) {
        this.idx = idx;
        this.code = code;
    }
    getMessage() {
        return parsingErrorMessages.has(this.code) ? parsingErrorMessages.get(this.code) : parsingErrorMessages.get('default');
    }
}

class Parser {
    constructor() {
        let self = this;
        this.automata = {
            0: {
                call: (c) => { self.mol = new Molecule(); self.expr = new Expression(); },

                'upper': 1,
                'digit': 6,
                'lower': -2,
                '+': -4
            }, // before expression

            1: {
                call: (c) => { self.comp = new Homonuclear(c); },

                'lower': 2,
                'upper': 8,
                'digit': 3,
                '+': 5
            }, // first letter of first element

            2: {
                call: (c) => { self.comp.el += c; },

                'lower': -3,
                'upper': 8,
                'digit': 3,
                '+': 5
            }, // second letter of element

            3: {
                call: (c) => { self.comp.cnt = c - '0'; },

                'lower': -2,
                'upper': 8,
                'digit': 4,
                '+': 5
            }, // first digit in number after element

            4: {
                call: (c) => {
                    self.comp.cnt *= 10;
                    self.comp.cnt += c - '0';
                },

                'lower': -2,
                'upper': 8,
                'digit': 4,
                '+': 5

            }, // non-first digit in number after element

            5: {
                call: (c) => {
                    self.mol.add(self.comp);
                    self.expr.add(self.mol);
                    self.mol = new Molecule();
                },

                'lower': -2,
                'upper': 1,
                'digit': 6,
                '+': -4
            }, // + after element and number

            6: {
                call: (c) => { self.mol.coef = c - '0'; },

                'lower': -2,
                'digit': 7,
                'upper': 1,
                '+': -5
            }, // first digit in number before molecule

            7: {
                call: (c) => {
                    self.mol.coef *= 10;
                    self.mol.coef += c - '0';
                },
                'lower': -2,
                'digit': 7,
                'upper': 1,
                '+': -5
            }, // non-first digit in number before molecule

            8: {
                call: (c) => {
                    self.mol.add(self.comp);
                    self.comp = new Homonuclear(c);
                },

                'lower': 2,
                'upper': 8,
                'digit': 3,
                '+': 5
            }, // first letter of non-first element
        };

    }
    run(text) {
        text += '+';
        this.num = 0;

        let state = 0;
        this.automata[state].call();

        let idx = -1;
        for (let c of text) {
            idx++;
            if (c == ' ') { continue; }
            let next = get_next(this.automata[state], c);
            console.log('next', next);
            if (next < 0) {
                return new ParsingError(idx, next);
            }
            state = next;
            console.log('current state:', state, ' | with char', c);
            let ret = this.automata[state].call(c)
            if (ret < 0) {
                return new ParsingError(idx, ret);
            }
        }
        return this.expr;
    }
}

function balanceEquation(left, right) {
    let mat = new RatMatrix();
    let elCount = 0;
    let elToIdx = {};

    for (let mol of left.mols.concat(right.mols)) {
        mat.appendCol();
        let histo = mol.countEls();
        for (const [el, cnt] of Object.entries(histo)) {
            if (!(el in elToIdx)) {
                elToIdx[el] = elCount++;
                mat.appendRow();
            }
            mat.table[elToIdx[el]][mat.width - 1] = (new Rational(cnt)).retMul(mat.width > left.mols.length ? -1 : 1);
        }
    }
    let sol = mat.solveHomWholes();
    let idx = 0;
    for (let mol of left.mols.concat(right.mols)) {
        mol.coef = sol[idx++];
    }
}                       