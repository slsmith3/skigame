this.focus();

// Objects
let skier;
let tree;
let rock;

//-----------Variables to Adjust-----------//

// horizontal location of skier
let skierLatitude = 175;

// scoring increment
let scoreIncrement = 0.008;

// difficulty initial states
let easyMode = true;
let mediumMode = false;
let hardMode = false;

// stuff for bump collisions
let bumpCollision = false;
let offset;
let inAir = false;

// canvas size
let canvasX = 800;
let canvasY = 600;

//----------------------------------------//

//score
let score;
let highestScore = 0;

// Velocity and Acceleration
let intVelocity;
let acceleration;
let velocity = intVelocity + acceleration;

// gamemode(difficulty)
let gameMode;

// number of objects
let numberOfTrees;
let numberOfRocks;
let numberOfBumps;

// Game States
let intro = 0;
let alive = 1;
let gameOver = 2;
let gameState;

// boolean for collisions. for debugging purposes.
let yesCollisions;

// generation array for trees
let treeLocation = [];
let treeNum = numberOfTrees;

// generation array for rocks
let rockLocation = [];
let rockNum = numberOfRocks;

// generation array for bumps
let bumpLocation = [];
let bumpNum = numberOfBumps;

// x location of skier image
let skiersX;
let skierX;

// button variables
let startButton;
let startLabel = "Start";
let selectedColor;
let baseColor;

let debug = false;

//<><><><><><><><><><><><><><><><><><><><><><><><>//

function preload() {
  // use filepath "Objects/" to import images
  skier = loadImage("skier.png");
  tree = loadImage("TreesForSkiGame.png");
  rock = loadImage("rock.png");
}
function setup() {
  var cnv = createCanvas(canvasX, canvasY);
  cnv.parent("sketchHolder");

  //initialized colors for button press
  selectedColor = color(255, 0, 0, 150);
  baseColor = color(220);

  // runs the button creation functions
  makeStartButton();
  makeEasyButton();
  makeMediumButton();
  makeHardButton();

  // resizes the images
  rock.resize(35, 18);
  tree.resize(70, 97);

  //sets initial game state
  gameState = intro;
  setDifficulty();

  // runs the functions that populate the arrays
  generateTrees();
  generateRocks();
  generateBumps();

  // sets collisons
  yesCollisions = true;

  print("game created by:");
  print("Anoushka Mehta, Yasmin Muniz, Sean Smith, Edward Song");
  // print("Yasmin Muniz")
  // print("Sean Smith")
  // print("Edward Song")
  print("    ");
  print("Press ` to enable debug tools");
}

//just for debug purposes
function keyPressed() {
  if (key === "`") {
    print("Debug mode Enabled");
    print("    ");
    print("Press d to disable collisions");
    print("Press i to return to intro screen");
    print("Press z to reset score");
    debug = !debug;
  }
  if (debug) {
    if (key === "d") {
      // Toggle collisions
      print("collisions toggled.");
      yesCollisions = !yesCollisions;
    } else if (key === "i") {
      gameState = intro;
    } else if (key === "z") {
      score = 0;
    }
  }
}

// button functions
function makeStartButton() {
  startButton = createButton(startLabel);
  startButton.parent("sketchHolder");

  startButton.size(200, 50);
  startButton.position(width / 2 - startButton.width / 2, height / 2 + 90);

  startButton.mousePressed(() => {
    gameState = alive;
    score = 0;
  });
}
function makeEasyButton() {
  easyButton = createButton("Easy");
  easyButton.parent("sketchHolder");
  easyButton.size(60, 30);
  easyButton.position(width / 2 - easyButton.width / 2 - 65, 220);

  easyButton.mousePressed(() => {
    easyButton.style("background-color", selectedColor);
    mediumButton.style("background-color", baseColor);
    hardButton.style("background-color", baseColor);
    easyMode = true;
    mediumMode = false;
    hardMode = false;
  });
}
function makeMediumButton() {
  mediumButton = createButton("Medium");
  mediumButton.parent("sketchHolder");
  mediumButton.size(60, 30);
  mediumButton.position(width / 2 - mediumButton.width / 2, 220);

  mediumButton.mousePressed(() => {
    mediumButton.style("background-color", selectedColor);
    hardButton.style("background-color", baseColor);
    easyButton.style("background-color", baseColor);
    mediumMode = true;
    easyMode = false;
    hardMode = false;
  });
}
function makeHardButton() {
  hardButton = createButton("Hard");
  hardButton.parent("sketchHolder");
  hardButton.size(60, 30);
  hardButton.position(width / 2 - hardButton.width / 2 + 65, 220);

  hardButton.mousePressed(() => {
    hardButton.style("background-color", selectedColor);
    mediumButton.style("background-color", baseColor);
    easyButton.style("background-color", baseColor);
    hardMode = true;
    easyMode = false;
    mediumMode = false;
  });
}

// changes the label on the "start" button to "restart" when you die
function changeLabel() {
  startLabel = "Restart";
  startButton.html(startLabel);
}
function originalLabel() {
  startLabel = "Start";
  startButton.html(startLabel);
}
//trees
function generateTrees() {
  // add a coordinate pair to the array for however many numbers of trees are wanted
  for (let i = 0; i < treeNum; i++) {
    treeLocation.push({
      x: random(width - tree.width / 2),
      y: random(height, 3 * height),
    });
  }
}
function moveTrees() {
  // for tree generation
  for (let i = treeLocation.length - 1; i >= 0; i--) {
    fill(0);

    // draws the tree
    image(tree, treeLocation[i].x, treeLocation[i].y);
    fill(0, 0, 0, 0);

    let x1 = treeLocation[i].x + tree.width / 2;
    let y1 = treeLocation[i].y + tree.height / 2;
    noStroke();
    //strokeWeight(1);
    circle(x1, y1, 97);

    // moves the tree
    treeLocation[i].y -= velocity;

    // Checks to see if the tree has reached the top
    if (treeLocation[i].y < -100) {
      // Removes the tree from the array (and screen)
      treeLocation.splice(i, 1);

      // draws a new tree at the bottom
      treeLocation.push({
        x: random(width - tree.width / 2),
        y: random(height + 2, 3 * height),
      });
    }
  }
}

//rocks
function generateRocks() {
  // add a coordinate pair to the array for however many numbers of rocks are wanted
  for (let i = 0; i < rockNum; i++) {
    rockLocation.push({
      x: random(width),
      y: random(height, 3 * height),
    });
  }
}
function moveRocks() {
  // for rock generation
  for (let i = rockLocation.length - 1; i >= 0; i--) {
    fill(0);

    let x2 = rockLocation[i].x + rock.width / 2;
    let y2 = rockLocation[i].y + rock.height / 2;

    // Check for collisions with trees
    for (let j = 0; j < treeLocation.length; j++) {
      let d = dist(
        x2,
        y2,
        treeLocation[j].x + tree.width / 2,
        treeLocation[j].y + tree.height / 2
      );
      let minDistance = (rock.width + tree.width) / 2;

      if (d < minDistance) {
        // Adjust rock position to avoid collision with tree
        rockLocation[i].x = treeLocation[j].x + tree.width;
        rockLocation[i].y = treeLocation[j].y - rock.height;
      }
    }

    // draws the rock only if it didn't collide with a tree
    image(rock, rockLocation[i].x, rockLocation[i].y);
    fill(0, 0, 0, 0);
    circle(x2, y2, 35);

    // moves the rock
    rockLocation[i].y -= velocity;

    // Check if the rock has reached the top
    if (rockLocation[i].y < -100) {
      // Remove the rock from the array
      rockLocation.splice(i, 1);

      // Generates a new rock at the bottom by adding a new value to the array
      rockLocation.push({
        x: random(width),
        y: random(height + 2, 3 * height),
      });
    }
  }
}

//bumps
function bump(x, y) {
  // Customize this function based on your requirements
  stroke(1);
  fill(250, 251, 252);
  let bump = arc(x, y, 50, 50, PI, TWO_PI);
}
function generateBumps() {
  // add a coordinate pair to the array for however many numbers of rocks are wanted
  for (let i = 0; i < bumpNum; i++) {
    bumpLocation.push({
      x: random(width),
      y: random(height, 3 * height),
    });
  }
}
function moveBumps() {
  for (let i = bumpLocation.length - 1; i >= 0; i--) {
    fill(0, 0, 0, 0);
    let collidedWithObstacle = false;

    for (let j = 0; j < treeLocation.length; j++) {
      let d = dist(
        bumpLocation[i].x,
        bumpLocation[i].y,
        treeLocation[j].x + tree.width / 2,
        treeLocation[j].y + tree.height / 2
      );
      let minDistance = (50 + tree.width) / 2;

      if (d < minDistance) {
        bumpLocation[i].x = treeLocation[j].x + tree.width;
        bumpLocation[i].y = treeLocation[j].y - 50;
        collidedWithObstacle = true;
      }
    }

    // ... (collision check with rocks)

    bumpLocation[i].y -= velocity;

    // Checks to see if the bump has reached the top
    if (bumpLocation[i].y < -100) {
      bumpLocation.splice(i, 1);
      bumpLocation.push({
        x: random(width),
        y: random(height + 2, 3 * height),
      });
    }

    // Draw the bump only if it didn't collide with a tree or rock
    if (!collidedWithObstacle) {
      bump(bumpLocation[i].x, bumpLocation[i].y);
    }
  }
}

// skier
function drawSkier() {
  //when skier has not collided with the bump and they are not in the air, have the skier follow the mouseX position
  if (bumpCollision == false && inAir == false) {
    if (mouseX > 0 && mouseX < width) {
      skiersX = mouseX - skier.width / 2;
    } else if (mouseX < 0) {
      skiersX = 0;
    } else if (mouseX + skier.width / 2 >= width) {
      skiersX = width - skier.width;
    }
    image(skier, skiersX, skierLatitude);
  } else if (bumpCollision == true) {
    //if the skier has collided with the bump, set the offset value to 60 and set inAir to true as the true is now in the air

    offset = 60;
    inAir = true;
  }
  // if inAir is true, increment the offset down by 1 each frame and draw the skier at the mouseX position plus the offset
  if (inAir == true) {
    offset -= 1;
    image(skier, mouseX - skier.width / 2 + offset, skierLatitude);
    //print(offset);
    bumpCollision = false;
  }
  //when offset is 0 set inAir to false
  if (offset == 0) {
    bumpCollision = false;
    inAir = false;
  }
}

// Collisions
function checkCollision() {
  if (inAir == false) {
    skierX = skiersX;
  } else if (inAir == true) {
    skierX = mouseX + offset;
  }

  let skierY = skierLatitude;
  let skierLeftX = skierX - skier.width / 2;
  let skierTopY = skierLatitude;
  let skierRightX = skierX + skier.width / 2;
  let skierBottomY = skierTopY + skier.height;

  if (yesCollisions) {
    // tree collisions
    for (let i = 0; i < treeLocation.length; i++) {
      let treeX = treeLocation[i].x;
      let treeY = treeLocation[i].y;
      // top collision circle on tree
      let topCircX = treeLocation[i].x + tree.width / 2;
      let topCircY = treeLocation[i].y + 25;
      let topCircRad = 20;
      //bottom collision circle on tree
      let bottomCircX = treeLocation[i].x + tree.width / 2;
      let bottomCircY = treeLocation[i].y + 70;
      let bottomCircRad = 30;

      if (
        dist(skierLeftX, skierTopY, topCircX, topCircY) <= topCircRad ||
        dist(skierRightX, skierTopY, topCircX, topCircY) <= topCircRad ||
        dist(skierRightX, skierBottomY, topCircX, topCircY) <= topCircRad ||
        dist(skierLeftX, skierBottomY, topCircX, topCircY) <= topCircRad ||
        dist(skierLeftX, skierTopY, bottomCircX, bottomCircY) <=
          bottomCircRad ||
        dist(skierRightX, skierTopY, bottomCircX, bottomCircY) <=
          bottomCircRad ||
        dist(skierRightX, skierBottomY, bottomCircX, bottomCircY) <=
          bottomCircRad ||
        dist(skierLeftX, skierBottomY, bottomCircX, bottomCircY) <=
          bottomCircRad
      ) {
        gameState = gameOver;
      }
    }

    // rock collisions
    for (let i = 0; i < rockLocation.length; i++) {
      let rockX = rockLocation[i].x;
      let rockY = rockLocation[i].y;

      if (
        (skierX + 5 > rockX &&
          skierX + 5 < rockX + rock.width &&
          skierY > rockY &&
          skierY < rockY + rock.height) ||
        (skierX + 20 > rockX &&
          skierX + 20 < rockX + rock.width &&
          skierY + 65 > rockY &&
          skierY + 65 < rockY + rock.height) ||
        (skierX + 5 > rockX &&
          skierX + 5 < rockX + rock.width &&
          skierY + 65 > rockY &&
          skierY + 65 < rockY + rock.height) ||
        (skierX + 20 > rockX &&
          skierX + 20 < rockX + rock.width &&
          skierY > rockY &&
          skierY < rockY + rock.height)
      ) {
        gameState = gameOver;
      }
    }

    // bump collisions
    for (let i = 0; i < bumpLocation.length; i++) {
      let bumpX = bumpLocation[i].x;
      let bumpY = bumpLocation[i].y;
      let circRad = 25;

      if (
        dist(skierLeftX, skierTopY, bumpX, bumpY) <= circRad ||
        dist(skierRightX, skierTopY, bumpX, bumpY) <= circRad ||
        dist(skierRightX, skierBottomY, bumpX, bumpY) <= circRad ||
        dist(skierLeftX, skierBottomY, bumpX, bumpY) <= circRad
      ) {
        bumpCollision = true;
      }
    }
  }
}

// game states
function gameIntroScreen() {
  background(255);
  textFont(NORMAL);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("Powder Plunge", width / 2, 100);

  textSize(20);
  text("Select Difficulty", width / 2, 200);

  textSize(10);
  text(
    "Created by Anoushka Mehta, Yasmin Muniz, Sean Smith, and Edward Song ",
    width / 2,
    580
  );
  image(tree, 25, 25);
  image(tree, 100, 300);
  image(tree, 450, 255);
  image(tree, 625, 455);
  image(tree, 240, 395);
  image(tree, 510, 100);
  image(tree, 665, 45);

  image(rock, 375, 300);
  image(rock, 650, 400);
  image(rock, 150, 550);
  image(rock, 50, 400);
  image(rock, 700, 225);
  image(rock, 225, 205);
}
function gameOverScreen() {
  background(255);

  textFont(NORMAL);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(50);
  noStroke();
  text("Game Over", width / 2, 100);
  textSize(20);
  text("Select Difficulty", width / 2, 200);
  textSize(20);
  text("Final score: " + nf(score, 1, 0), width / 2, height / 2 + 30);
  //textSize(20);
  //text("Select Difficulty", width / 2, 200);
  if (score > highestScore) {
    highestScore = score;
  }
  treeLocation = [];
  rockLocation = [];
  bumpLocation = [];
  generateTrees();
  generateRocks();
  generateBumps();
  velocity = intVelocity;
  text("Highest score: " + nf(highestScore, 1, 0), width / 2, height / 2 + 60);
}

//velocity
function updatePosition() {
  velocity = velocity + acceleration;
}

// score system
function scoreEngine() {
  score = score + scoreIncrement;
}

//mode declarations
function easySettings() {
  numberOfTrees = 10;
  treeNum = 10;
  numberOfRocks = 6;
  rockNum = 6;
  numberOfBumps = 3;
  bumpNum = 3;
  acceleration = 0.0001;
  intVelocity = 5;
  velocity = intVelocity + acceleration;
}
function mediumSettings() {
  numberOfTrees = 15;
  treeNum = 15;
  numberOfRocks = 11;
  rockNum = 11;
  numberOfBumps = 8;
  bumpNum = 8;
  acceleration = 0.00015;
  intVelocity = 8;
  velocity = intVelocity + acceleration;
}
function hardSettings() {
  numberOfTrees = 18;
  numberOfRocks = 15;
  numberOfBumps = 11;
  acceleration = 0.00018;
  intVelocity = 10;
  velocity = intVelocity + acceleration;
}
function setDifficulty() {
  if (easyMode == true) {
    easySettings();
  } else if (mediumMode == true) {
    mediumSettings();
  } else if (hardMode == true) {
    hardSettings();
  }
}

// runs the game based on what state it is in.
function runGame() {
  if (gameState == intro) {
    gameIntroScreen();
    setDifficulty();
    originalLabel();
    startButton.show();
    easyButton.show();
    mediumButton.show();
    hardButton.show();
    

    score = 0;
  } else if (gameState == gameOver) {
    setDifficulty();
    gameOverScreen();
    startButton.show();
    changeLabel();
    easyButton.show();
    mediumButton.show();
    hardButton.show();
    inAir = false;
  } else if (gameState == alive) {
    startButton.hide();
    easyButton.hide();
    mediumButton.hide();
    hardButton.hide();

    // runs velocity/ acceleration engine
    updatePosition();

    // runs the velocity function
    scoreEngine();

    // check for collisions

    //moves the objects and redraws them when they exit the screen
    moveTrees();
    moveRocks();
    moveBumps();

    //draws the skier
    drawSkier();
    checkCollision();
    fill(0);
    textSize(20);
    noStroke();
    text("score: " + nf(score, 1, 0), 750, 20);
    if (debug) {
      print("Velocity: " + nf(velocity, 1, 2));
      print("tree#: " + numberOfTrees);
      print("rock#: " + numberOfRocks);
      print("bump#: " + numberOfBumps);
      print("skierX: " + nf(skierX, 1, 2));
    }
  }
}

function draw() {
  background(250, 251, 252);

  runGame();
}
