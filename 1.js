$(document).ready(() => {
    addButtons();
});

function makeButton(row, col, label, extraClass) {
    var btn = document.createElement("Button");
    btn.innerHTML = label;
    var classList = extraClass ? [row, col, extraClass] : [row, col];
    btn.classList.add(...classList);
    btn.onclick = () => { buttonClicked(label) };
    return btn;
}

function addButtons() {
    var labels = ['AC', 'CE', '&divide', '&times', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'];
    var curIndex = 0;
    for (var r = 1; r <= 4; r++) {
        for (var c = 1; c <= 4; c++) {
            var btn = makeButton('row' + r, 'col' + c, labels[curIndex++]);
            if (r == 4 && c == 4) {
                btn.classList.add("eq");
            }
            document.getElementById("buttons").appendChild(btn);
        }
    }
    btn = makeButton('row5', 'col1', '0', 'zero');
    document.getElementById("buttons").appendChild(btn);

    btn = makeButton('row5', 'col3', '.');
    document.getElementById("buttons").appendChild(btn);
}

var overflown = false;
var evaluated = false;
var found = false;
var memory = {
    value: '',
    setValue: function (val) {
        if (overflown) return;
        if (val.length > 22) {
            this.value = "0";
            current.setValue("0");
            overflown = true;
            $('#memory').text("Digit Limit Met");
        } else {
            this.value = val; $('#memory').text(val);
        }
    },
    clear: function () { this.setValue("0"); },
    clearCurrent: function (cur) {
        var i = this.value.lastIndexOf(cur);
        if (i === this.value.length - cur.length) {
            this.setValue(this.value.slice(0, i));
            if (this.value.length == 0) {
                this.setValue("0");
            }
        }
    }
};
var current = {
    value: '',
    setValue: function (val) {
        if (overflown) return;
        if (val.length > 8) {
            current.setValue("0");
            memory.setValue("0");
            overflown = true;
            $('#memory').text("Digit Limit Met");
        } else {
            this.value = val; $('#current').text(val);
        }

        // find me
        if (val == 1124) {
            memory.setValue("Leif's phone unlocked!");
            found = true;
        } else if (val == 11.24) {
            memory.setValue("Leif's favorite date");
            found = true;
        } else if (val.toString() == "7.20") {
            memory.setValue("Pricess's birthday~");            
            found = true;
        }
    },
    clearCurrent: function () { this.setValue("0"); }
};

function buttonClicked(label) {
    if (found == true) {
        found = false;
        memory.setValue(current.value);
    }
    if (/[0-9]/.test(label)) {
        if (evaluated) {
            memory.setValue("0");
            current.setValue("0");
            evaluated = false;
        }
        overflown = false;
        memory.setValue((memory.value === "0" ? "" : memory.value) + label);
        current.setValue((current.value === "0" || isNaN(current.value) ? "" : current.value) + label);
    } else if (label === 'AC') {
        if (evaluated) {
            evaluated = false;
        }
        memory.clear();
        current.clearCurrent();
    } else if (label === 'CE') {
        if (evaluated) {
            memory.clear();
            current.clearCurrent();
            evaluated = false;
            return;
        }
        memory.clearCurrent(current.value);
        current.clearCurrent();
    } else if (label === "&divide") {
        label = "/";
        if (evaluated) {
            memory.setValue(current.value);
            evaluated = false;
        }
        if (!isNaN(current.value)) {
            memory.setValue(memory.value + label);
            current.setValue(label);
        }
    } else if (label === "&times") {
        label = "x";
        if (evaluated) {
            memory.setValue(current.value);
            evaluated = false;
        }
        if (!isNaN(current.value)) {
            memory.setValue(memory.value + label);
            current.setValue(label);
        }
    } else if (label === "+" || label === "-") {
        if (evaluated) {
            memory.setValue(current.value);
            evaluated = false;
        }
        if (!isNaN(current.value)) {
            memory.setValue(memory.value + label);
            current.setValue(label);
        }
    } else if (label === ".") {
        if (evaluated) {
            memory.setValue("0");
            current.setValue("0");
            evaluated = false;
        }
        overflown = false;
        if (current.value.indexOf(label) !== -1) return;
        memory.setValue(memory.value + label);
        current.setValue(current.value + label);
    } else if (label === "=") {
        if (memory.value === "0" || isNaN(current.value)) return;
        var exp = memory.value.replace(/x/g, "*");
        var res = eval(exp);
        if (res.toString().length > 8 && res < 99999999) {
            res = res.toPrecision(res < 1 ? 6 : 7);
        }
        memory.setValue(memory.value + "=" + Number(res));
        current.setValue(Number(res));
        evaluated = true;
    }
}