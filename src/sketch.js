// our Leap motion hand sensor controller object (instantiated inside of 'setup');
var leapController;
var canvas;

var gameMode = 0;

//Song - Faded (Allen Walker)
var bpm = 90; 
var song;
var fft;
var w;
var countdown = 120;
var counterSquare = 0;
var counterCircle = 0;

// x & y position of our user controlled character
var x1 = 150;     //left hand
var y1 = 250;
var x2 = 874;     //right hand
var y2 = 250;
var lineHeight = 525;
var lState = 0;   //state of left hand
var rState = 0;   //state of right hand
var lGrabbed = false;
var rGrabbed = false;

var squares = [];
var circles = [];
var pushSquare = true;
var pushCircle = true;

var score = 0;
var totalCount = 0;
var playOnce = true;

// our output div (see the HTML file);
var outputDiv;

function preload(){
  song = loadSound('faded.mp3');
}

function setup() {
  canvas = createCanvas(1024, 600);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);

  fft = new p5.FFT();
  w = width/64;

  // grab a connection to our output div
  outputDiv = select('#output');

  // set up our leap controller
  leapController = new Leap.Controller({
    enableGestures: true
  });

  // every time the Leap provides us with hand data we will ask it to run this function
  leapController.loop(handleHandData);
}

function draw() {
  background(0);

  //If gamemode is 0, call startScreen function
  if(gameMode === 0){
    startScreen(); 
  }
  //If gamemode is 1, call game function
  if(gameMode === 1){
    game();
  }

  //If gamemode is 2, call gameOver function
  if(gameMode === 2){
    gameOver();
  }
}

//Start state 
function startScreen(){
  noStroke();
  fill(255);  //set color to black 
  textSize(50); //set text size to 50
  textAlign(CENTER);  //align text to center 
  text("Theremai", width/2, 200); //set text
  
  textSize(24); //set text size to 24
  fill(255,0,0);
  text("Warning: Leap Motion Required", width/2, 230);

  fill(255);
  text("Instructions:", width/2, 280);
  text("Use your hands to touch shapes of the same color", width/2, 310);
  text("Make a fist to change color", width/2, 340);
  text("Your left hand can be red or yellow and your right can be green or blue", width/2, 370);

  textSize(30); //set text size to 30
  text("Press Space to Play", width/2, height/2 + 150); //set text

  rectMode(CENTER);
  strokeWeight(1);
 
  if(lGrabbed){
    lState = 1;
    fill(225, 225, 0);
  }
  else{
    lState = 0;
    fill(255,0,0);  
  }

  rect(x1, y1, 25, 25);     //square representing left hand

  if(rGrabbed){
    rState = 1;
    fill(0,0,255);
  }
  else{
    rState = 0;
    fill(0,255,0);
  }

  ellipse(x2, y2, 25, 25);  //circle representing right hand
}

//Game state
function game(){
  playSound();

  var spectrum = fft.analyze();
  stroke(255, 180);

  for(var i=0; i<spectrum.length/16; i++){ // 4; i++){
    noStroke();
    var amp = spectrum[i];
    var y = map(amp, 0, 256, height, 250);
    
    if(i/16 < 1){
      fill(241,145,129, 80);
      
      //Left Square
      //Add square to array
      //Push about every 2 seconds to prevent squares from overlapping
      if(counterSquare < countdown && pushSquare){
        if(amp === 225){ //if threshold of 255 is reached, push Square object
          squares.push(new Square(0));
          totalCount += 1; //increment total count
          pushSquare = false; //set to false
        }
      }

      if(counterSquare >= countdown){ //if more than 2 secs have passed
        counterSquare = 0; //reset counter
        pushSquare = true; //allow next Square object to be pushed
      }
    }
    else if (i/16 < 2){
      fill(243,245,196, 80);

      //Right Square
      //Add square to array
      //Push about every 2 seconds to prevent squares from overlapping
      if(counterSquare < countdown && pushSquare){
        if(amp === 225){ //if threshold of 255 is reached, push Square object
          squares.push(new Square(1));
          totalCount += 1; //increment total count
          pushSquare = false; //set to false
        }
      }

      if(counterSquare >= countdown){ //if more than 2 secs have passed
        counterSquare = 0; //reset counter
        pushSquare = true; //allow next Square object to be pushed
      }
    }
    else if (i/16 < 3){
      fill(147,237,212, 80);

      //Left Circle 
      //Add circle to array
      //Push about every 2 seconds to prevent circles from overlapping
      if(counterCircle < countdown && pushCircle){
        if(amp === 225){ //if threshold of 255 is reached, push Circle object
          circles.push(new Circle(0));
          totalCount += 1; //increment total count
          pushCircle = false; //set to false
        }
      }
      if(counterCircle >= countdown){ //if more than 2 secs have passed
        counterCircle = 0; //reset counter
        pushCircle = true; //allow next Circle object to be pushed
      }
    }
    else{
      fill(60,186,200, 80);

      //Right Circle
      //Add circle to array
      //Push about every 2 seconds to prevent circles from overlapping
      if(counterCircle < countdown && pushCircle){
        if(amp === 225){  //if threshold of 255 is reached, push Circle object
          circles.push(new Circle(1));
          totalCount += 1;  //increment total count
          pushCircle = false; //set to false
        }
      }
      if(counterCircle >= countdown){ //if more than 2 secs have passed
        counterCircle = 0;  //reset counter
        pushCircle = true;  //allow next Circle object to be pushed
      }
    }
    rectMode(CORNER); 
    rect(i * w, y, w-2, height - y);
  }

  fill(0);
  stroke(255);
  strokeWeight(5);
  line(0, lineHeight, width, lineHeight);

  rectMode(CENTER);
  strokeWeight(1);

  if(lGrabbed){
    lState = 1;
    fill(225, 225, 0);
  }
  else{
    lState = 0;
    fill(255,0,0);  
  }

  rect(x1, lineHeight, 25, 25);     //rectangle representing left hand

  if(rGrabbed){
    rState = 1;
    fill(0,0,255);
  }
  else{
    rState = 0;
    fill(0,255,0);
  }

  ellipse(x2, lineHeight, 25, 25);  //circle representing right hand

  //loop through squares array
  for(var i =0;i<squares.length;i++){
    squares[i].display();
    if(squares[i].checkHit()){ //check for collision
      if(squares[i].hit == false){ //ensures score gets calculaed once 
        score += 1;
      }
      squares[i].hit = true; //set hit to true
    }
    squares[i].move(); //move square
  }

  //loop through circles array
  for(var i =0;i<circles.length;i++){
    circles[i].display();
    if(circles[i].checkHit()){ //check for collision
      if(circles[i].hit == false){ //ensures score gets calculated once
         score += 1;
      }
      circles[i].hit = true; //set hit to true
    }
    circles[i].move(); //move circle
  }

  //increment counters
  counterSquare++; 
  counterCircle++;

  //display the score
  fill(0,0,255);
  text("Score: " + score, width - 150, 50); //set text
}

//Game over state
function gameOver(){
  fill(255);  //set color to white
  textSize(50); //set text size to 50
  textAlign(CENTER);  //align text to center
  text("Game Over", width/2, 200);  //set text
  text("Grade", width/2, 280);
  textSize(30); //set text size to 30
  text("Press Space to Restart", width/2, height/2 + 150); //set text
  letterGrade();
}

//Determine letter grade of result
function letterGrade(){
  textSize(100); //set text size to 50
  var result = (score/totalCount)*100;
  var letterScore = '';
  if(result >= 97){
    fill(255, 255, 0);
    letterScore = "SSS";
  }
  else if(result >= 95 && result < 97){
    fill(255, 255, 0);
    letterScore = "SS";
  }
  else if(result >= 93 && result < 95){
    fill(255, 255, 0);
    letterScore = "S";
  }
  else if(result >= 90 && result < 93){
    fill(255, 0, 0);
    letterScore = "A";
  }
  else if(result >= 80 && result < 90){
    fill(255, 153, 0);
    letterScore = "B";
  }
  else if(result >= 70 && result < 80){
    fill(0, 255, 0);
    letterScore = "C";
  }
  else if(result >= 60 && result < 70){
    fill(0, 0, 255);
    letterScore = "D";
  }
  else{
    fill(153, 0, 255);
    letterScore = "F";
  }
  text(letterScore, width/2, 380);
}

function keyPressed(){
  if(gameMode === 0){ //if starting screen
    if(keyCode === 32){ //when user presses space
      gameMode = 1; //switch to game mode 
    }
  }
  else if(gameMode === 2){ //if ending screen
    if(keyCode === 32){ //when user presses space 
      reset(); //call reset Function
      gameMode = 0; //switch to start screen
    }
  }
}

// this function runs every time the leap provides us with hand tracking data
// it is passed a 'frame' object as an argument
function handleHandData(frame) {
  if (frame.hands.length == 2) {
    // get the position of the two hands
    var handPosition1 = frame.hands[0].stabilizedPalmPosition;
    var handPosition2 = frame.hands[1].stabilizedPalmPosition;

    var lHand = frame.hands[0];
    var rHand = frame.hands[1];

    // grab the x, y & z components of the hand position
    // these numbers are measured in millimeters
    var hx1 = handPosition1[0];
    var hy1 = handPosition1[1];
    var hz1 = handPosition1[2];

    // grab the x, y & z components of the hand position
    // these numbers are measured in millimeters
    var hx2 = handPosition2[0];
    var hy2 = handPosition2[1];
    var hz2 = handPosition2[2];

    // swap them so that handPosition1 is the hand on the left
    if (hx1 > hx2) {
      hx1 = handPosition2[0];
      hy1 = handPosition2[1];
      hz1 = handPosition2[2];

      hx2 = handPosition1[0];
      hy2 = handPosition1[1];
      hz2 = handPosition1[2];

      lHand = frame.hands[1];
      rHand = frame.hands[0];
    }

    //console.log(hx1 + "," + hy1 + " - " + hx2 + ", " + hy2);

    // x is left-right, y is up-down, z is forward-back
    // for this example we will use x & y to move the circle around the screen
    // let's map the x & y values to screen coordinates
    // note that determining the correct values for your application takes some trial and error!

    x1 = map(hx1, -200, 200, 0, width);
    y1 = map(hy1, 0, 500, height, 0);
    if(lHand.grabStrength >= 0.7){
      lGrabbed = true;
    }
    else{
      lGrabbed = false;
    }

    x2 = map(hx2, -200, 200, 0, width);
    y2 = map(hy2, 0, 500, height, 0);
    if(rHand.grabStrength >= 0.7){
      rGrabbed = true;
    }
    else{
      rGrabbed = false;
    }
  }
  else{
    fill(255);
    textSize(30);
    text('Hands out of view!', width/2, 125);
  }
}

//Play sound
function playSound(){
  if(song.isPlaying() == false){
    if(playOnce){
      song.play();
      playOnce = false;
    }
    else{
      gameMode = 2;
    }
  }
}

function Square(state){
  if(state == 0){
    this.positionX = 128;
  }
  else{
    this.positionX = 384;
  }
  this.positionY = 0;
  this.speedY = 7;
  this.hit = false;

  //Move Square
  this.move = function(){
    this.positionY += this.speedY;
    if(this.positionY >= height){
      squares.splice(0, 1);
    }
  }

  //Display Square
  this.display = function(){
    rectMode(CENTER);
    if(state == 0){
      fill(241,145,129);
    }
    else{
      fill(243,245,196);
    }
    rect(this.positionX, this.positionY, 75, 75);
  }

  //Checks collision for both hands 
  this.checkHit = function(){
    //Left Hand
    if(x1 >= this.positionX-37.5 && x1 <= this.positionX+37.5 && lineHeight-18.75>= this.positionY-37.5 && lineHeight+18.75 <= this.positionY+37.5){
      if(state == lState){
        return true;
      }
    }

    // //Right Hand
    // if(x2 >= this.positionX-25 && x2 <= this.positionX+25 && lineHeight-12.5 >= this.positionY-25 && lineHeight+12.5 <= this.positionY+25){
    //   return true;
    // }
    return false;
  }
}

function Circle(state){
  if(state == 0){
    this.positionX = 640;
  }
  else{
    this.positionX = 896;
  }
  this.positionY = 0;
  this.speedY = 7;
  this.hit = false;

  //Move Circle
  this.move = function(){
    this.positionY += this.speedY;
    if(this.positionY >= height){
      circles.splice(0, 1);
    }
  }

  //Display Circle
  this.display = function(){
    if(state == 0){
      fill(147,237,212);
    }
    else{
      fill(60,186,200);
    }
    ellipse(this.positionX, this.positionY, 75, 75);
  }

  //Check collision for both hands
  this.checkHit = function(){
    // //Left Hand
    // if(dist(this.positionX, this.positionY, x1, lineHeight) <= 50){
    //   return true;
    // }

    //Right Hand
    if(dist(this.positionX, this.positionY, x2, lineHeight) <= 50){
      if(state == rState){
        return true;
      }
    }
    return false;
  }
}

//Reset all variables
function reset(){
  score = 0;
  totalCount = 0;
  playOnce = true;
  countdown = 120;
  counterSquare = 0;
  counterCircle = 0;
  pushSquare = true;
  pushCircle = true;
  squares = [];
  circles = [];
}

//Function windowResized() - resize the cavnas 
function windowResized(){ //ensures the canvas remains centered
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
}