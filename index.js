//Dom variable
const computerGrid = document.querySelector(".computer__grid");
const userGrid = document.querySelector(".user__grid");

//Boolean contorl vaiable

// Grid size varibles
const gridArraySize = 11;
const gridArraySizeCss = "nine";

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
