let inputLeft = document.getElementById('eq-input-left');
let inputRight = document.getElementById('eq-input-right')

let errorDiv = document.getElementById('eq-error');
let displayDiv = document.getElementById('eq-display');

let balancedEqEl = document.getElementById('eq-balanced');
let balancedSection = document.getElementById('balanced-section');

let parserLeft = new Parser();
inputLeft.onchange = () => {
    console.log('parsing result: ' + parserLeft.run(inputLeft.value));
    updateEquation();
}
let parserRight = new Parser();
inputRight.onchange = () => {
    console.log('parsing result: ' + parserRight.run(inputRight.value));
    updateEquation();
}

for (let eqSide of document.getElementsByClassName('eq-input-side')) {
    eqSide.oninput = eqSide.onkeypress = eqSide.onpaste = (event) => { eqSide.onchange(event); }
}

function updateEquation() {
    let exprLeft = parserLeft.run(inputLeft.value);
    let exprRight = parserRight.run(inputRight.value);
    errorDiv.style.display = displayDiv.style.display = balancedSection.style.display = 'none';

    let badInput = null;
    let error = null;
    if (exprRight instanceof ParsingError) {
        error = exprRight;
        badInput = inputRight;
    }
    if (exprLeft instanceof ParsingError) {
        error = exprLeft;
        badInput = inputLeft;
    }
    if (error) {
        console.log('error', error);
        errorDiv.style.display = 'block';
        errorDiv.innerHTML = `Parsing Error: ${error === exprLeft ? 'left' : 'right'} equation at ${error.idx < badInput.value.length ? `character "${badInput.value[error.idx]}" (index ${error.idx})` : 'end'}<br>code ${error.code}: ${error.getMessage()}`
    } else {
        let normalized = false;
        for(let mol of exprLeft.mols.concat(exprRight.mols)) {
            if(mol.coef != 1) {
                normalized = true;
                mol.coef = 1;
            }
        }
        balancedSection.style.display = displayDiv.style.display = 'block';
        displayDiv.innerHTML = '<span id="normalized-note" style="font-size:large;color:#555"></span><br>' + exprLeft.toHTML() + ' <span style="font-size:50px">→</span> ' + exprRight.toHTML();

        if(normalized) {
            document.getElementById('normalized-note').innerHTML = 'Note: removed coefficients from molecules';
        }
        
        balanceEquation(exprLeft,exprRight);

        let validSol = false;
        for(let mol of exprLeft.mols.concat(exprRight.mols)) {
            if(mol.coef != 0) {
                validSol = true;
                break;
            }
        }
        if(validSol) {
            balancedEqEl.innerHTML = exprLeft.toHTML() + ' <span style="font-size:50px">→</span> ' + exprRight.toHTML();
        } else {
            balancedEqEl.innerHTML = 'NO SOLUTION (other than all zeroes)';
        }
    }
}

updateEquation();