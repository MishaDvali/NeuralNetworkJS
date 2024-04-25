const abs = Math.abs
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const circleRadius = 10;
let circleX
let circleY
const circleSpeed = 2
let dx
let dy

let leftWall
let rightWall
let topWall
let BotWall

function Win() {
	alert("YOU WON. YOU LEFT LESS THAN 1% OF THE STARTING FIELD. " + FieldLeft().toString() + "% TO BE EXACT!!!")
}

function FieldLeft() {
	return 100 * ((rightWall - leftWall) * (BotWall - topWall)) / (canvas.width * canvas.height)
}

function Lose() {
	alert("YOU LEFT " + FieldLeft().toString() + "% OF THE FIELD")
}

function drawCircle() {
	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
	ctx.fill();
}


function updateCirclePosition() {
	circleX += dx;
	circleY += dy;

	if (isMoving) {
		if (sdy != 0) {
			if (sdy > 0) {
				if (abs(circleX - squareX) < circleRadius) {
					if (circleY - circleRadius < squareY) {
						Lose()
					}
				}
			} else {
				if (abs(circleX - squareX) < circleRadius) {
					if (circleY + circleRadius > squareY) {
						Lose()
					}
				}
			}
		}
		if (sdx != 0) {
			if (sdx > 0) {
				if (abs(circleY - squareY) < circleRadius) {
					if (circleX - circleRadius < squareX) {
						Lose()
					}
				}
			} else {
				if (abs(circleY - squareY) < circleRadius) {
					if (circleX + circleRadius > squareX) {
						Lose()
					}
				}
			}
		}
	}

	if (circleX + circleRadius > rightWall) {
		dx = -abs(dx);
	}
	if (circleX - circleRadius < leftWall) {
		dx = abs(dx)
	}
	if (circleY + circleRadius > BotWall) {
		dy = -abs(dy);
	}
	if (circleY - circleRadius < topWall) {
		dy = abs(dy)
	}

}




const squareSize = 10;
let squareX
let squareY
let isMoving
const squareSpeed = 10;
const squareCrossingSpeed = 10;
let sdx
let sdy


function drawSquare() {
	ctx.fillStyle = "blue";
	ctx.fillRect(squareX, squareY, squareSize, squareSize);
}

function isLeft() {
	return squareX <= leftWall
}

function isRight() {
	return squareX >= rightWall - squareSize
}

function isTop() {
	return squareY <= topWall
}

function isBot() {
	return squareY >= BotWall - squareSize
}



function MoveLeft() {
	if (squareY == topWall || squareY == BotWall - squareSize) {
		squareX -= squareCrossingSpeed;
	}
	if (isTop()) {
		squareY = topWall
	}
	if (isBot()) {
		squareY = BotWall - squareSize
	}
	if (isRight()) {
		squareX = rightWall - squareSize
	}
	if (isLeft()) {
		squareX = leftWall
	}

}

function MoveRigth() {
	if (squareY == topWall || squareY == BotWall - squareSize) {
		squareX += squareCrossingSpeed;
	}
	if (isTop()) {
		squareY = topWall
	}
	if (isBot()) {
		squareY = BotWall - squareSize
	}
	if (isRight()) {
		squareX = rightWall - squareSize
	}
	if (isLeft()) {
		squareX = leftWall
	}
}

function MoveUp() {
	if (squareX == leftWall || squareX == rightWall - squareSize) {
		squareY -= squareCrossingSpeed;
	}
	if (isTop()) {
		squareY = topWall
	}
	if (isBot()) {
		squareY = BotWall - squareSize
	}
	if (isRight()) {
		squareX = rightWall - squareSize
	}
	if (isLeft()) {
		squareX = leftWall
	}

}

function MoveDown() {
	if (squareX == leftWall || squareX == rightWall - squareSize) {
		squareY += squareCrossingSpeed;
	}
	if (isTop()) {
		squareY = topWall
	}
	if (isBot()) {
		squareY = BotWall - squareSize
	}
	if (isRight()) {
		squareX = rightWall - squareSize
	}
	if (isLeft()) {
		squareX = leftWall
	}
}

function ContinueCrossing() {
	squareX += sdx
	squareY += sdy

	// Determine the opposite direction based on the current direction
	let oppositeDirection;
	if (sdx > 0) {
		oppositeDirection = "left";
	} else if (sdx < 0) {
		oppositeDirection = "right";
	} else if (sdy > 0) {
		oppositeDirection = "up";
	} else if (sdy < 0) {
		oppositeDirection = "down";
	}

	switch (oppositeDirection) {
		case "left":
			// Draw line from (squareX, squareY) to (0, squareY)
			ctx.beginPath();
			ctx.moveTo(squareX, squareY);
			ctx.lineTo(leftWall, squareY);
			ctx.stroke();
			break;
		case "right":
			// Draw line from (squareX, squareY) to (canvasWidth, squareY)
			ctx.beginPath();
			ctx.moveTo(squareX, squareY);
			ctx.lineTo(rightWall, squareY);
			ctx.stroke();
			break;
		case "up":
			// Draw line from (squareX, squareY) to (squareX, 0)
			ctx.beginPath();
			ctx.moveTo(squareX, squareY);
			ctx.lineTo(squareX, topWall);
			ctx.stroke();
			break;
		case "down":
			// Draw line from (squareX, squareY) to (squareX, canvasHeight)
			ctx.beginPath();
			ctx.moveTo(squareX, squareY);
			ctx.lineTo(squareX, BotWall);
			ctx.stroke();
			break;
	}
	if (isTop() || isBot() || isRight() || isLeft()) {
		if (sdx != 0) {
			if (circleY < squareY) {
				BotWall = squareY
				squareY -= squareSize
			} else {
				topWall = squareY
			}
		} else {
			if (circleX < squareX) {
				rightWall = squareX
				squareX -= squareSize
			} else {
				leftWall = squareX
			}
		}

		isMoving = false
		sdx = 0
		sdy = 0
		return
	}

	requestAnimationFrame(ContinueCrossing)
}

function StartCrossing() {
	if (isMoving) {
		return
	}

	isMoving = true

	if (squareX == leftWall) {
		sdx = squareSpeed
	} else if (squareX == rightWall - squareSize) {
		sdx = -squareSpeed
	} else if (squareY == BotWall - squareSize) {
		sdy = -squareSpeed
	} else {
		sdy = squareSpeed
	}

	ContinueCrossing()

}

function UpdateTheGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	updateCirclePosition();
	drawCircle();
	drawSquare()
	ctx.beginPath();
	ctx.moveTo(leftWall, topWall);
	ctx.lineTo(rightWall, topWall);
	ctx.lineTo(rightWall, BotWall)
	ctx.lineTo(leftWall, BotWall)
	ctx.lineTo(leftWall, topWall)
	ctx.stroke();
	if (FieldLeft() <= 1) {
		Win()
	}
	requestAnimationFrame(UpdateTheGame);
}

function StartGame() {
	circleRadius = 10;
	circleX = 170;
	circleY = circleRadius;
	dx = circleSpeed;
	dy = circleSpeed;

	leftWall = 0
	rightWall = canvas.width
	topWall = 0
	BotWall = canvas.height




	squareSize = 10;
	squareX = 0;
	squareY = 0;
	isMoving = false;
	squareSpeed = 10;
	squareCrossingSpeed = 10;
	sdx = 0
	sdy = 0

	UpdateTheGame()
}



//------------------------------NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN
