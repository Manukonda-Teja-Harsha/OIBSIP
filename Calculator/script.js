let display = document.getElementById("display");

function add(value) {
    if (display.innerText === "0") {
        display.innerText = value;
    } else {
        display.innerText += value;
    }

    // auto scroll to right (IMPORTANT FIX)
    display.scrollLeft = display.scrollWidth;
}

function clearDisplay() {
    display.innerText = "0";
}

function deleteLast() {
    let text = display.innerText;

    if (text.length <= 1) {
        display.innerText = "0";
    } else {
        display.innerText = text.slice(0, -1);
    }
}

function calculate() {
    try {
        let result = eval(display.innerText);
        display.innerText = result;

        display.scrollLeft = display.scrollWidth;
    } catch {
        display.innerText = "Error";
    }
}
