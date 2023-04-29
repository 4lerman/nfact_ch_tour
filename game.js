let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let startGame = false;
function showElems() {
	document.getElementById("canvas").style.display = "block";
	document.getElementById("start_game").style.display = "none";
	startGame = true;
}

pos = { x: undefined, y: undefined };
let circleDots = [];
let click = false;
let dotCenter = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	r: 7,
};
let grading = false;
let percentage = 0;
let onetime = true;
let circleIsGood = undefined;

class circle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.r = 0.5;
		this.color = "#AEF359";
		this.distanceFromDot = undefined;
	}
	draw() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}
	distance(dotCenter) {
		let x = dotCenter.x;
		let y = dotCenter.y;
		this.distanceFromDot = (this.x - x) ** 2 + (this.y - y) ** 2;
	}
}

function setPosition(e) {
	pos.x = e.x;
	pos.y = e.y;
}
let was = 0;

function finishedToDraw(e) {
	was += 1;
	click = false;
	if (was > 1) grading = true;
	if (grading) {
		onetime = true;
		grade();
	}
}

function drawing(e) {
	click = true;
	if (grading) {
		circleDots = [];
		grading = false;
		main();
	}
}

window.addEventListener("mousemove", setPosition);
window.addEventListener("mouseup", finishedToDraw);
window.addEventListener("mousedown", drawing);

function calculatePercent(dots) {
	let percentages = 100;
	for (let i = 0; i < dots.length; i++) {
		dots[i].distance(dotCenter);
	}

	let firstPosDist =
		(dots[0].x - dotCenter.x) ** 2 + (dots[0].y - dotCenter.y) ** 2;

	for (let i = 0; i < dots.length; i++) {
		if (dots[i].distanceFromDot > firstPosDist) {
			let minus = dots[i].distanceFromDot - firstPosDist;
			percentages -= minus / 100000;
		} else {
			let minus = firstPosDist - dots[i].distanceFromDot;
			percentages -= minus / 100000;
		}
	}
	return percentages.toFixed(2);
}

function checkCircle(dots) {
	let range = 100;
	if (
		dots[dots.length - 1].x > dots[0].x - range &&
		dots[dots.length - 1].x < dots[0].x + range
	) {
		if (
			dots[dots.length - 1].y > dots[0].y - range &&
			dots[dots.length - 1].y < dots[0].y + range
		) {
			return true;
		} else return false;
	} else return false;
}

function grade() {
	if (onetime) {
		circleIsGood = checkCircle(circleDots);
		onetime = false;
		percentage = calculatePercent(circleDots);
		if (percentage < 0) {
			percentage = 0;
		}
	}
	if (circleIsGood) {
		grading = true;
		ctx.font = "60px Comfortaa";
		ctx.fillText(
			percentage + "%",
			canvas.width / 2 - 20,
			canvas.height / 2 - 20
		);
	} else {
		grading = true;
		ctx.font = "70px Comfortaa";
		ctx.fillText("XX.x" + "%", canvas.width / 2 - 100, canvas.height / 2 - 20);
	}

	requestAnimationFrame(grade);
}

function main() {
	grading = false;
	if (!grading) {
		if (startGame) {
			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			if (click) {
				circleDots.push(new circle(pos.x, pos.y));
			}
			for (let i = 0; i < circleDots.length; i++) {
				circleDots[i].draw();
			}

			ctx.fillStyle = "grey";
			ctx.arc(dotCenter.x, dotCenter.y, dotCenter.r, 0, Math.PI * 2);
			ctx.fill();

			for (let i = 0; i < circleDots.length; i++) {
				ctx.beginPath();
				ctx.lineWidth = 5;
				ctx.strokeStyle = circleDots[i].color;
				ctx.moveTo(circleDots[i].x, circleDots[i].y);
				ctx.lineTo(circleDots[i + 1].x, circleDots[i + 1].y);
				ctx.stroke();
			}
		}
	}
	requestAnimationFrame(main);
}
main();
