var PLAYABLE_ROWS = [120, 203, 286];
var PLAYABLE_COLUMNS = [0, 101, 202, 303, 404];
var moveable_speeds = [350, 300, 275, 250, 200, 175, 150, 100, 70];
var difficulty = [0, 1, 2];

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

	if (this.x > 505){
		this.x = -100
	}

	if (player.x >= this.x - 60 && player.x <= this.x + 60){
	    if (player.y >= this.y - 60 && player.y <= this.y + 60){
		player.score = 0;
		allExtras.pop();
		console.log(player.score);
		allExtras.push(new Extra(80, 200, 'images/game-over.png'));
	        player.x = player.default_x;
	        player.y = player.default_y;
	    }
	}
};

// Draw the enemy on the screen, required method for game

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.X_RANGE_MIN = -100;
Enemy.prototype.X_RANGE_MAX = 505;
Enemy.prototype.laneValuesY = [120, 203, 286];









// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(default_x, default_y, x_max, x_min, y_max, y_min){
	this.sprite = 'images/char-horn-girl.png';
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
};

Player.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key){
	if (key === 'up'){
		this.y -= 83;
		if (this.y < this.y_min){
			this.score += 30;
			this.x = this.default_x;
		    	this.y = this.default_y;
			console.log(this.score);
		}
	}else if (key === 'down' && this.y < this.y_max){
		this.y += 83;
	}else if (key === 'left' && this.x > this.x_min){
		this.x -= 101;
	}else if (key === 'right' && this.x < this.x_max){
		this.x += 101;
	}	
};




// Extras

var Extra = function(){
	this.sprite = this.availableExtras[Math.floor(Math.random()*3)];
	this.x = PLAYABLE_COLUMNS[Math.floor(Math.random()*5)];
	this.y = PLAYABLE_ROWS[Math.floor(Math.random()*3)];
	this.value = this.getValue();
};

Extra.prototype.update = function(){
	if (player.x >= this.x - 50 && player.x <= this.x + 50){
	    if (player.y >= this.y - 40 && player.y <= this.y + 40){
		player.score += this.value;
		allExtras.pop();
		allExtras.push(new Extra());
	    }
	}
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

Extra.prototype.availableExtras = ['images/GemOrange.png', 'images/GemBlue.png', 'images/GemGreen.png'];




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var allEnemies = [];
var allExtras = [];

var player = new Player(205, 440, 400, 65, 440, 50);

for (var i = 0; i <= difficulty[2]; i++){
	for (var j = 0; j < PLAYABLE_ROWS.length; j++){	
		allEnemies.push(new Enemy(PLAYABLE_ROWS[j]));
	}
}

allExtras.push(new Extra());



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
