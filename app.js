import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.querySelector("#game-board");
const score = document.querySelector(".score");
const bestScore = document.querySelector(".bestScore");
let localBestScore = localStorage.getItem("localBestScore");
localBestScore =
	localStorage == null ? 0 : (localBestScore = JSON.parse(localBestScore));

let scoreValue,
	bestScoreValue = localBestScore;
let grid = null;

init();
function init() {
	scoreValue = 0;
	score.textContent = 0;
	bestScore.textContent = bestScoreValue;

	gameBoard.innerHTML = "";
	grid = new Grid(gameBoard);
	grid.randomEmptyCell().tile = new Tile(gameBoard);
	grid.randomEmptyCell().tile = new Tile(gameBoard);

	setupInput();
}

function setupInput() {
	window.addEventListener("keydown", hadleInput, { once: true });
	gameBoard.addEventListener("touchstart", handleTouchStart, { once: true });
}

async function hadleInput(e, arrow) {
	const key = arrow ? arrow : e.key;

	switch (key) {
		case "ArrowUp":
			if (!canMoveUp()) {
				setupInput();
				return;
			}
			await moveUp();
			break;
		case "ArrowDown":
			if (!canMoveDown()) {
				setupInput();
				return;
			}
			await moveDown();
			break;
		case "ArrowLeft":
			if (!canMoveLeft()) {
				setupInput();
				return;
			}
			await moveLeft();
			break;
		case "ArrowRight":
			if (!canMoveRight()) {
				setupInput();
				return;
			}
			await moveRight();
			break;
		default:
			setupInput();
			return;
	}

	// Other code I don't want to run if user didn't click any "arrow" key
	grid.cells.forEach((cell) => cell.mergeTiles());

	const newTile = new Tile(gameBoard);
	grid.randomEmptyCell().tile = newTile;

	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		newTile.waitForTransition(true).then(() => {
			alert("You lose");
			saveBestScore();
			init();
		});
		return;
	}

	setupInput();
}

function moveUp() {
	return slideTiles(grid.cellsByColumn);
}
function moveDown() {
	return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}
function moveLeft() {
	return slideTiles(grid.cellsByRow);
}
function moveRight() {
	return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
	return Promise.all(
		cells.flatMap((group) => {
			const promises = [];

			for (let i = 1; i < group.length; i++) {
				const cell = group[i];
				if (cell.tile == null) continue;

				let lastValidCell;
				for (let j = i - 1; j >= 0; j--) {
					// console.log(j);
					const moveToCell = group[j];
					if (!moveToCell.canAccept(cell.tile)) break;
					lastValidCell = moveToCell;
				}
				if (lastValidCell != null) {
					promises.push(cell.tile.waitForTransition());
					if (lastValidCell.tile != null) {
						lastValidCell.mergeTile = cell.tile;
						addScore(cell.tile.value * 2);
					} else {
						lastValidCell.tile = cell.tile;
					}
					cell.tile = null;
				}
			}
			return promises;
		})
	);
}

function canMoveUp() {
	return canMove(grid.cellsByColumn);
}
function canMoveDown() {
	return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}
function canMoveLeft() {
	return canMove(grid.cellsByRow);
}
function canMoveRight() {
	return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
	return cells.some((group) => {
		return group.some((cell, index) => {
			if (index === 0) return false;
			if (cell.tile == null) return false;
			const moveToCell = group[index - 1];
			return moveToCell.canAccept(cell.tile);
		});
	});
}

// Mobile Slide
let xDown = null,
	yDown = null,
	xUp = null,
	yUp = null,
	xDiff = null,
	yDiff = null;

function getTouches(e) {
	return e.touches;
}

function handleTouchStart(e) {
	e.preventDefault();

	const firstTouch = getTouches(e)[0];
	xDown = firstTouch.clientX;
	yDown = firstTouch.clientY;
	window.addEventListener("touchmove", handleTouchMove, { once: true });
}

function handleTouchMove(e) {
	e.preventDefault();

	if (!xDown || !yDown) return;

	xUp = e.touches[0].clientX;
	yUp = e.touches[0].clientY;
	xDiff = xDown - xUp;
	yDiff = yDown - yUp;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {
		if (xDiff > 0) {
			/* left swipe */
			hadleInput(e, "ArrowLeft");
		} else {
			/* right swipe */
			hadleInput(e, "ArrowRight");
		}
	} else {
		if (yDiff > 0) {
			/* up swipe */
			hadleInput(e, "ArrowUp");
		} else {
			/* down swipe */
			hadleInput(e, "ArrowDown");
		}
	}

	/* reset values */
	xDown = null;
	yDown = null;
}

// Score
function addScore(value) {
	score.textContent = parseInt(score.textContent) + value;
}
function saveBestScore() {
	if (bestScoreValue >= parseInt(score.textContent)) return;
	bestScoreValue = parseInt(score.textContent);

	// updat value
	localBestScore = bestScoreValue;

	// save to localStorage
	localStorage.setItem("localBestScore", JSON.stringify(localBestScore));
}
