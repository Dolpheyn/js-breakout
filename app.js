var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Ball Variables
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

// Paddle Variables
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width / 2) - (paddleWidth / 2);
var paddleDx = 7;

// Controller Variables
var rightKeyIsPressed, leftKeyIsPressed;
var lost = false;

// Blocks variables
var blockWidth = 50;
var blockHeight = 10;
var blocks = [];
var blocksCount;

function keyDownHandler(event){

	if(event.keyCode == 39)
		rightKeyIsPressed = true;
	
	else if(event.keyCode == 37)
		leftKeyIsPressed = true;
}

function keyUpHandler(event){
	if(event.keyCode == 39)
		rightKeyIsPressed = false;

	else if(event.keyCode == 37)
		leftKeyIsPressed = false;
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function createBlocks(){
	var nextY = 5;
	var nextX = 5;
	for(var i = 0; i < 3; i++){

		for (var j = 0; j < 8; j++){
			var block = { x: nextX, y: nextY};
			blocks.push(block);
			var nextX = blocks[(i*8)+j].x + blockWidth + 10;
			prevY = blocks[i+j].y;
		}
		nextX = 5;
		nextY = prevY + 20;
	}
	console.log(blocks);
}

function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle="red";
	ctx.fill();
	ctx.closePath();
}

function drawBlocks(){
	blocksCount = 0;
	for(var i = 0; i < blocks.length; i++){
		if(blocks[i] != null){
			blocksCount++;
			ctx.beginPath();
			ctx.rect(blocks[i].x, blocks[i].y, 50, 10);
			ctx.fillStyle = "green";
			ctx.fill();
			ctx.closePath();
		}
	}
}

function draw() {
	
	// Clears canvas before drawing new ball instance.
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawBall();
	drawPaddle();
	drawBlocks();

	// Right and left wall collision detection.
	if( x + dx > canvas.width - ballRadius || x + dx < ballRadius){
		dx = -dx;
	}

	// Top wall collision detection.
	// Because canvas's y=0 is at the top, we can check if the ball has
	// touched the upper wall by checking if the ball's y position is
	// lower than the ball's radius.
	if( y + dy < ballRadius){
		dy = -dy;
	}

	// Ball passing bottom wall detection.
	if( y + dy > canvas.height + ballRadius){
		console.log("kalah");
		alert("KALAH. LOPEK. PONDAN.");
		lost = true;
	}
	
	// Ball and paddle collison detection.
	if( y + dy > canvas.height - paddleHeight - ballRadius && x + dx < (paddleX + paddleWidth) && x + dx > paddleX){
		dy = -dy;
	
	}

	// Restrict paddle from moving out of the canvas.
	if(rightKeyIsPressed && (paddleX+paddleWidth) < canvas.width)
		paddleX += paddleDx;
	if(leftKeyIsPressed && paddleX >0) 
		paddleX -= paddleDx;

	// Ball and blocks collision detection.
	for(var i = 0; i<blocks.length; i++){
		if(blocks[i] != null){
			if((y + dy - ballRadius) < blocks[i].y){
				if((x + dx) > blocks[i].x && (x + dx) < (blocks[i].x + blockWidth)){
					blocks[i] = null;
					dy = -dy;
				}
			}
		}
	}

	x += dx;
	y += dy;

	
	if(!lost) requestAnimationFrame(draw);
}

createBlocks();
drawBlocks();
requestAnimationFrame(draw);
