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

var memory = {
    value: '',
    setValue: function(val) { this.value = val; $('#memory').text(val); },
};
var current = {
    value: '',
    setValue: function(val) { this.value = val; $('#current').text(val); },
};

function buttonClicked(label) {
    if (/[0-9]/.test(label)) {
        memory.setValue(memory.value+label);
        current.setValue(current.value+label);
    }
}