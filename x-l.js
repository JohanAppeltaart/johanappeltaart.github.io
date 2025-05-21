"use strict";
// The line above causes JavaScript to crash on some errors that would otherwise remain hidden. Leave it there!

const matrix = [
  ["Name", "Age"],
  ["Frank", "42"],
  ["Timothy", "32"],
  ["Tibor", "35"],
];

function fromDataMakeTable(tbody) {
  let dataMatrix = JSON.parse(localStorage.getItem("storedTable"))
  if (!dataMatrix) {
    dataMatrix = [["Name"],["peter"]]
  }
  // console.log(dataMatrix)
  let headerRow = dataMatrix.shift()
  makeColumn (tbody, "")
  for (let peter = 0; peter < headerRow.length; peter++) {
    const value = headerRow[peter];
    makeColumn (tbody, value)
  }
  dataMatrix.forEach(row => {
    makeRow(tbody,row)
  });
}

function saveTableInMatrix(){
  const table = document.querySelector(".table")
  const tempMatrix = []
  // header
  let headerArr = []
  let theadChilds = table.children[0].children[0].children
  for (let i = 1; i < theadChilds.length; i++) {
    const head = theadChilds[i];
    headerArr.push(head.innerText)
  }
  tempMatrix.push(headerArr);
  

  // rows
  let tbodyRows = table.children[1].children
  for (let u = 0; u < tbodyRows.length; u++) {
    const row = tbodyRows[u].children;
    let row1 = []
    for (let j = 1; j < row.length; j++) {
      const rowX = row[j];
      row1.push(rowX.innerText)
    }
    tempMatrix.push(row1)
  }

  localStorage.setItem("storedTable", JSON.stringify(tempMatrix))
}

function start() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register("./serviceworker.js")
    .then(()=>console.log("SW Registered."))
    .catch((err)=> console.log(`error ${err}`))
 }
 

  makeDom(document.body, "header", "MegaSoft X-L");

  const main = makeDom(document.body, "main");

  const buttonsDiv = makeDom(main, "div", null, "buttons");

  const saveTable = makeDom(buttonsDiv, "button", "resetTable");
  saveTable.onclick = () => {
    // localStorage.setItem("storedTable", JSON.stringify(matrix))
    localStorage.clear()
    location.reload()
  };

  const columnButton = makeDom(buttonsDiv, "button", "Add column");
  columnButton.onclick = () => {
    makeColumn (tbody, prompt("What do you want to name the column?"));
  };


  const rowButton = makeDom(buttonsDiv, "button", "Add row");
  rowButton.onclick = () => {
    // makeRow(tbody, "joran", "21");
    makeRow(tbody);
  };

  const table = makeDom(main, "table", null, "table");
  const thead = makeDom(table, "thead");

  const tbody = makeDom(table, "tbody");
  tbody.id = "table-body";

  const tr1 = makeDom(thead, "tr", null, "headRow");

  fromDataMakeTable(tbody)
}

function makeRow(tbody, columnArray) {

  const columnAmount = document.querySelectorAll("th").length

  const newRow = makeDom(tbody, "tr");

  const thDelete = makeDom(newRow, "td", "✗", "delete");
  thDelete.setAttribute("role", "button");
  thDelete.addEventListener("click", () => {
    tbody.removeChild(newRow);
  });

  for (let i = 0; i < columnAmount-1; i++) {
    if (columnArray != undefined) {
      makeCell(newRow, columnArray[i]);
    }
    else{
      makeCell(newRow, "wow")
    }
  }

  saveTableInMatrix();
}

function makeCell(parent, value, classNameForDom, theader) {
  let cell;
  if(theader){
    cell = makeDom(parent, "th", value, classNameForDom);
  }else{
    cell = makeDom(parent, "td", value, classNameForDom);
  }

  cell.addEventListener("click", () => {
    let tempText = cell.innerText;
    cell.innerText = "";

    const input1 = makeDom(cell, "input");
    input1.value = tempText;

    input1.focus();

    input1.addEventListener("keydown", ({ key }) => {
      if (key === "Enter") {
        cell.innerText = input1.value;
        saveTableInMatrix();
      }
    });

    input1.addEventListener("blur", () => {
      cell.innerText = input1.value;
      saveTableInMatrix();
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


function makeColumn (tbody, name) {
    const headRow = document.querySelector(".headRow")
    makeCell(headRow,name,null, true)
    for (let x = 0; x < tbody.children.length; x++) {
      const row = tbody.children[x];
      makeCell(row, "");
    }
    saveTableInMatrix();
}

window.addEventListener("load", start);
