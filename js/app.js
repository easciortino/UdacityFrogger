// global values for gameplay
var playable_rows = [120, 203, 286];
var playable_columns = [0, 101, 202, 303, 404];
var collision_buffer_x = 60;
var collision_buffer_y = 60;

// Enemies our player must avoid
var Enemy = function(row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

	this.x = playable_columns[Math.floor(Math.random()*playable_columns.length)];
	this.y = row;
	this.speed = this.setSpeed();

	
// Playable width for enemy units
	this.x_min = playable_columns[0]-150;
	this.x_max = playable_columns[playable_columns.length-1]+150;
	
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

	this.checkCollision();
};


// Draw the enemy on the screen, required method for game

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Sets enemy speed randomly from a set range of values

Enemy.prototype.setSpeed = function(){
	this.moveable_speeds = [350, 300, 275, 250, 200, 175, 150, 100, 70];
	return this.moveable_speeds[Math.floor(Math.random()*this.moveable_speeds.length)];
};

// Reset the enemy once it moves off the screen.  Resets both speed and position

Enemy.prototype.reset = function(){
	this.x = this.x_min;
	this.speed = this.setSpeed();
};

// Checks for collisions with player and invokes 
// gameProperties.enemyCollision if collision has occurred

Enemy.prototype.checkCollision = function(){
	if (player.x >= this.x - collision_buffer_x && player.x <= this.x + collision_buffer_x){
	    if (player.y >= this.y - collision_buffer_y && player.y <= this.y + collision_buffer_y){
		gameProperties.enemyCollision();
	    }
	}
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
}

// Updates player sprite assignment
Player.prototype.update = function(){
	this.sprite = gameProperties.availablePlayers[gameProperties.currentPlayer];
};

// Draws player on screen
Player.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Handles user input on keyboard when game is in play mode to navigate player
// Calls gameProperties.waterCollision when player reaches the water

Player.prototype.handleInput = function(key){
	
	if (key === 'up'){
		this.y -= 83;
		if (this.y < this.y_min){
			gameProperties.waterCollision();
		}
	}else if (key === 'down' && this.y < this.y_max){
		this.y += 83;
	}else if (key === 'left' && this.x > this.x_min){
		this.x -= 101;
	}else if (key === 'right' && this.x < this.x_max){
		this.x += 101;
	}	
};


// Resets player position 

Player.prototype.reset = function(){
	this.x = this.default_x;
	this.y = this.default_y;
};



// Extras that the player may collect for additional points
// Constructor calls reset function to instantiate its 
// sprite, x and y values with random values

var Extra = function(){
	this.reset();
};

// Function which updates extra and checks for player collisions

Extra.prototype.update = function(){
	this.checkCollision();
};

// Checks for player collisions and calls gameProperties.extraCollision if 
// collision has occurred.

Extra.prototype.checkCollision = function(){
	if (player.x >= this.x - collision_buffer_x && player.x <= this.x + collision_buffer_x){
	    if (player.y >= this.y - collision_buffer_y && player.y <= this.y + collision_buffer_y){
		gameProperties.extraCollision();
	    }
	}
};

// Resets extra to random row, column and sprite values

Extra.prototype.reset = function(){
	this.sprite = gameProperties.availableExtras[Math.floor(Math.random()*3)];
	this.x = playable_columns[Math.floor(Math.random()*5)];
	this.y = playable_rows[Math.floor(Math.random()*3)];
};


// Returns the point value for each sprite

Extra.prototype.getValue = function(){

	if (this.sprite === 'images/GemOrange.png'){
		return 25;
	}else if(this.sprite === 'images/GemBlue.png'){
		return 50;
	}else if (this.sprite === 'images/GemGreen.png'){
		return 75;
	}

};

// Draws extras on screen

Extra.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);	
};


// Start Menu that shows before gameProperties.gameStarted is set to true
// Displays How-to-Play information and point distribution

var StartMenu = function(){
	this.alpha = 0.90;
};

// Renders start menu on screen

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


// Handles user input before gameProperties.gameStarted is set to true
// Used to select player sprite and difficulty and to begin game.

StartMenu.prototype.handleInput = function(key){

	if (key === 'enter'){
		gameProperties.setDifficulty();
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
	}else if (key === 'down'){
		if (gameProperties.availableDifficulty[gameProperties.currentDifficulty + 1]){
			gameProperties.currentDifficulty++;
		}else{
			gameProperties.currentDifficulty = 1;
		}
	}

};


// Pause menu that is shown whenever gameProperties.gamePaused is true
// Displayed whenever spacebar is pressured while game is in play mode

var PauseMenu = function(){
	this.alpha = 0.90;
};


// Renders pause menu on screen

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

// Handles input when game is in pause mode
// Allows user to reset game

PauseMenu.prototype.handleInput = function(key){
	if (key === 'enter'){
		gameProperties.reset();
	}

};

// Class that holds basic game information

var GameProperties = function(){

	this.gameStarted = false;
	this.gamePaused = false;
	this.availableExtras = [
		'images/GemOrange.png', 
		'images/GemBlue.png', 
		'images/GemGreen.png'
	];
	
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

	this.sounds = {
		enemy: new Audio('sounds/button-10.wav'),
		extra: new Audio('sounds/button-37.wav'),
		water: new Audio('sounds/button-09.wav')
	};

	this.currentScore = 0;
	this.highScore = 0;
	
	
};

// Resets game and returns to start menu

GameProperties.prototype.reset = function(){
		gameProperties.gameStarted = false;
		gameProperties.gamePaused = false;
		player.reset();
		gameProperties.currentPlayer = 0;
		gameProperties.currentDifficulty = 1;
		gameProperties.currentScore = 0;
		gameProperties.highScore = 0;
};


// Sets game difficulty by pushing new enemies to allEnemies
// array according to level of difficulty selected.  
// Resets allEnemies to an empty array each time it is called before building up
// new enemy array

GameProperties.prototype.setDifficulty = function(){
	allEnemies = [];
	for (var i = 0; i < this.currentDifficulty; i++){
		for (var j = 0; j < playable_rows.length; j++){	
			allEnemies.push(new Enemy(playable_rows[j]));
		}
	}
};


// Renders user’s current score on screen as well
// as high score for that session

GameProperties.prototype.renderScore = function(){
	ctx.fillStyle = 'white';	
	ctx.font = '15pt Courier, sans-serif';
	ctx.textAlign = 'left';
	
	if (gameProperties.currentScore > 0){
		ctx.fillText('SCORE: ' + gameProperties.currentScore, 10, 570);
	}

	
	ctx.textAlign = 'right';
	if (gameProperties.highScore > 0){
		ctx.fillText('HIGH SCORE: ' + gameProperties.highScore, ctx.canvas.width - 10, 570);
	}

};

// Handles resetting game properties in the event of an enemy collision
// and plays enemy collision sound

GameProperties.prototype.enemyCollision = function(){
	this.sounds.enemy.play();
	if (gameProperties.currentScore > gameProperties.highScore){
		gameProperties.highScore = gameProperties.currentScore;
	}
	gameProperties.currentScore = 0;

	currentExtra.reset();
	player.reset();

};

// Handles resetting game properties in the event of an extra collision
// and plays extra collision sound

GameProperties.prototype.extraCollision = function(){
	this.sounds.extra.play();
	gameProperties.currentScore += currentExtra.getValue();
	currentExtra.reset();

};

// Handles resetting game properties in the event of an water collision
// and plays water collision sound

GameProperties.prototype.waterCollision = function(){
	this.sounds.water.play();
	gameProperties.currentScore += 30;
	player.reset();

};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


// GameProperties Object that holds basic game and player info
var gameProperties = new GameProperties();

// Start Menu object shows at the beginning of game
var startMenu = new StartMenu();

// Pause Menu shown when game is paused
var pauseMenu = new PauseMenu();

// Array holding all enemy objects, filled by gameProperties.setDifficulty
var allEnemies = [];

// Object holding current Extra on screen
// In this version only one extra may be on screen at once
var currentExtra = new Extra();


// New player object
var player = new Player(205, 440, 400, 65, 440, 50);



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
	
	// Switches paused value whenever the spacebar is pressed
	if (allowedKeys[e.keyCode] == 'space'){
		gameProperties.gamePaused = !gameProperties.gamePaused;
	}

	// If game is not started, start menu will handle user input
	if (!gameProperties.gameStarted){
		startMenu.handleInput(allowedKeys[e.keyCode]);

	// If game is paused, pause menu will handle user input
	} else if (gameProperties.gamePaused){
		pauseMenu.handleInput(allowedKeys[e.keyCode]);

	// Otherwise, player will handle user input
	} else {
    		player.handleInput(allowedKeys[e.keyCode]);
	}
});


