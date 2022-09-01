const GRID_NUMBER = 4;
const GRID_GAP = 2;
const CELL_SIZE = 20;

export default class Grid {
	#cells;

	constructor(gridElemint) {
		document.body.style.setProperty("--grid-number", GRID_NUMBER);
		document.body.style.setProperty("--grid-gap", `${GRID_GAP}vmin`);
		document.body.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
		this.#cells = createCellElements(gridElemint).map((cellElement, index) => {
			return new Cell(
				cellElement,
				index % GRID_NUMBER,
				Math.floor(index / GRID_NUMBER)
			);
		});
	}

	get cells() {
		return this.#cells;
	}

	get cellsByColumn() {
		return this.#cells.reduce((cellGrid, cell) => {
			cellGrid[cell.x] = cellGrid[cell.x] || [];
			cellGrid[cell.x][cell.y] = cell;
			return cellGrid;
		}, []);
	}
	get cellsByRow() {
		return this.#cells.reduce((cellGrid, cell) => {
			cellGrid[cell.y] = cellGrid[cell.y] || [];
			cellGrid[cell.y][cell.x] = cell;
			return cellGrid;
		}, []);
	}
	get #emptyCells() {
		return this.#cells.filter((cell) => cell.tile == null);
	}

	randomEmptyCell() {
		const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
		// console.log(this.#emptyCells[randomIndex]);
		return this.#emptyCells[randomIndex];
	}
}

class Cell {
	#cellElement;
	#x;
	#y;
	#tile;
	#mergeTile;

	constructor(cellElement, x, y) {
		this.#cellElement = cellElement;
		this.#x = x;
		this.#y = y;
	}
	get x() {
		return this.#x;
	}
	get y() {
		return this.#y;
	}

	get tile() {
		return this.#tile;
	}

	set tile(value) {
		this.#tile = value;
		if (value == null) return;
		this.#tile.x = this.#x;
		this.#tile.y = this.#y;
	}

	get mergeTile() {
		return this.#mergeTile;
	}
	set mergeTile(value) {
		this.#mergeTile = value;
		if (value == null) return;
		this.#mergeTile.x = this.#x;
		this.#mergeTile.y = this.#y;
	}

	canAccept(tile) {
		return (
			this.tile == null ||
			(this.mergeTile == null && this.tile.value === tile.value)
		);
	}

	mergeTiles() {
		if (this.tile == null || this.mergeTile == null) return;
		this.tile.value = this.tile.value + this.mergeTile.value;
		this.mergeTile.remove();
		this.mergeTile = null;
	}
}

function createCellElements(gridContainer) {
	const cells = [];
	for (let i = 0; i < GRID_NUMBER * GRID_NUMBER; i++) {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		cells.push(cell);
		gridContainer.append(cell);
	}
	return cells;
}
