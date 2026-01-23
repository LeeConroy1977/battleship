Battleship plan

-------- general game rules --------

0. Each player has five ships, which can be placed horizontally or vertically.
1. The ships cover various grid spaces: Aircraft Carrier (5 spaces), a Battleship (4 spaces), a Cruiser (3 spaces), a Submarine (3 spaces), and a Destroyer (2 spaces),
2. User places thier ships on the user grid.
3. Computer randomly select ship placement on the computer grid.
4. User selects a square on the users computer display.
5. Computer randomly selects a square on the users grid.
6. If one of the oppositions ships does not take up that square, it is a miss.
7. If one of the oppositions ships does take up that square, it's a hit.
8. Each player takes a turn everytime.
9. If a player hits all the grid spaces where the oppositions ship is placed, the ship is sunk and destroyed.
10. A player wins when all the oppositions ships have been destroyed.

------- Game flow -------

- Game load and intro pop-up appears
- User selects easy, medium, hard.
- intro pop-up changes to intructions / Game story.
- User presses War button to start the game and users ships are randomly place. Displaying them on the screen.
- User selects a grid on the computer grid display.
- If it doesn't hit a grid cell where the computers ships are placed, the cell turns dark blue with a white peg in the middle. If Its a hit, the cell turns green with a red peg.
- The computer randomly selects a cell resulting in the above logic.
- if either player hits all cells that a ship occupies, the ship is sunk.
- On sinking a ship, a pop-up will appear saying "Hey, you sunk my battleship".
- The ship that was sunk will disappear from that players display of ships.
- The game continues until one player sinks all the other players battleships.
- A pop-up will appear, announcing the winner.
- The pop-up will have restart game and quit game buttons

-------- SUDO CODE --------

------ MVP -------

---- Intro pop-up

-- Difficulty level

Will have 4 buttons with eventListeners to select difficulty. These buttons will select a grid size. 9x9,10x10, 11x11, 12x12
A function called handleDifficulty(number: level) will set the value of a variable called gridSize.
A boolean vaiable called isLevelSelected will be set to true and will be used to display the next pop-up content.

-- Start Game pop-up

will have a button with an eventListener to start the game.
A boolean variable called start game will be set to true and the pop-up will disappear and the game iterface will be displayed.

---- Game interface

-- Creating the grid

-Depending on the selected grid size, two arrays will be created called userArray and computerArray.
- A function called createGrid(arr, player) will create the grid by looping within a loop through the player or computer array and appending the cells to the player grid. Will access the cell.dataset to sort the row and column coordinates using the index.
- The ships will need to be placed into the arrays and will be id'd with "a", "b", "c", "s", "d".
- In order to place a ship in the array, I will need a random cell coordinate and a direction, North, South, East, West.
- A random helper function will choose a direction. 1,2,3,4. Representative of the direct. It will also choose a row number and column number.
- Another helper function will be needed to check the available space in that direction. To see if there are enough cells to fit the ship length and also to see if another ship is blocking that placement.
- A recursive function called placeShips(arr,shipType, shipLength) will check if there is available space for the ship. If not, it will call itself again. The fuction will conditionally check the direct and use the helper function checkSpace to see if there is space available or another ship had been placed there. If space, a for loop will enter into the array the ship id into the relevent cells.
- The placeShip functon will be called insde of another function 10 times with the relevent argument to place the ships inside of the two arrrays.

-- Selecting a cell

- A toggle boolean will organise whos turn it is.
- An eventListener with a foreach() for the cells will be need when a player clicks the cell. If dataset coordinated of the cell with give the values needed to loop through and check the player array. if an empty string, 0 will be assign to that array position. If there is a boat id, a 1 will be place there to signal a hit. According styles will be added.
I will need 2 player objects {a: [], b: [], C: [], s: [], d: []}. When there is a hit, I will push the ship id into the relevent object.array and use the length to signal when a ship is sunk. It will also be used to conditionally remove the ship from the ship display above the grid.

-- The computers selects a random cell

- To start the computer will just ramdomly select a cell using a function to select a cell.

-- Computer becomes intelligent after the first strike of a ship

if a cell hits a ship. The computer will store that cell coordinate and on it's next selection will choose an adjacent cell ain any direction if there is space. It will keeping doing this until it gets a second hit. It will then know the axis and only choose the adjacent cells in that direction untill the ship is sunk.

- This is the most complex part of the game.
- once a ship is hit, those coordinates will be passed to a targetUserShip(row, position, shipType, direction) function.
- The direction will be conditionally changed when the function is recursively used.
- a ramdom helper function will determine the direction of the next strike.



-- End game

- Using the objects of arrays that store the hits on various ships , on every cell click, a function will run and check if all the ships have the required length in the arrays. It will then turn either a user or computer variable to true which will display the game winner pop up

-- Game Winner pop-up

Constains buttons to quit game or to play again. Boolean based vaiables.





------Nice to have features-----

-Actual ships displayed on the players grid.
- A intercom displaying the enemies captain with some sarcastic, angry messages on every cell click to add to the game story.
- where the ships are displayed, when a ship is hit it actual show a red dot on that ship.
- aniamtion including splashing water or fire and smoke depending on a hit or miss 
