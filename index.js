//Dom variable
const computerGrid = document.querySelector(".computer__grid");
const userGrid = document.querySelector(".user__grid");

//Boolean contorl vaiable

let userWon = false;
let computerWon = false;

// Grid size varibles
const gridArraySize = 9;
const gridArraySizeCss = "nine";

// Grid arrays
const computerArr = Array.from({ length: gridArraySize }, () =>
  Array.from({ length: gridArraySize }, () => ""),
);
const userArr = Array.from({ length: gridArraySize }, () =>
  Array.from({ length: gridArraySize }, () => ""),
);

const computerStrikesGrid = Array.from({ length: gridArraySize }, () =>
  Array.from({ length: gridArraySize }, () => ""),
);

const userSrikesGrid = Array.from({ length: gridArraySize }, () =>
  Array.from({ length: gridArraySize }, () => ""),
);

// Ship objects
const computerShips = { a: [], b: [], c: [], s: [], d: [] };
const userShips = { a: [], b: [], c: [], s: [], d: [] };
const shipSizes = {
  a: 5,
  b: 4,
  c: 3,
  s: 3,
  d: 2,
};
const computerSunkenShips = [];
const userSunkenShips = [];

// populate grid function

const populateUserGrid = () => {
  userGrid.classList.add(`user__grid--${gridArraySizeCss}`);
  let count = 0;
  for (let i = 0; i < computerArr.length; i++) {
    for (let j = 0; j < computerArr[i].length; j++) {
      count += 1;
      const UserCell = document.createElement("div");
      UserCell.dataset.row = i;
      UserCell.dataset.position = j;
      UserCell.dataset.number = count;
      const userDiv = document.createElement("div");
      UserCell.classList.add("grid__cell", "grid__cell--user");
      userDiv.classList.add("cell__content");
      userGrid.appendChild(UserCell);
      UserCell.appendChild(userDiv);
    }
  }
};

const populateCompGrid = () => {
  computerGrid.classList.add(`computer__grid--${gridArraySizeCss}`);
  let count = 0;
  for (let i = 0; i < computerArr.length; i++) {
    for (let j = 0; j < computerArr[i].length; j++) {
      count += 1;
      const CompCell = document.createElement("div");
      CompCell.dataset.row = i;
      CompCell.dataset.position = j;
      CompCell.dataset.number = count;
      const compDiv = document.createElement("div");
      CompCell.classList.add("grid__cell", "grid__cell--computer");
      compDiv.classList.add("cell__content");
      computerGrid.appendChild(CompCell);
      CompCell.appendChild(compDiv);
    }
  }
};
populateUserGrid();
populateCompGrid();

// Place ships in gridArrays

const randomNumbers = () => {
  const randomDirection = Math.ceil(Math.random() * 4);
  const randomRow = Math.floor(Math.random() * gridArraySize);
  const randomPosition = Math.floor(Math.random() * gridArraySize);
  return [randomDirection, randomRow, randomPosition];
};

const checkSpaceAvailable = (arr, direction, row, position, length) => {
  const gridLength = arr.length;
  for (let i = 0; i < length; i++) {
    const r =
      direction === 1
        ? row - i
        : direction === 2 || direction === 4
          ? row
          : row + i;
    const p =
      direction === 1 || direction === 3
        ? position
        : direction === 2
          ? position + i
          : position - i;
    if (r < 0 || r >= gridLength || p < 0 || p >= gridLength) return false;
    if (arr[r][p] !== "") return false;
  }
  return true;
};

const placeShipsUserDisplay = (
  shipType,
  direction,
  startRow,
  startCol,
  gridType,
) => {
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
    if (row - (length - 1) < 0) return placeShips(arr, type, length, display);
    orientation = "vertical";
    for (let i = 0; i < length; i++) {
      arr[row - i][position] = type;
    }
    startRow = row - (length - 1);
    startCol = position;
  } else if (direction === 2) {
    if (position + (length - 1) >= gridLength)
      return placeShips(arr, type, length, display);
    orientation = "horizontal";
    for (let i = 0; i < length; i++) {
      arr[row][position + i] = type;
    }
    startRow = row;
    startCol = position;
  } else if (direction === 3) {
    if (row + (length - 1) >= gridLength)
      return placeShips(arr, type, length, display);
    orientation = "vertical";
    for (let i = 0; i < length; i++) {
      arr[row + i][position] = type;
    }
    startRow = row;
    startCol = position;
  } else if (direction === 4) {
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
    placeShipsUserDisplay(type, orientation, startRow, startCol);
  }
};


const shipPlacement = () => {
  Object.entries(shipSizes).forEach(([type, spaces]) => {
    placeShips(userArr, type, spaces, true);
    placeShips(computerArr, type, spaces);
  });
};
shipPlacement();

const handleSunkShip = () => {
  for (const [shipType, hits] of Object.entries(computerShips)) {
    const required = shipSizes[shipType];

    if (hits.length >= required && !computerSunkenShips.includes(shipType)) {
      computerSunkenShips.push(shipType);

      const totalShips = Object.keys(shipSizes).length;

      if (computerSunkenShips.length === totalShips) {
        console.log("USER WON!!! All ships sunk.");
        userWon = true;
      } else {
        alert(`You sank my ${shipType}!`);
      }
    }
  }

  console.log("Current sunken ships:", computerSunkenShips);
};

const addShipStrikes = (shipObj, type) => {
  shipObj[type] = [...shipObj[type], 1];
};

const handleUserSelection = (arr, cell, row, position, shipType) => {
  if (arr[row][position] === "hit" || arr[row][position] === "miss") return;
  const contentDiv = cell.querySelector(".cell__content");
  if (Object.keys(shipSizes).includes(shipType)) {
    arr[row][position] = "hit";
    addShipStrikes(computerShips, shipType);
    contentDiv.style.backgroundColor = "red";
    cell.style.backgroundColor = "green";
    contentDiv.style.border = "3px solid black";
  } else {
    arr[row][position] = "miss";
    contentDiv.style.backgroundColor = "white";
    contentDiv.style.border = "3px solid black";
    cell.style.backgroundColor = "#444";
  }
  setTimeout(() => {
    handleSunkShip();
  }, 2500);

  console.log(userSrikesGrid);
};

document.querySelectorAll(".grid__cell--computer").forEach((cell) =>
  cell.addEventListener("click", () => {
    const row = Number(cell.dataset.row);
    const position = Number(cell.dataset.position);
    const shipType = computerArr[row][position];
    return handleUserSelection(userSrikesGrid, cell, row, position, shipType);
  }),
);
