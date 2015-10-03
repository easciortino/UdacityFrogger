var PLAYABLE_ROWS = [120, 203, 286];
var PLAYABLE_COLUMNS = [0, 101, 202, 303, 404];
var COLLISION_BUFFER_X = 60;
var COLLISION_BUFFER_Y = 60;
var moveable_speeds = [350, 300, 275, 250, 200, 175, 150, 100, 70];

var GamePiece = function(){
	this.x = PLAYABLE_COLUMNS[Math.floor(Math.random()*PLAYABLE_COLUMNS.length)];
	this.y = PLAYABLE_ROWS[row];	
};


// Enemies our player must avoid
var Enemy = function(row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

	this.x = PLAYABLE_COLUMNS[Math.floor(Math.random()*PLAYABLE_COLUMNS.length)];
	this.y = row;
	this.speed = moveable_speeds[Math.floor(Math.random()*moveable_speeds.length)];


	this.x_min = PLAYABLE_COLUMNS[0]-150;
	this.x_max = PLAYABLE_COLUMNS[PLAYABLE_COLUMNS.length-1]+150;	
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

	this.x = this.x + (dt*this.speed);

	if (this.x > this.x_max){
		this.reset();
	}

	if (player.x >= this.x - COLLISION_BUFFER_X && player.x <= this.x + COLLISION_BUFFER_X){
	    if (player.y >= this.y - COLLISION_BUFFER_Y && player.y <= this.y + COLLISION_BUFFER_Y){
		if (gameProperties.currentScore > gameProperties.highScore){
			gameProperties.highScore = gameProperties.currentScore;
		}
		gameProperties.currentScore = 0;
		allExtras.pop();
		allExtras.push(new Extra(80, 200));
	        player.x = player.default_x;
	        player.y = player.default_y;
	    }
	}
};



// Draw the enemy on the screen, required method for game

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function(){
	this.x = this.x_min;
	this.speed = moveable_speeds[Math.floor(Math.random()*moveable_speeds.length)];
};








// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(default_x, default_y, x_max, x_min, y_max, y_min){
	this.sprite = gameProperties.availablePlayers[gameProperties.currentPlayer];
	this.x = default_x || 205;
	this.y = default_y || 440;
	this.default_x = default_x || 205;
	this.default_y = default_y || 440;
	this.x_max = x_max || 400;
	this.x_min = x_min || -100;
	this.y_max = y_max || 440;
	this.y_min = y_min || 50;
	this.score = 0;    
}


Player.prototype.update = function(){
	this.sprite = gameProperties.availablePlayers[gameProperties.currentPlayer];
};

Player.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key){
	
	if (key === 'up'){
		this.y -= 83;
		if (this.y < this.y_min){
			gameProperties.currentScore += 30;
			this.reset();
		}
	}else if (key === 'down' && this.y < this.y_max){
		this.y += 83;
	}else if (key === 'left' && this.x > this.x_min){
		this.x -= 101;
	}else if (key === 'right' && this.x < this.x_max){
		this.x += 101;
	}	
};

Player.prototype.reset = function(){
	this.x = this.default_x;
	this.y = this.default_y;

	if (!gameProperties.gameStarted){
		gameProperties.currentPlayer = 0;
	}

};



// Extras

var Extra = function(){
	this.reset();
};

Extra.prototype.update = function(){
	if (player.x >= this.x - 50 && player.x <= this.x + 50){
	    if (player.y >= this.y - 40 && player.y <= this.y + 40){
		gameProperties.currentScore += this.value;
		allExtras.pop();
		allExtras.push(new Extra());
	    }
	}
};

Extra.prototype.reset = function(){
	this.sprite = gameProperties.availableExtras[Math.floor(Math.random()*3)];
	this.x = PLAYABLE_COLUMNS[Math.floor(Math.random()*5)];
	this.y = PLAYABLE_ROWS[Math.floor(Math.random()*3)];
	this.value = this.getValue();
};

Extra.prototype.getValue = function(){

	if (this.sprite === 'images/GemOrange.png'){
		return 25;
	}else if(this.sprite === 'images/GemBlue.png'){
		return 50;
	}else if (this.sprite === 'images/GemGreen.png'){
		return 75;
	}

};

Extra.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);	
};



var StartMenu = function(){
	this.alpha = 0.90;
};

StartMenu.prototype.render = function(){
	ctx.globalAlpha = this.alpha
	ctx.fillStyle = 'azure';
	ctx.fillRect(40, 80, ctx.canvas.width - 80, ctx.canvas.height - 260);
	ctx.fillRect(165, 540, ctx.canvas.width - 330, ctx.canvas.height - 575);

	
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 10;
	ctx.strokeRect(40, 80, ctx.canvas.width - 80, ctx.canvas.height - 260);
	ctx.strokeRect(165, 540, ctx.canvas.width - 330, ctx.canvas.height - 575);
	

	ctx.fillStyle = 'black';
	ctx.font = '15pt Courier, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('How to Play', ctx.canvas.width/2, 110);

	ctx.font = '10pt Courier, monospace';
	ctx.textAlign = 'center';
	ctx.fillText('Earn as many points as you can without getting', ctx.canvas.width/2, 130);
	ctx.fillText('crushed by bugs and beat your HIGH SCORE!', ctx.canvas.width/2, 145);
	ctx.fillText('Navigate <UP, DOWN, RIGHT, LEFT> using arrow keys', ctx.canvas.width/2, 170);

	ctx.fillText('Press SPACEBAR at any time to pause the game', ctx.canvas.width/2, 185);

	ctx.drawImage(Resources.get('images/water-blockMini.png'), ctx.canvas.width/2 - 140, 200);	
	ctx.drawImage(Resources.get('images/water-blockMini.png'), ctx.canvas.width/2 - 110, 200);
	ctx.drawImage(Resources.get('images/water-blockMini.png'), ctx.canvas.width/2 - 80, 200);
	ctx.drawImage(Resources.get('images/water-blockMini.png'), ctx.canvas.width/2 - 50, 200);
	ctx.drawImage(Resources.get('images/water-blockMini.png'), ctx.canvas.width/2 - 20, 200);
	ctx.drawImage(Resources.get('images/water-blockMini.png'), ctx.canvas.width/2 + 10, 200);
	ctx.drawImage(Resources.get('images/water-blockMini.png'), ctx.canvas.width/2 + 40, 200);
	ctx.drawImage(Resources.get('images/water-blockMini.png'), ctx.canvas.width/2 + 70, 200);
	ctx.drawImage(Resources.get('images/water-blockMini.png'), ctx.canvas.width/2 + 100, 200);	

	ctx.fillStyle = 'white';
	ctx.fillText('Reaching the water earns 30 pts!', ctx.canvas.width/2 - 5, 220);


	ctx.fillStyle = 'black';
	ctx.fillText('Win extra points by collecting gems along the way:', ctx.canvas.width/2, 260);
	ctx.drawImage(Resources.get('images/GemOrangeMini.png'), ctx.canvas.width/2 -100, 265);			
	ctx.drawImage(Resources.get('images/GemBlueMini.png'), ctx.canvas.width/2 - 20, 265);
	ctx.drawImage(Resources.get('images/GemGreenMini.png'), ctx.canvas.width/2 + 55, 265);

	ctx.fillText('25 pts', ctx.canvas.width/2 -75, 325);
	ctx.fillText('50 pts', ctx.canvas.width/2, 325);
	ctx.fillText('75 pts', ctx.canvas.width/2 + 80, 325);


	ctx.fillText('Select difficulty using UP and DOWN arrow keys', ctx.canvas.width/2, 360);
	ctx.fillText('Select player using LEFT and RIGHT arrow keys', ctx.canvas.width/2, 380);
	ctx.fillText('Press ENTER to start playing!', ctx.canvas.width/2, 410);


	
	ctx.fillText('DIFFICULTY : ', ctx.canvas.width/2 - 25, 560);	
	ctx.textAlign = 'right';
	ctx.fillText(gameProperties.availableDifficulty[gameProperties.currentDifficulty].toUpperCase(), ctx.canvas.width/2 + 75, 560);
	
	ctx.globalAlpha = 1;
};

StartMenu.prototype.handleInput = function(key){

	if (key === 'enter'){
		gameProperties.gameStarted = true;

	}else if (key === 'space'){
		gameProperties.gamePaused = false;
	}else if (key === 'left'){
		if (gameProperties.currentPlayer > 0){
			gameProperties.currentPlayer--;
		}else{
			gameProperties.currentPlayer = gameProperties.availablePlayers.length-1;
		}
	}else if (key === 'right'){
		if (gameProperties.currentPlayer < gameProperties.availablePlayers.length-1){
			gameProperties.currentPlayer++;
		}else{
			gameProperties.currentPlayer = 0;
		}
	}else if (key === 'up'){
		if (gameProperties.availableDifficulty[gameProperties.currentDifficulty - 1]){
			gameProperties.currentDifficulty--;
		}else{
			gameProperties.currentDifficulty = 3
		}
		gameProperties.setDifficulty();
	}else if (key === 'down'){
		if (gameProperties.availableDifficulty[gameProperties.currentDifficulty + 1]){
			gameProperties.currentDifficulty++;
		}else{
			gameProperties.currentDifficulty = 1;
		}
		gameProperties.setDifficulty();
	}

	console.log(gameProperties.currentDifficulty);

};

var PauseMenu = function(){
	this.alpha = 0.90;
};

PauseMenu.prototype.render = function(){

	ctx.globalAlpha = this.alpha
	ctx.fillStyle = 'azure';
	ctx.fillRect(40, 80, ctx.canvas.width - 80, ctx.canvas.height - 260);
	
	ctx.fillStyle = 'black';
	ctx.font = '80pt Courier, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('PAUSE', ctx.canvas.width/2, 175);
	
	ctx.fillStyle = 'blue';

	ctx.font = '15pt Courier, sans-serif';
	ctx.fillText('Difficulty: ' + gameProperties.availableDifficulty[gameProperties.currentDifficulty], ctx.canvas.width/2, 230);

	ctx.font = '25pt Courier, sans-serif';
	ctx.fillText('High Score: ' + gameProperties.highScore, ctx.canvas.width/2, 280);
	ctx.fillText('Current Score: ' + gameProperties.currentScore, ctx.canvas.width/2, 320);

	ctx.fillStyle = 'black';	
	ctx.font = '10pt Courier, sans-serif';
	ctx.fillText('Press SPACEBAR to RESUME current game', ctx.canvas.width/2, 375);
	ctx.fillText('Press ENTER to RESET game', ctx.canvas.width/2, 400);
	
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 10;
	ctx.strokeRect(40, 80, ctx.canvas.width - 80, ctx.canvas.height - 260);
	ctx.globalAlpha = 1;

};

PauseMenu.prototype.handleInput = function(key){
	if (key === 'enter'){
		gameProperties.gameStarted = false;
		gameProperties.gamePaused = false;
		player.reset();
	}

};

var GameProperties = function(){

	this.gameStarted = false;
	this.gamePaused = false;
	this.availableExtras = [
		'images/GemOrange.png', 
		'images/GemBlue.png', 
		'images/GemGreen.png'
	];

	this.ExtrasValue = {
		orange: 25,
		blue: 50,
		green: 75
	};
	
	this.currentPlayer = 0;
	this.availablePlayers = [
		'images/char-boy.png',
		'images/char-horn-girl.png',
		'images/char-cat-girl.png',
		'images/char-pink-girl.png',
		'images/char-princess-girl.png'
	];


	this.currentDifficulty = 1;
	this.availableDifficulty = {
		1: 'Easy', 
		2: 'Medium',
		3: 'Hard'
	};

	this.currentScore = 0;
	this.highScore = 0;
	
	
};

GameProperties.prototype.setDifficulty = function(){
allEnemies = [];
for (var i = 0; i < this.currentDifficulty; i++){
	for (var j = 0; j < PLAYABLE_ROWS.length; j++){	
		allEnemies.push(new Enemy(PLAYABLE_ROWS[j]));
	}
}
};

GameProperties.prototype.renderScore = function(){

};

GameProperties.prototype.renderBackground = function(){

};

GameProperties.prototype.adjustScore = function(event){

};

GameProperties.prototype.resetScore = function(){
	this.currentScore = 0;
};



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var gameProperties = new GameProperties();
var startMenu = new StartMenu();
var pauseMenu = new PauseMenu();
var allEnemies = [];
var allExtras = [];
gameProperties.setDifficulty();

var player = new Player(205, 440, 400, 65, 440, 50);

allExtras.push(new Extra());



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
	13: 'enter',
	32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
	
	if (allowedKeys[e.keyCode] == 'space'){
		gameProperties.gamePaused = !gameProperties.gamePaused;
	}

	if (!gameProperties.gameStarted){
		startMenu.handleInput(allowedKeys[e.keyCode]);
	} else if (gameProperties.gamePaused){
		pauseMenu.handleInput(allowedKeys[e.keyCode]);
	} else {
    		player.handleInput(allowedKeys[e.keyCode]);
	}
});


