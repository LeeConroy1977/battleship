"use strict";
// function called placeShipDisplay()
//uses the userArr
// manipulates the user__grid
// parameters - shipType, shipLength, direction,
//loop through array and find the first insatnt of shiptype.
Object.defineProperty(exports, "__esModule", { value: true });
const computerGrid = document.querySelector(".computer__grid");
const userGrid = document.querySelector(".user__grid");
const gridArraySize = 11;
const gridArraySizeCss = "eleven";
const computerArr = Array.from({ length: gridArraySize }, () => Array.from({ length: gridArraySize }, () => ""));
const userArr = Array.from({ length: gridArraySize }, () => Array.from({ length: gridArraySize }, () => ""));
const computerShips = { a: [], b: [], c: [], s: [], d: [] };
const userShips = { a: [], b: [], c: [], s: [], d: [] };
const shipSizes = {
    a: 5,
    b: 4,
    c: 3,
    s: 3,
    d: 2,
};
let count = 0;
for (let i = 0; i < computerArr.length; i++) {
    for (let j = 0; j < computerArr[i].length; j++) {
        count += 1;
        const CompCell = document.createElement("div");
        const UserCell = document.createElement("div");
        CompCell.classList.add("grid__cell", "grid__cell--computer");
        UserCell.classList.add("grid__cell", "grid__cell--user");
        CompCell.dataset.row = i;
        CompCell.dataset.position = j;
        CompCell.dataset.number = count;
        UserCell.dataset.row = i;
        UserCell.dataset.position = j;
        UserCell.dataset.number = count;
        const compDiv = document.createElement("div");
        const userDiv = document.createElement("div");
        compDiv.classList.add("cell__content");
        userDiv.classList.add("cell__content");
        CompCell.appendChild(compDiv);
        UserCell.appendChild(userDiv);
        computerGrid.appendChild(CompCell);
        userGrid.appendChild(UserCell);
    }
}
const randomNumbers = () => {
    const randomDirection = Math.ceil(Math.random() * 4);
    const randomRow = Math.floor(Math.random() * 11);
    const randomPosition = Math.floor(Math.random() * 11);
    return [randomDirection, randomRow, randomPosition];
};
const checkSpaceAvailable = (arr, direction, row, position, length) => {
    const gridLength = arr.length;
    for (let i = 0; i < length; i++) {
        const r = direction === 1
            ? row - i
            : direction === 2 || direction === 4
                ? row
                : row + i;
        const p = direction === 1 || direction === 3
            ? position
            : direction === 2
                ? position + i
                : position - i;
        if (r < 0 || r >= gridLength || p < 0 || p >= gridLength)
            return false;
        if (arr[r][p] !== "")
            return false;
    }
    return true;
};
const placeShipDisplay = (shipType, direction, startRow, startCol, gridType) => {
    const positionNum = startRow * gridArraySize + startCol + 1;
    document.querySelectorAll(".grid__cell--user").forEach((cell) => {
        if (Number(cell.dataset.number) === positionNum) {
            const shipDisplayDiv = document.createElement("div");
            const innerShip = document.createElement("div");
            shipDisplayDiv.classList.add(`ship__${shipType}`);
            shipDisplayDiv.classList.add(`ship__${shipType}--${direction}`);
            innerShip.classList.add(`ship__${shipType}--inner-ship`);
            cell.appendChild(shipDisplayDiv);
            shipDisplayDiv.appendChild(innerShip);
        }
    });
};
const placeShips = (arr, type, length, display = false) => {
    const [direction, row, position] = randomNumbers();
    const gridLength = arr.length;
    const isSpace = checkSpaceAvailable(arr, direction, row, position, length);
    let orientation = direction;
    let startRow = row;
    let startCol = position;
    if (!isSpace) {
        return placeShips(arr, type, length, display);
    }
    if (direction === 1) {
        // up
        if (row - (length - 1) < 0)
            return placeShips(arr, type, length, display);
        orientation = "vertical";
        for (let i = 0; i < length; i++) {
            arr[row - i][position] = type;
        }
        startRow = row - (length - 1);
        startCol = position;
    }
    else if (direction === 2) {
        // right
        if (position + (length - 1) >= gridLength)
            return placeShips(arr, type, length, display);
        orientation = "horizontal";
        for (let i = 0; i < length; i++) {
            arr[row][position + i] = type;
        }
        startRow = row;
        startCol = position;
    }
    else if (direction === 3) {
        // down
        if (row + (length - 1) >= gridLength)
            return placeShips(arr, type, length, display);
        orientation = "vertical";
        for (let i = 0; i < length; i++) {
            arr[row + i][position] = type;
        }
        startRow = row; // top cell
        startCol = position;
    }
    else if (direction === 4) {
        // left
        if (position - (length - 1) < 0)
            return placeShips(arr, type, length, display);
        orientation = "horizontal";
        for (let i = 0; i < length; i++) {
            arr[row][position - i] = type;
        }
        startRow = row;
        startCol = position - (length - 1);
    }
    if (display) {
        placeShipDisplay(type, orientation, startRow, startCol);
    }
};
const shipPlacement = () => {
    placeShips(computerArr, "a", 5);
    placeShips(computerArr, "b", 4);
    placeShips(computerArr, "c", 3);
    placeShips(computerArr, "s", 3);
    placeShips(computerArr, "d", 2);
    placeShips(userArr, "a", 5, true);
    placeShips(userArr, "b", 4, true);
    placeShips(userArr, "c", 3, true);
    placeShips(userArr, "s", 3, true);
    placeShips(userArr, "d", 2, true);
    computerGrid.classList.add(`computer__grid--${gridArraySizeCss}`);
    userGrid.classList.add(`user__grid--${gridArraySizeCss}`);
};
shipPlacement();
const userCells = document.querySelectorAll(".grid__cell--user");
let shipPlaced = false;
userCells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.position);
    const contentDiv = cell.querySelector(".cell__content");
    if (userArr[row][col] === "a" && !shipPlaced) {
        const shipDiv = document.createElement("div");
        shipDiv.classList.add("ship__aircraft--x");
        cell.appendChild(shipDiv);
        shipPlaced = true;
    }
});
console.log(userArr);
document.querySelectorAll(".grid__cell--computer").forEach((cell) => cell.addEventListener("click", () => {
    const cellRow = cell.dataset.row;
    const cellPosition = cell.dataset.position;
    const contentDiv = cell.querySelector(".cell__content");
    if (computerArr[cellRow][cellPosition] === "a" ||
        computerArr[cellRow][cellPosition] === "b" ||
        computerArr[cellRow][cellPosition] === "c" ||
        computerArr[cellRow][cellPosition] === "s" ||
        computerArr[cellRow][cellPosition] === "d") {
        computerArr[cellRow][cellPosition] = 1;
        contentDiv.style.backgroundColor = "red";
        cell.style.backgroundColor = "green";
        contentDiv.style.border = "3px solid black";
    }
    else {
        computerArr[cellRow][cellPosition] = 0;
        contentDiv.style.backgroundColor = "white";
        contentDiv.style.border = "3px solid black";
        cell.style.backgroundColor = "#444";
    }
}));
document.querySelectorAll(".grid__cell--user").forEach((cell) => cell.addEventListener("click", () => {
    const cellRow = cell.dataset.row;
    const cellPosition = cell.dataset.position;
    const contentDiv = cell.querySelector(".cell__content");
    if (userArr[cellRow][cellPosition] === "a" ||
        userArr[cellRow][cellPosition] === "b" ||
        userArr[cellRow][cellPosition] === "c" ||
        userArr[cellRow][cellPosition] === "s" ||
        userArr[cellRow][cellPosition] === "d") {
        userArr[cellRow][cellPosition] = 1;
        contentDiv.style.backgroundColor = "red";
        contentDiv.style.border = "3px solid black";
    }
    else {
        userArr[cellRow][cellPosition] = 0;
        contentDiv.style.backgroundColor = "white";
        contentDiv.style.border = "3px solid black";
    }
}));
//# sourceMappingURL=index.js.map