//The title of this game is "Pong Remastered." It is a remastered version of the game "Pong" that was created in 1972 and released on the Atari.
//This declares all the variables and properties (with object) pertaining to the paddle.
var playerPaddle = {};
playerPaddle.xPaddle = getXPosition("paddle");
playerPaddle.yPaddle = getYPosition("paddle");
playerPaddle.paddleHeight = getProperty("paddle", "height");
playerPaddle.paddleWidth = getProperty("paddle", "width");
playerPaddle.xPaddleSpeed = 0;
playerPaddle.isPaddleMoving = false;
playerPaddle.thePaddleSpeed = 4;

//This declares all the variables and properties (with object) pertaining to the ball.
var gameBall = {};
gameBall.xBall = getXPosition("ball");
gameBall.yBall = getYPosition("ball");
gameBall.ballHeight = getProperty("ball", "height");
gameBall.ballWidth = getProperty("ball", "width");
gameBall.xBallSpeed = 0;
gameBall.yBallSpeed = 0;

//This declares all the variables and properties (with object) pertaining to the enemy paddle.
var enemyPaddle = {};
enemyPaddle.xEnemyPaddle = getXPosition("enemyPaddle");
enemyPaddle.yEnemyPaddle = getYPosition("enemyPaddle");
enemyPaddle.enemyPaddleHeight = getProperty("enemyPaddle", "height");
enemyPaddle.enemyPaddleWidth = getProperty("enemyPaddle", "width");
enemyPaddle.xEnemyPaddleSpeed = 0;
enemyPaddle.theEnemyPaddleSpeed = 5;

//This declares all the variables and properties (with object) pertaining to the game state.
var gameState = {};
gameState.isGameOn = false;
gameState.canGameBePlayed = false;
gameState.canPointsBeEarned = false;
gameState.playerWins;
gameState.enemyWins;
gameState.winRatio;

//This declares the two objects that will be used to update the two tables in the database.
var newPlayerRecord = {};
var newGameRecord = {};

//This declares the array that is used to display the people who have played the game.
var playerInformation = [];

//This reads the records from the database and assigns the human wins to player wins and the AI wins to enemy wins. It also assigns the right id to the newGameRecord.id and assigns the player win ratio to the property for the player win ratio.
readRecords("humanAgainstAI", {}, function(records) {
  newGameRecord.id = records[0].id;
  gameState.playerWins = records[0].humanWins;
  gameState.enemyWins = records[0].aiWins;
  gameState.winRatio = records[0].winRatio;
  gameState.canGameBePlayed = true;
});

//This begins the game.
function beginGame() {
  gameState.isGameOn = true;
  gameState.canPointsBeEarned = true;
  startBall();
  startAnimation();
}

//This gets the ball to start moving.
function startBall() {
  var xWhichWay = randomNumber(0, 1);
  var yWhichWay = randomNumber(0, 1);
  var xRandomSpeed = randomNumber(6, 8);
  var yRandomSpeed = randomNumber(6, 8);
  if (xWhichWay == 0) {
    gameBall.xBallSpeed = xRandomSpeed;
  } else {
    gameBall.xBallSpeed = -1 * xRandomSpeed;
  }
  if (yWhichWay == 0) {
    gameBall.yBallSpeed = yRandomSpeed;
  } else {
    gameBall.yBallSpeed = -1 * yRandomSpeed;
  }
}

//This starts the animation of all of the game objects and ensures that they move every 33 milliseconds.
function startAnimation() {
  timedLoop(33, function() {
  updatePlayerPaddle();
  updateBall();
  updateEnemyPaddle();
  checkPaddleCollisions();
  checkBoundaries();
  checkWinLose();
  });
}

// This checks if the player paddle is moving and updates its position if it is.
function updatePlayerPaddle() {
  if (playerPaddle.isPaddleMoving == true) {
    playerPaddle.xPaddle = playerPaddle.xPaddle + playerPaddle.xPaddleSpeed;
    setPosition("paddle", playerPaddle.xPaddle, playerPaddle.yPaddle);
  }
}

// This updates the ball's position.
function updateBall() {
  gameBall.xBall = gameBall.xBall + gameBall.xBallSpeed;
  gameBall.yBall = gameBall.yBall + gameBall.yBallSpeed;
  setPosition("ball", gameBall.xBall, gameBall.yBall);
}

// This updates the enemy paddle's position according to its AI.
function updateEnemyPaddle() {
  // This is essentially the AI for the enemy padddle.
  if (enemyPaddle.xEnemyPaddle < gameBall.xBall) {
    enemyPaddle.xEnemyPaddleSpeed = enemyPaddle.theEnemyPaddleSpeed;
    enemyPaddle.xEnemyPaddle = enemyPaddle.xEnemyPaddle + enemyPaddle.xEnemyPaddleSpeed;  
  }
  if (enemyPaddle.xEnemyPaddle > gameBall.xBall) {
    enemyPaddle.xEnemyPaddleSpeed = -1 * enemyPaddle.theEnemyPaddleSpeed;
    enemyPaddle.xEnemyPaddle = enemyPaddle.xEnemyPaddle + enemyPaddle.xEnemyPaddleSpeed;
  }
  setPosition("enemyPaddle", enemyPaddle.xEnemyPaddle, enemyPaddle.yEnemyPaddle);
}

// This checks if either paddle is colliding with the ball and changes the direction of the ball if it is.
function checkPaddleCollisions() {
  if (checkCollision(playerPaddle.xPaddle, playerPaddle.yPaddle, playerPaddle.paddleHeight, playerPaddle.paddleWidth, gameBall.xBall, gameBall.yBall, gameBall.ballHeight, gameBall.ballWidth) || checkCollision(enemyPaddle.xEnemyPaddle, enemyPaddle.yEnemyPaddle, enemyPaddle.enemyPaddleHeight, enemyPaddle.enemyPaddleWidth, gameBall.xBall, gameBall.yBall, gameBall.ballHeight, gameBall.ballWidth)) {
    // These if-loops prevent the ball's hitbox from meshing with the hitboxes of the paddles in such a way that the game glitches.
    if (gameBall.yBall > 400) {
      gameBall.yBall = 400;
    }
    if (gameBall.yBall < 10) {
      gameBall.yBall = 10;
    }
    gameBall.yBallSpeed = -1 * gameBall.yBallSpeed;
  }
}

//This checks if two objects are colliding.
function checkCollision(x1, y1, h1, w1, x2, y2, h2, w2) {
  return x1<x2+w2 && x1+w1>x2 && y1<y2+h2 && y1+h1>y2;
}

// This prevents the player paddle and the ball from moving out of the boundaries.
function checkBoundaries() {
  //These if-loops prevent the player paddle from going off of the screen.
  if (playerPaddle.xPaddle < 0) {
    playerPaddle.xPaddle = 0;
  }
  if (playerPaddle.xPaddle > 280) {
    playerPaddle.xPaddle = 280;
  }
  //This prevents the ball from going off of the screen. The enemy paddle follows the ball, meaning that the enemy paddle does not go off the screen because the ball does not go off the screen.
  if (gameBall.xBall < 0 || gameBall.xBall > 280) {
    gameBall.xBallSpeed = gameBall.xBallSpeed * -1;
  }
}

// This checks if the game has ended and then disables the game objects, checks if either the player or the AI has won, and displays the statistics about human and AI wins if the game has ended.
function checkWinLose() {
  if ((gameBall.yBall < 0 || gameBall.yBall > 410) && gameState.canPointsBeEarned == true) {
    disableGameObjects();
    checkWhoWon();
    showStatistics();
  }
}

// This prevents the game objects from continuing to move after the game has finished.
function disableGameObjects() {
  playerPaddle.isPaddleMoving = false;
  
  gameState.canGameBePlayed = false;
  gameState.isGameOn = false;
  gameState.canPointsBeEarned = false;
  stopTimedLoop();
}

// This determines who won the game and sets the properties of the object newGameRecord accordingly.
function checkWhoWon() {
  if (gameBall.yBall < 0) {
    gameState.playerWins++;
    newGameRecord.humanWins = gameState.playerWins;
    newGameRecord.aiWins = gameState.enemyWins;
    newPlayerRecord.winLoseAI = "Win";
    setProperty("winLoseLabel", "text-color", "green");
    setText("winLoseLabel", "You won!");
  } else {
    gameState.enemyWins++;
    newGameRecord.humanWins = gameState.playerWins;
    newGameRecord.aiWins = gameState.enemyWins;
    newPlayerRecord.winLoseAI = "Lose";
    setProperty("winLoseLabel", "text-color", "red");
    setText("winLoseLabel", "You lost!");
  }
  gameState.winRatio = Math.round((gameState.playerWins / (gameState.enemyWins + gameState.playerWins)) * 100);
  newGameRecord.winRatio = gameState.winRatio;
}

// This displays the statistics regarding the ratio of how many times the human player has won compared to how many times the enemy AI has won.
function showStatistics() {
  setText("playerWinsLabel", "Player Wins: " + gameState.playerWins);
  setText("enemyWinsLabel", "AI Wins: " + gameState.enemyWins);
  setText("winRatioLabel", "Win Ratio: " + gameState.winRatio + "%");
  setScreen("overScreen");
}

//This resets the game state, the paddles, and the ball at the beginning of the game.
function resetAll() {
  resetGameState();
  resetPaddles();
  resetBall();
}

//This resets the game state at the beginning of a new game.
function resetGameState() {
  gameState.canPointsBeEarned = true;
  setText("nameInput", "");
  setText("ageInput", "");
  setText("dateOfBirthInput", "");
  setText("genderInput", "");
}

//This resets the paddles at the beginning of the game.
function resetPaddles() {
  //This resets the properties of the player paddle.
  playerPaddle.xPaddle = 140;
  playerPaddle.yPaddle = 440;
  setPosition("paddle", playerPaddle.xPaddle, playerPaddle.yPaddle);
  
  //This resets the properties of the enemy paddle.
  enemyPaddle.xEnemyPaddle = 140;
  enemyPaddle.yEnemyPaddle = 0;
  setPosition("enemyPaddle", enemyPaddle.xEnemyPaddle, enemyPaddle.yEnemyPaddle);
  
  //This resets the speeds of both paddles.
  playerPaddle.xPaddleSpeed = 0;
  enemyPaddle.xEnemyPaddleSpeed = 0;
}

//This resets the ball at the beginning of the game.
function resetBall() {
  gameBall.xBall = 140;
  gameBall.yBall = 205;
  setPosition("ball", gameBall.xBall, gameBall.yBall);
}

// This function actually shows all of the records (sorted by who won and who lost) in the text area.
function showPlayerRecords() {
  readRecords("winLossTable", {}, function(records) {
    playerInformation = sortWinLoss(records);
    displayPlayerInformation();
  });
}

// This sorts the records array by who won and who lost. The players who won are shifted to the front of the array, while the players who lost are shifted to the back of the array.
function sortWinLoss(recordsArray) {
  for (var i = recordsArray.length-1; i > 0; i--) {
    for (var j = 0; j < i; j++) {
      if (recordsArray[j].winLoseAI == "Lose" && recordsArray[j+1].winLoseAI == "Win") {
        recordsArray = swap(recordsArray, j, j+1);
      }
    }
  }
  return recordsArray;
}

//This swaps two items in a list and returns the list.
function swap(list, a, b) {
  var temp = list[a];
  list[a] = list[b];
  list[b] = temp;
  return list;
}

// This functions displays all of the player information in the player information screen.
function displayPlayerInformation() {
  var listOfPlayerInformation = "";
  for (var i = 0; i < playerInformation.length; i++) {
    listOfPlayerInformation = listOfPlayerInformation + "Name: " + playerInformation[i].name + "\n" + "Age: " + playerInformation[i].age + "\n" + "Date of Birth: " + playerInformation[i].dateOfBirth + "\n" + "Gender: " + playerInformation[i].gender + "\n" + "Win or Lose: " + playerInformation[i].winLoseAI + "\n\n";
  }
  setText("playerRecords", listOfPlayerInformation);
}

//This records all of the information about the player who has finished the game.
function recordPlayerInformation() {
  newPlayerRecord.name = getText("nameInput");
  newPlayerRecord.age = getNumber("ageInput");
  newPlayerRecord.dateOfBirth = getText("dateOfBirthInput");
  newPlayerRecord.gender = getText("genderInput");
  // It is important to nest all of the records commands because there would be race conditions (where the database commands and the actual game are happening at the same time) had they not been nested.
  createRecord("winLossTable", newPlayerRecord, function() {
    updateRecord("humanAgainstAI", newGameRecord, function() {
      //The readRecords is not necessarily essential; it only ensures that the game's records and the database's records are the same.
      readRecords("humanAgainstAI", {}, function(records) {
        gameState.playerWins = records[0].humanWins;
        gameState.enemyWins = records[0].aiWins;
        gameState.canGameBePlayed = true;
    });
  });
  });
  hideElement("giveInformationLabel");
  showElement("viewInstructionsLabel");
  //The function resetAll has to be called to reset all of the game objects before the screen is set to the game screen. This is to ensure that the user does not see any delay between switching the screen and having the game objects revert to their original positions.
  resetAll();
  setScreen("gameScreen");
}

//This starts the game and ensures that the player paddle can move.
onEvent("gameScreen", "keydown", function(event) {
  if (event.key=="s" && !gameState.isGameOn && gameState.canGameBePlayed) {
    beginGame();
    hideElement("viewInstructionsLabel");
  }
  if (event.key=="a" || event.key == "Left") {
    playerPaddle.isPaddleMoving = true;
    playerPaddle.xPaddleSpeed = playerPaddle.thePaddleSpeed * -1;
  }
  if (event.key=="d" || event.key == "Right") {
    playerPaddle.isPaddleMoving = true;
    playerPaddle.xPaddleSpeed = playerPaddle.thePaddleSpeed;
  }
});

// This ensures that the paddle stops moving when the player stops pressing the "A" and "D" keys.
onEvent("gameScreen", "keyup", function(event) {
  if ((event.key == "a" || event.key =="Left") || (event.key == "d" || event.key=="Right")) {
    playerPaddle.isPaddleMoving = false;
  }
});

// This records all the information about the player who has played the game.
onEvent("playAgainButton", "click", function() {
  if (getText("nameInput") != "" && getNumber("ageInput") != "" && getText("dateOfBirthInput") != "" && getText("genderInput") != "") {
    recordPlayerInformation();
  } else {
    showElement("giveInformationLabel");
  }
});

// This allows the player to view the instructions screen.
onEvent("gameScreen", "keydown", function(event) {
  if (event.key == "i" && !gameState.isGameOn) {
    setScreen("instructionsScreen");
    setText("instructionsLabel", "Press S to start the game.\n\nPress the A and D keys or the arrow keys to move the paddle left and right.\n\nAttempt to defeat the enemy AI.\n\n When you have finished playing, you should enter your name, age, date of birth, and gender for recordkeeping.");
  }
});

// This allows the player to go back to the game screen.
onEvent("backButton1", "click", function() {
  setScreen("gameScreen");
});

// This allows the user to view the records of all the players.
onEvent("viewRecordsButton", "click", function( ) {
  readRecords("winLossTable", {}, function(records) {
    readRecords("humanAgainstAI", {}, function(winRecords) {
      if ((winRecords[0].humanWins + winRecords[0].aiWins) == records.length) {
        showPlayerRecords();
        setScreen("playerRecordsScreen");
      } else {
        console.log("Panic: The number of times the game has been played is not equal to the number of players in the player database.");
      }
    });
  });
});

// This returns the player back to the Game Over Screen when they click on the back button of the Player Records screen.
onEvent("backButton2", "click", function() {
  setScreen("overScreen");
});
/*
Image Sources:
https://image.flaticon.com/icons/png/512/32/32341.png
https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiPzpvP1bfiAhXTu54KHXuGBAsQjRx6BAgBEAU&url=%2Furl%3Fsa%3Di%26source%3Dimages%26cd%3D%26ved%3D%26url%3Dhttp%253A%252F%252Fsds.parsons.edu%252Ftransdesign%252Fseminar%252Fvastness-of-unknown%252F%26psig%3DAOvVaw2hk2RfhIJbKGG5rQhzqX-9%26ust%3D1558907552348769&psig=AOvVaw2hk2RfhIJbKGG5rQhzqX-9&ust=1558907552348769
https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwjf-vqj2rfiAhXVo54KHfTdDRsQjRx6BAgBEAU&url=%2Furl%3Fsa%3Di%26source%3Dimages%26cd%3D%26ved%3D%26url%3Dhttp%253A%252F%252Fwww.wallpapercanyon.com%252Fgrey-wallpaper-18%252F%26psig%3DAOvVaw25mwvq0w82nmKJXejpj1s3%26ust%3D1558908842435974&psig=AOvVaw25mwvq0w82nmKJXejpj1s3&ust=1558908842435974
https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwio_t232rfiAhXTl54KHZjkAycQjRx6BAgBEAU&url=https%3A%2F%2Fwww.hdwallpapers.in%2Fthor_space_nebula-wallpapers.html&psig=AOvVaw0ohjIOYVlxcurBDqSfbA5v&ust=1558908925211888
https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwjyjviK27fiAhUSuZ4KHYA4AzEQjRx6BAgBEAU&url=https%3A%2F%2Fcoolbackgrounds.io%2F&psig=AOvVaw0rsGc2CVaOk-tPBAl4boBx&ust=1558909019283862
https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwj_gcGj27fiAhVMpZ4KHURAATIQjRx6BAgBEAU&url=https%3A%2F%2Fnrwa.org%2Frectangle-1%2F&psig=AOvVaw1cYYknBcAs9aHnUlKAOhik&ust=1558909139412888
*/