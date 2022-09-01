export default class Tile {
	#tileElement;
	#x;
	#y;
	#value;
	#COLOR = {
		2: ["hsl(30, 36%, 89%)", "#776e65"],
		4: ["hsl(42, 47%, 85%)", "#776e65"],
		8: ["hsl(27, 82%, 71%)", "#eeeeee"],
		16: ["hsl(22, 81%, 63%)", "#eeeeee"],
		32: ["hsl(11, 89%, 67%)", "#eeeeee"],
		64: ["hsl(11, 81%, 57%)", "#eeeeee"],
		128: ["hsl(48, 84%, 68%)", "#ffffff"],
		256: ["hsl(48, 85%, 62%)", "#ffffff"],
		512: ["hsl(48, 78%, 53%)", "#eeeeee"],
		1024: ["hsl(46, 74%, 54%)", "#eeeeee"],
		2048: ["hsl(50, 98%, 46%)", "#eeeeee"],
		4096: ["hsl(66, 81%, 68%)", "#776e65bb"],
		8192: ["hsl(98, 50%, 52%)", "#eeeeee"],
		16384: ["hsl(98, 62%, 43%)", "#eeeeee"],
		32768: ["hsl(98, 78%, 35%)", "#eeeeee"],
		65536: ["hsl(98, 90%, 24%)", "#eeeeee"],
	};

	constructor(tileContainer, textValue = Math.random() > 0.1 ? 2 : 4) {
		this.#tileElement = document.createElement("div");
		this.#tileElement.classList.add("tile");
		tileContainer.append(this.#tileElement);
		this.value = textValue;
	}

	get value() {
		return this.#value;
	}

	set value(v) {
		this.#tileElement.textContent = this.#value = v;
		this.#tileElement.style.backgroundColor = this.#COLOR[v][0];
		this.#tileElement.style.color = v > 4 ? "#eeeeee" : "#776e65";
	}

	set x(value) {
		this.#x = value;
		this.#tileElement.style.setProperty("--x", this.#x);
	}
	set y(value) {
		this.#y = value;
		this.#tileElement.style.setProperty("--y", this.#y);
	}

	remove() {
		this.#tileElement.remove();
	}

	waitForTransition(animation = false) {
		return new Promise((resolve) => {
			this.#tileElement.addEventListener(
				animation ? "animationend" : "transitionend",
				resolve,
				{
					once: true,
				}
			);
		});
	}
}
