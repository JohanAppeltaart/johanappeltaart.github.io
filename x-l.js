"use strict";
// The line above causes JavaScript to crash on some errors that would otherwise remain hidden. Leave it there!

function start() {
    makeDom(document.body, "header", "MegaSoft X-L");

    const main = makeDom(document.body, "main");

    const buttonsDiv = makeDom(main, "div", null, "buttons");

    const columnButton = makeDom(buttonsDiv, "button", "Add column");
    columnButton.onclick = () => {
        addColumn(tbody, "");
    };

    const rowButton = makeDom(buttonsDiv, "button", "Add row");
    rowButton.onclick = () => {
        // makeRow(tbody, "joran", "21");
        makeRow(
            tbody,
            "",
            ""
        );
    };

    const table = makeDom(main, "table");
    const thead = makeDom(table, "thead");

    const tr1 = makeDom(thead, "tr", null, "headRow");

    const th1 = makeDom(tr1, "th");
    const th2 = makeDom(tr1, "th", "Name");
    // const th3 = makeDom(tr1, "th", "Age1");

    const tbody = makeDom(table, "tbody");
    tbody.id = "table-body";

    const trFrank = makeRow(tbody, "Frank");

    const trTimothy = makeRow(tbody, "Timothy");

    const trTibor = makeRow(tbody, "Tibor");
}

function makeRow(tbody, col1) {
    const newRow = makeDom(tbody, "tr", null, null);
    const thDelete = makeDom(newRow, "td", "✗", "delete");
    thDelete.setAttribute("role", "button");

    const thName = makeCell(newRow, col1);
    for (let i = 0; i < columnAmount; i++) {
        makeCell(newRow, "");
    }

    thDelete.addEventListener("click", () => {
        tbody.removeChild(newRow);
    });
}

function makeCell(parent, value, classNameForDom) {
    const cell = makeDom(parent, "td", value, classNameForDom);

    cell.addEventListener("click", () => {
        let tempText = cell.innerText;
        cell.innerText = "";

        const input1 = makeDom(cell, "input");
        input1.value = tempText;

        input1.focus();

        input1.addEventListener("keydown", ({ key }) => {
            if (key === "Enter") {
                cell.innerText = input1.value;
            }
        });

        input1.addEventListener("blur", () => {
            cell.innerText = input1.value;
        });
    });

    return cell;
}
function makeDom(parent, name, text, className) {
    const element = document.createElement(name);
    if (text) {
        element.innerText = text;
    }

    if (className) {
        element.setAttribute("class", className);
    }

    if (parent) {
        parent.appendChild(element);
    }

    return element;
}

let columnAmount = 0;
function addColumn(tbody, name) {
    // let columnName = "WOw2";
    let columnName = prompt("What do you want to name the column?");
    4;
    if (columnName != "") {
        columnAmount += 1;
        const headRow = document.getElementsByClassName("headRow")[0];
        makeDom(headRow, "th", columnName);
        for (let row in tbody.children) {
            makeCell(tbody.children[row], name);
        }
    } else {
        alert("No name given");
    }
}

window.addEventListener("load", start);
