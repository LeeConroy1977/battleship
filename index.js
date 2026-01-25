const computerGrid = document.querySelector(".computer__grid");
const userGrid = document.querySelector(".user__grid");
const instructionsBtn = document.querySelector(".instructions-right__btn");
const instructionsScreen = document.querySelector(".instructions-screen");
const startScreen = document.querySelector(".start-screen");
const introPopUp = document.querySelector(".intro-pop-up");
const game = document.querySelector(".game");
const body = document.querySelector(".body");
const endWar = document.querySelector(".console__btn");
const sunkShipModal = document.querySelector(".sunk-ship-pop-up");
const sunkShipModalBtn = document.querySelector(".sunk-ship-pop-up__btn");
const winnerPopUp = document.querySelector(".winner-pop-up");
const winnerPopUpBtn = document.querySelector(".winner-pop-up__btn");
const shipDisplayComp = document.querySelector(".ships__container--computer");
const shipDisplayUser = document.querySelector(".ships__container--user");
const imageContainer = document.querySelector(".image-container__image");
let userGo = true;
let userWon = false;
let computerWon = false;
let firstComputerHit = false;
let targetMode = false;
let targetOrigin = { row: null, position: null };
let targetDirection = null;
let targetShipType = null;
let computerJustShot = false;
let computerTurnLocked = false;
let triedDirections = [];
let targetAxis = null;
let adjacentShipsArr = [];
let gridArraySize = 9;
let gridArraySizeCss = "eleven";
let computerArr;
let userArr;
let computerStrikesGrid;
let userSrikesGrid;
const computerSunkenShips = [];
const userSunkenShips = [];
const computerShips = { a: [], b: [], c: [], s: [], d: [] };
const userShips = { a: [], b: [], c: [], s: [], d: [] };
const shipSizes = {
  a: 5,
  b: 4,
  c: 3,
  s: 3,
  d: 2,
};

const bgMusic = new Audio(
  "./assets/sounds/this-is-suspense-end-of-the-line-181766.mp3",
);
bgMusic.loop = true;
bgMusic.volume = 0.8;
bgMusic.muted = false;

window.addEventListener("load", () => {
  bgMusic.play().catch(() => {});
});

const resetGame = () => {
  userGo = true;
  userWon = false;
  computerWon = false;
  firstComputerHit = false;
  removeShipDisplayClass();
};

const restartGame = () => {
  introPopUp.classList.remove("hidden");
  instructionsScreen.classList.remove("hidden");
  startScreen.classList.add("hidden");
  game.classList.add("hidden");
  body.classList.add("body");
  winnerPopUp.classList.add("hidden");
  sh.classList.add("hidden");
  resetTargetShip();
  removeShipDisplayClass();
  resetGame();
};

instructionsBtn.addEventListener("click", () => {
  instructionsScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  resetGame();
});

endWar.addEventListener("click", () => {
  restartGame();
});

sunkShipModalBtn.addEventListener("click", () => {
  sunkShipModal.classList.add("hidden");
});

winnerPopUpBtn.addEventListener("click", () => {
  restartGame();
});

const handleGameWinner = (player) => {
  setTimeout(() => {
    sunkShipModal.classList.add("hidden");
    winnerPopUp.classList.remove("hidden");

    let title = winnerPopUp.querySelector("h1");
    if (!title) {
      title = document.createElement("h1");
      winnerPopUp.appendChild(title);
    }
    title.textContent = `${player} Won the battle!`;
    userGo = false;
  }, 1500);
};

const handleShipDisplay = (player, shipType) => {
  document.querySelector(`.${shipType}__${player}`).classList.add("visability");
};

const removeShipDisplayClass = () => {
  document.querySelectorAll(".ship-image").forEach((image) => {
    image.classList.remove("visability");
  });
};

const userHitEffect = (element) => {
  const originalBg =
    element === body
      ? "hsl(150, 15%, 13%)"
      : element === imageContainer
        ? "#19191a"
        : "rgb(48, 107, 52)";
  setTimeout(() => {
    element.style.backgroundColor = "red";
  }, 150);
  setTimeout(() => {
    element.style.backgroundColor = "orange";
  }, 300);
  setTimeout(() => {
    element.style.backgroundColor = "red";
  }, 450);
  setTimeout(() => {
    element.style.backgroundColor = "orange";
  }, 600);
  setTimeout(() => {
    element.style.backgroundColor = "red";
  }, 750);
  setTimeout(() => {
    element.style.backgroundColor = "orange";
  }, 900);
  setTimeout(() => (element.style.backgroundColor = originalBg), 1050);
};

document.querySelectorAll(".start-right__btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const difficulty = btn.dataset.difficulty;

    if (difficulty === "easy") {
      gridArraySize = 9;
      gridArraySizeCss = "nine";
    } else if (difficulty === "medium") {
      gridArraySize = 10;
      gridArraySizeCss = "ten";
    } else if (difficulty === "insane") {
      gridArraySize = 11;
      gridArraySizeCss = "eleven";
    } else {
      return;
    }

    userGrid.innerHTML = "";
    computerGrid.innerHTML = "";
    userGrid.classList.remove(
      "user__grid--nine",
      "user__grid--ten",
      "user__grid--eleven",
    );
    computerGrid.classList.remove(
      "computer__grid--nine",
      "computer__grid--ten",
      "computer__grid--eleven",
    );

    userGrid.classList.add(`user__grid--${gridArraySizeCss}`);
    computerGrid.classList.add(`computer__grid--${gridArraySizeCss}`);

    computerArr = Array.from({ length: gridArraySize }, () =>
      Array(gridArraySize).fill(""),
    );
    userArr = Array.from({ length: gridArraySize }, () =>
      Array(gridArraySize).fill(""),
    );

    computerStrikesGrid = Array.from({ length: gridArraySize }, () =>
      Array(gridArraySize).fill(""),
    );
    userSrikesGrid = Array.from({ length: gridArraySize }, () =>
      Array(gridArraySize).fill(""),
    );

    Object.keys(userShips).forEach((key) => (userShips[key] = []));
    Object.keys(computerShips).forEach((key) => (computerShips[key] = []));
    computerSunkenShips.length = 0;
    userSunkenShips.length = 0;
    userWon = false;
    computerWon = false;
    userGo = true;

    populateUserGrid();
    populateCompGrid();
    shipPlacement();

    introPopUp.classList.add("hidden");
    game.classList.remove("hidden");
    body.classList.remove("body");
    bgMusic.muted = false;
    document.removeEventListener("click", enableAudio);
  });
});

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
  startPosition,
  gridType,
) => {
  const positionNum = startRow * gridArraySize + startPosition + 1;
  document.querySelectorAll(".grid__cell--user").forEach((cell) => {
    if (Number(cell.dataset.number) === positionNum) {
      const shipDisplayDiv = document.createElement("div");
      const innerShip = document.createElement("div");
      shipDisplayDiv.classList.add(`ship__${shipType}`);
      shipDisplayDiv.classList.add(`ship__${shipType}--${direction}`);
      shipDisplayDiv.classList.add(
        `${shipType}__${direction}--${gridArraySizeCss}`,
      );

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
  let startPosition = position;
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
    startPosition = position;
  } else if (direction === 2) {
    if (position + (length - 1) >= gridLength)
      return placeShips(arr, type, length, display);
    orientation = "horizontal";
    for (let i = 0; i < length; i++) {
      arr[row][position + i] = type;
    }
    startRow = row;
    startPosition = position;
  } else if (direction === 3) {
    if (row + (length - 1) >= gridLength)
      return placeShips(arr, type, length, display);
    orientation = "vertical";
    for (let i = 0; i < length; i++) {
      arr[row + i][position] = type;
    }
    startRow = row;
    startPosition = position;
  } else if (direction === 4) {
    if (position - (length - 1) < 0)
      return placeShips(arr, type, length, display);
    orientation = "horizontal";
    for (let i = 0; i < length; i++) {
      arr[row][position - i] = type;
    }
    startRow = row;
    startPosition = position - (length - 1);
  }
  if (display) {
    placeShipsUserDisplay(type, orientation, startRow, startPosition);
  }
};

const shipPlacement = () => {
  Object.entries(shipSizes).forEach(([type, spaces]) => {
    placeShips(userArr, type, spaces, true);
    placeShips(computerArr, type, spaces);
  });
};

const handleUserSunkShip = () => {
  let newlySunk = false;

  for (const [shipType, hits] of Object.entries(computerShips)) {
    const required = shipSizes[shipType];
    if (hits.length >= required && !computerSunkenShips.includes(shipType)) {
      computerSunkenShips.push(shipType);
      newlySunk = true;

      if (computerSunkenShips.length < Object.keys(shipSizes).length) {
        sunkShipModal.classList.remove("hidden");
        handleShipDisplay("computer", shipType);
      }
    }
  }

  if (computerSunkenShips.length === Object.keys(shipSizes).length) {
    userWon = true;
    handleGameWinner("You");
  }
};

const handleComputerSunkShip = () => {
  let newlySunk = false;

  for (const [shipType, hits] of Object.entries(userShips)) {
    const required = shipSizes[shipType];

    if (hits.length >= required && !userSunkenShips.includes(shipType)) {
      userSunkenShips.push(shipType);
      newlySunk = true;

      if (userSunkenShips.length < Object.keys(shipSizes).length) {
        sunkShipModal.classList.remove("hidden");
        handleShipDisplay("user", shipType);
      }
    }
  }

  if (userSunkenShips.length === Object.keys(shipSizes).length) {
    computerWon = true;
    handleGameWinner("Computer");
  }
};

const handleCellHitCss = (arr, cell, row, position) => {
  const contentDiv = cell.querySelector(".cell__content");
  arr[row][position] = "hit";
  contentDiv.style.backgroundColor = "red";
  cell.style.backgroundColor = "green";
  contentDiv.style.border = "3px solid black";
  contentDiv.style.zIndex = 50;
};
const handleCellMissCss = (arr, cell, row, position) => {
  const contentDiv = cell.querySelector(".cell__content");
  arr[row][position] = "miss";
  contentDiv.style.backgroundColor = "white";
  contentDiv.style.border = "3px solid black";
  cell.style.backgroundColor = "#444";
};

const getCell = (player, row, position) => {
  return Array.from(document.querySelectorAll(`.grid__cell--${player}`)).find(
    (c) =>
      Number(c.dataset.row) === row && Number(c.dataset.position) === position,
  );
};

const randomComputerCoordinates = () => {
  const row = Math.floor(Math.random() * gridArraySize);
  const position = Math.floor(Math.random() * gridArraySize);

  return [row, position];
};

const getAdjacentCell = (row, position, stepRow, stepPosition) => {
  const newRow = row + stepRow;
  const newposition = position + stepPosition;
  if (
    newRow < 0 ||
    newRow >= gridArraySize ||
    newposition < 0 ||
    newposition >= gridArraySize
  ) {
    return null;
  }
  return { row: newRow, position: newposition };
};

function resetTargetShip() {
  targetMode = false;
  targetOrigin = { row: null, position: null };
  targetDirection = null;
  targetShipType = null;
  firstComputerHit = false;
  triedDirections = [];
  targetAxis = null;
  if (adjacentShipsArr.length > 0) {
    const nextTarget = adjacentShipsArr.shift();
    targetMode = true;
    targetOrigin = {
      row: nextTarget.row,
      position: nextTarget.position,
    };
    targetShipType = nextTarget.shipType;
    firstComputerHit = true;
  }
}

const nextTarget = () => {
  while (adjacentShipsArr.length) {
    const next = adjacentShipsArr.shift();
    if (userShips[next.shipType].length < shipSizes[next.shipType]) {
      targetMode = true;
      targetOrigin = { row: next.row, position: next.position };
      targetShipType = next.shipType;
      triedDirections = [];
      targetDirection = null;
      targetAxis = null;
      return true;
    }
  }
  return false;
};

const huntShipAfterHit = () => {
  if (!targetMode || targetOrigin.row === null || !targetShipType) {
    const alreadyAdded = nextTarget();
    if (!alreadyAdded) {
      resetTargetShip();
      return false;
    }
  }

  if (!targetMode || targetOrigin.row === null || !targetShipType) {
    resetTargetShip();
    return false;
  }

  if (userShips[targetShipType].length >= shipSizes[targetShipType]) {
    resetTargetShip();
    return false;
  }

  if (!targetDirection) {
    const dirs = ["horizontal", "vertical"].filter(
      (d) => !triedDirections.includes(d),
    );
    if (!dirs.length) {
      resetTargetShip();
      return false;
    }
    targetDirection = dirs[0];
    triedDirections.push(targetDirection);
    targetAxis = "positive";
  }

  let shotFired = false;

  for (let attempt = 0; attempt < 2; attempt++) {
    let stepRow = 0;
    let stepCol = 0;

    if (targetDirection === "horizontal") {
      stepCol = targetAxis === "positive" ? 1 : -1;
    } else {
      stepRow = targetAxis === "positive" ? 1 : -1;
    }

    let r = targetOrigin.row;
    let p = targetOrigin.position;
    let target = null;

    while (true) {
      const next = getAdjacentCell(r, p, stepRow, stepCol);
      if (!next) break;

      if (computerStrikesGrid[next.row][next.position] === "") {
        target = next;
        break;
      }

      r = next.row;
      p = next.position;
    }

    if (target) {
      const { row, position } = target;
      const cell = getCell("user", row, position);
      const shipHere = userArr[row][position];

      if (shipHere && shipSizes[shipHere]) {
        computerStrikesGrid[row][position] = "hit";
        handleCellHitCss(computerStrikesGrid, cell, row, position);
        addShipStrikes(userShips, shipHere);
        userHitEffect(body);
        userHitEffect(shipDisplayUser);
        new Audio("./assets/sounds/explosion-sound-effect-425455.mp3").play();

        if (shipHere !== targetShipType) {
          const alreadyAdded = adjacentShipsArr.some(
            (ship) =>
              ship.row === row &&
              ship.position === position &&
              ship.shipType === shipHere,
          );

          if (!alreadyAdded) {
            adjacentShipsArr.push({
              row,
              position,
              shipType: shipHere,
            });
          }
        }
      } else {
        computerStrikesGrid[row][position] = "miss";
        handleCellMissCss(computerStrikesGrid, cell, row, position);
        new Audio("./assets/sounds/launching-missile-313226.mp3").play();

        targetAxis = targetAxis === "positive" ? "negative" : null;
        if (!targetAxis) targetDirection = null;
      }

      shotFired = true;
      break;
    }

    if (targetAxis === "positive") {
      targetAxis = "negative";
    } else {
      targetAxis = null;
      targetDirection = null;
      break;
    }
  }
  return shotFired;
};

const handleComputerSelection = (arr) => {
  if (userGo || computerTurnLocked) return;
  computerTurnLocked = true;
  let shotFired = false;

  while (!shotFired) {
    if (!targetMode) {
      const [row, position] = randomComputerCoordinates();
      const cell = getCell("user", row, position);

      if (arr[row][position] === "hit" || arr[row][position] === "miss") {
        continue;
      }

      const shipType = userArr[row][position];

      if (shipSizes[shipType]) {
        handleCellHitCss(arr, cell, row, position);
        addShipStrikes(userShips, shipType);
        userHitEffect(body);
        userHitEffect(shipDisplayUser);
        new Audio("./assets/sounds/explosion-sound-effect-425455.mp3").play();

        targetMode = true;
        targetOrigin = { row, position };
        targetShipType = shipType;
        triedDirections = [];
        targetDirection = null;
        targetAxis = null;
      } else {
        handleCellMissCss(arr, cell, row, position);
        new Audio("./assets/sounds/launching-missile-313226.mp3").play();
      }

      shotFired = true;
    } else {
      shotFired = huntShipAfterHit();
    }
  }

  userGo = true;
  setTimeout(handleComputerSunkShip, 2500);
  computerTurnLocked = false;
};

const addShipStrikes = (shipObj, type) => {
  shipObj[type] = [...shipObj[type], 1];
};

const handleUserSelection = (arr, cell, row, position, shipType) => {
  if (!userGo) return;
  if (arr[row][position] === "hit" || arr[row][position] === "miss") return;
  if (Object.keys(shipSizes).includes(shipType)) {
    handleCellHitCss(arr, cell, row, position);
    addShipStrikes(computerShips, shipType);
    userHitEffect(shipDisplayComp);
    userHitEffect(imageContainer);
    new Audio("./assets/sounds/explosion-sound-effect-425455.mp3").play();
  } else {
    handleCellMissCss(arr, cell, row, position);
    new Audio("./assets/sounds/launching-missile-313226.mp3").play();
  }
  setTimeout(() => {
    handleUserSunkShip();
  }, 2500);
  userGo = !userGo;
  setTimeout(() => {
    handleComputerSelection(computerStrikesGrid);
  }, 3000);
};

computerGrid.addEventListener("click", (e) => {
  const cell = e.target.closest(".grid__cell--computer");
  if (!cell) return;
  const row = Number(cell.dataset.row);
  const position = Number(cell.dataset.position);
  const shipType = computerArr[row][position];
  handleUserSelection(userSrikesGrid, cell, row, position, shipType);
});
