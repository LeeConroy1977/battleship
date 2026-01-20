//Dom variable
const computerGrid = document.querySelector(".computer__grid");
const userGrid = document.querySelector(".user__grid");

//Boolean contorl vaiable

// Grid size varibles
const gridArraySize = 11;
const gridArraySizeCss = "eleven";

// Grid arrays
const computerArr = Array.from({ length: gridArraySize }, () =>
  Array.from({ length: gridArraySize }, () => ""),
);
const userArr = Array.from({ length: gridArraySize }, () =>
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
};

const shipPlacement = () => {
  Object.entries(shipSizes).forEach(([type, spaces]) => {
    placeShips(userArr, type, spaces, true);
    placeShips(computerArr, type, spaces);
  });
};
shipPlacement();
