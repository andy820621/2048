export default class Tile {
	#tileElement;
	#x;
	#y;
	#value;
	#COLOR = {
		2: "hsl(30, 36%, 89%)",
		4: "hsl(42, 47%, 85%)",
		8: "hsl(27, 82%, 71%)",
		16: "hsl(22, 81%, 63%)",
		32: "hsl(11, 89%, 67%)",
		64: "hsl(11, 81%, 57%)",
		128: "hsl(48, 84%, 68%)",
		256: "hsl(48, 85%, 62%)",
		512: "hsl(48, 78%, 53%)",
		1024: "hsl(46, 74%, 54%)",
		2048: "hsl(50, 98%, 46%)",
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
		const power = Math.log2(v);
		const backgroundLightness = 100 - power * 9;
		this.#tileElement.style.backgroundColor = this.#COLOR[v];
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
