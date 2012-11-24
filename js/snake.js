(function ($) {

	var snake = function () {
		var canvas, ctx;
		var timeout;
		var speed = 200;
		var gameOver = false;
		var score = 0;
		var snakeArr, food;
		var sc = 20; // Size of snake cell
		var direction = 'right';

		var $canvas = $('#game-field');
		canvas = $canvas[0];
		ctx = canvas.getContext('2d');

		var w = $canvas.width();
		var h = $canvas.height();
		
		// Set snake
		var setSnake = function () {
			var length = 4; //Length of the snake
			snakeArr = [];
			for (var i = length - 1; i >= 0; i--) {
				snakeArr.push({
					x: i,
					y: 0
				});
			}
		}
		
		// Set food coordinates
		var setFood = function () {
			food = {
				x: Math.round(Math.random() * (w - sc) / sc),
				y: Math.round(Math.random() * (h - sc) / sc),
			};
		}
		
		// Draw cell on game field
		var drawCell = function (x, y, color) {
			ctx.fillStyle = color;
			ctx.fillRect(x * sc, y * sc, sc, sc);
			ctx.strokeStyle = "white";
			ctx.strokeRect(x * sc, y * sc, sc, sc);
		}
		// Check Collision
		var checkCollision = function (nx, ny, arr) {
			var snakeLoop = function (x, y, arr) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].x == x && arr[i].y == y) return true;
				}
				return false;
			}
			if (nx == -1 || nx == w / sc || ny == -1 || ny == h / sc || snakeLoop(nx, ny, arr)) {
				gameOver = true;
			}
		}
		// Change snake direction by pressing key
		var changeDirection = function (key) {
			if (key == 37 && direction != "right") {
				direction = "left";
			} else if (key == 38 && direction != "down") {
				direction = "up";
			} else if (key == 39 && direction != "left") {
				direction = "right";
			} else if (key == 40 && direction != "up") {
				direction = "down";
			};
		};
		// Show Game Over Message
		var gameOverMsg = function () {
			ctx.font = 'bold 30px sans-serif';
			ctx.fillStyle = '#333';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 2;
			var centreX = w / 2;
			var centreY = h / 2;
			ctx.fillText('Игра окончена', centreX, centreY - 10);		
			ctx.font = 'bold 14px sans-serif';
	    	ctx.fillText('Нажмите кнопку "ЗАНОВО" для новой игры', centreX, centreY + 15);			
		}
		// Draw game process
		var drawGame = function () {

			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, w, h);

			var nx = snakeArr[0].x;
			var ny = snakeArr[0].y;

			switch (direction) {
				case 'left':
					nx--;
					break;
				case 'up':
					ny--;
					break;
				case 'right':
					nx++;
					break;
				case 'down':
					ny++;
					break;
				default:
					throw ('Invalid direction');
			}
			checkCollision(nx, ny, snakeArr);
			if (nx == food.x && ny == food.y) {
				var tail = {
					x: nx,
					y: ny
				};
				score++;
				speed -= 20;
				$('.score i').text(score);
				setFood();
			} else {
				var tail = snakeArr.pop();
				tail.x = nx;
				tail.y = ny;
			}

			snakeArr.unshift(tail); 
			for (var i = 0; i < snakeArr.length; i++) {
				var c = snakeArr[i];
				drawCell(c.x, c.y, "blue");
			}
			drawCell(food.x, food.y, "red");

			$(document).keydown(function (evt) {
				changeDirection(evt.keyCode);
			});
		}

		var initGame = function () {
			setSnake();
			setFood();
			//drawGame();
			gameLoop();
		}

		var gameLoop = function () {
			drawGame();
			if (gameOver) {
				$('#restart').fadeToggle(200);
				clearInterval(timeout);
				gameOverMsg();
			} else timeout = setTimeout(gameLoop, speed);
		}
		initGame();
	};

	var startGame = function () {
		var name = $('#name').val();
		if (name) {
			$('.score b').text(name);
			$('#welcome').slideToggle(200);
				$('#game-area').fadeToggle(500, function () {
					snake();
				})
			
		} else {
			$('#name').popover('show')
		}
	}
	var restartGame = function () {		
		$('#restart').fadeOut(200);
		$('.score i').text(0);
		snake();
	}
	
	$('#name').focus(function () {
		$(this).popover('hide');
	});
	$('#name').popover({
		trigger: 'manual'
	});
	$('#name').keypress(function (e) {
		if (e.which == 13) startGame()
	});
	$('#start').click(function () {
		startGame()
	});
	$('#restart').click(function () {
		restartGame()
	});

})(jQuery);