// our Leap motion hand sensor controller object (instantiated inside of 'setup');
var leapController;
var canvas;

var gameMode = 0;
var misses = 5;

//Song - Faded (Allen Walker)
var bpm = 90; 
var song;
var fft;
var w;

// x & y position of our user controlled character
var x1 = 150;
var y1 = 250;
var x2 = 350;
var y2 = 250;

// our output div (see the HTML file);
var outputDiv;

function preload(){
  song = loadSound('faded.mp3');
}

function setup() {
  canvas = createCanvas(1024, 500);
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


  if(gameMode === 0){
    startScreen();
  }
  if(gameMode === 1){
    game();
  }

  if(gameMode === 2){
    gameOver();
  }
}

function startScreen(){
  fill(255);  //set color to black 
  textSize(50); //set text size to 50
  textAlign(CENTER);  //align text to center 
  text("Theremai", width/2, 200); //set text
  textSize(30); //set text size to 30
  text("Press Space to Play", width/2, height/2 + 10); //set text
}

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
    }
    else if (i/16 < 2){
      fill(243,245,196, 80);
    }
    else if (i/16 < 3){
      fill(147,237,212, 80);
    }
    else{
      fill(60,186,200, 80);
    }

    rect(i * w, y, w-2, height - y);
  }

  fill(0);
  stroke(255);
  strokeWeight(5);
  line(100, 0, 100, height);

  strokeWeight(1);
  fill(255,0,0);
  ellipse(x1, y1, 25, 25);

  fill(0,255,0);
  ellipse(x2, y2, 25, 25);

  
  // for(var i=0;i<256;i++){
  //   var amp = spectrum[i];
  //   var y = map(amp, 0, 256, height, 0);
  //   rect(i * w, height , i*w, y );
  //     console.log(spectrum);
  // }
  // for(var i=256;i<512;i++){
  //   var amp = spectrum[i];
  //   var y = map(amp, 0, 255, height, 0);
  //   line(i, height, i, y);
  // }
  // for(var i=512;i<768;i++){
  //   var amp = spectrum[i];
  //   var y = map(amp, 0, 255, height, 0);
  //   line(i, height, i, y);
  // }
  // for(var i=768;i<1024;i++){
  //   var amp = spectrum[i];
  //   var y = map(amp, 0, 255, height, 0);
  //   line(i, height, i, y);
  // }

}

function gameOver(){
  fill(255);  //set color to black
  textSize(50); //set text size to 50
  textAlign(CENTER);  //align text to center
  text("Game Over", width/2, 200);  //set text
  textSize(30); //set text size to 30
  text("Press Space to Restart", width/2, height/2 + 150); //set text
}

function keyPressed(){
  if(gameMode === 0){
    if(keyCode === 32){
      gameMode = 1;
    }
  }
  else if(gameMode === 1){
    if(keyCode === 32){
      gameMode = 2;
    }
  }
  else{
    if(keyCode === 32){
      gameMode = 0;
    }
  }
}

// this function runs every time the leap provides us with hand tracking data
// it is passed a 'frame' object as an argument - we will dig into this object
// and what it contains throughout these tutorials
function handleHandData(frame) {

  // make sure we have exactly one hand being detected
  if (frame.hands.length == 2) {
    // get the position of the two hands
    var handPosition1 = frame.hands[0].stabilizedPalmPosition;
    var handPosition2 = frame.hands[1].stabilizedPalmPosition;

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
    }

    console.log(hx1 + "," + hy1 + " - " + hx2 + ", " + hy2);

    // x is left-right, y is up-down, z is forward-back
    // for this example we will use x & y to move the circle around the screen
    // let's map the x & y values to screen coordinates
    // note that determining the correct values for your application takes some trial and error!
    x1 = map(hx1, -200, 200, 0, width);
    y1 = map(hy1, 0, 500, height, 0);

    x2 = map(hx2, -200, 200, 0, width);
    y2 = map(hy2, 0, 500, height, 0);
  }
}

function playSound(){
  if(song.isPlaying() == false){
    song.play();
  }
  else{
    
  }
}

//Function windowResized() - resize the cavnas 
function windowResized(){ //ensures the canvas remains centered
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
}