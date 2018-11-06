// TETRIS

// TODO: Make bottom row disappear when its full and shift everything down
// TODO: When rotating near another piece, add yPos + 1 to prevent going through a piece
// TODO: When a new shape spawns, it should check first whether no other shape is in the way. If it IS, it's game over
// TODO: Map down arrow to double/triple speed of shape
// TODO: Add game over screen


let Matrix = [[]];

const ROWS = 20;
const COLS = 10;
const WIDTH = 210;
const HEIGHT = 400;
const SPEED = 300;

function renderFrame() {
  // Draw grid
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      fill(100);
      stroke(90);
      rect(i * (WIDTH / COLS), j * (HEIGHT / ROWS), WIDTH / COLS, HEIGHT / ROWS);
    }
  }

  // Draw blocks
  for (let shape of shapes){
    for (let k = 0; k < shape.blocks.length; k++){
      fill(shape.color);
      // stroke(shape.color);
      rect(shape.blocks[k][1] * (WIDTH / COLS), shape.blocks[k][0] * (HEIGHT / ROWS), WIDTH / COLS, HEIGHT / ROWS);
    }
  }
}

function Shape(type){
  this.type = type;
  this.xPos = 3;
  this.yPos = 0;
  this.color = null;
  this.rotation = false;
  this.isMoving = true;
  this.blocks = new Array(4);
  
  this.drawShape = function(){
    if (this.type == "triangle"){
      this.color = "#108153"; // green
      this.blocks[0] = [this.yPos, this.xPos + 1]; // Origin
      this.blocks[1] = [this.yPos, this.xPos];
      this.blocks[2] = [this.yPos, this.xPos + 2];
      this.blocks[3] = [this.yPos + 1, this.xPos + 1];
    }
    if (this.type == "square"){
      this.color = "#C9E4CA"; // green
      this.blocks[0] = [this.yPos, this.xPos];
      this.blocks[1] = [this.yPos, this.xPos + 1];
      this.blocks[2] = [this.yPos + 1, this.xPos];
      this.blocks[3] = [this.yPos + 1, this.xPos + 1];
    }
    if (this.type == "pipe"){
      this.color = "#69D1C5"; // green
      this.blocks[0] = [this.yPos + 1, this.xPos]; // Origin
      this.blocks[1] = [this.yPos, this.xPos];
      this.blocks[2] = [this.yPos + 2, this.xPos];
      this.blocks[3] = [this.yPos + 3, this.xPos];
    }
    if (this.type == "worm1"){
      this.color = "#7EBCE6"; // green
      this.blocks[0] = [this.yPos + 1, this.xPos]; // Origin
      this.blocks[1] = [this.yPos, this.xPos];
      this.blocks[2] = [this.yPos + 1, this.xPos + 1];
      this.blocks[3] = [this.yPos + 2, this.xPos + 1];
    }
    if (this.type == "worm2"){
      this.color = "#8980F5"; // green
      this.blocks[0] = [this.yPos + 1, this.xPos]; // Origin
      this.blocks[1] = [this.yPos + 1, this.xPos + 1];
      this.blocks[2] = [this.yPos, this.xPos + 1];
      this.blocks[3] = [this.yPos + 2, this.xPos];
    }
    if (this.type == "boot1"){
      this.color = "#0A2E36"; // green
      this.blocks[0] = [this.yPos + 2, this.xPos]; // Origin
      this.blocks[1] = [this.yPos + 2, this.xPos + 1];
      this.blocks[2] = [this.yPos + 1, this.xPos];
      this.blocks[3] = [this.yPos, this.xPos];
    }
    if (this.type == "boot2"){
      this.color = "#E75A7C"; // green
      this.blocks[0] = [this.yPos + 2, this.xPos + 1]; // Origin
      this.blocks[1] = [this.yPos + 2, this.xPos];
      this.blocks[2] = [this.yPos + 1, this.xPos + 1];
      this.blocks[3] = [this.yPos, this.xPos + 1];
    }

    // Change rotation by reassigning this.blocks
    if (this.rotation && this.type !== "square"){
      for (let i = 0; i < this.blocks.length; i++){
        this.blocks[i][0] = this.yPos + this.newCoordinates[i][0];
        this.blocks[i][1] = this.xPos + this.newCoordinates[i][1];
      }
    }

    // Put shape in Matrix in current position
    for (let j = 0; j < this.blocks.length; j++){
      Matrix[this.blocks[j][0]][this.blocks[j][1]] = 1;
    }
  }
  
  this.moveDown = function(){
    for (let i = 0; i < this.blocks.length; i++){
      let currentBlock = this.blocks[i];
      
      // Check if it hits the bottom
      if (currentBlock[0] >= ROWS-1){
        this.isMoving = false;
      }
      let nextBlock = [currentBlock[0] + 1 , currentBlock[1]];
      
      // Check if it hits another shape
      if (!partOfSelf(this.blocks, nextBlock) && Matrix[nextBlock[0]][nextBlock[1]] == 1){
        this.isMoving = false;
      }
    }
    // No collision detected > move shape
    if (this.isMoving){
      this.yPos += 1;
    }
  }

  this.rotate = function(){
    this.newCoordinates = rotateShape(this.blocks);
    this.rotation = true;
  }
}


// Types of shapes
let shapetypes = [
  "square", "triangle", "pipe", "worm1", 
  "worm2", "boot1", "boot2"
];

// Shape instances are stored in this array
let shapes = [];

// Counts amount of shapes generated
let currentShape = 0;


function setup() {
  colorMode(RGB, 100, 100, 100);
  stroke(100);
  createCanvas(WIDTH + 1, HEIGHT + 1);
  createMatrix();
  frameRate(30);
  renderFrame();
  shapes.push(new Shape(shapetypes[randShape()]));
}

// Start initial timer
let moveTimer = setInterval(function(){shapes[currentShape].moveDown()}, SPEED);


function draw() {
  background(200);
  updateMatrix();
  
  // Draw shapes (put 1's in Matrix)
  for (let i = 0; i < shapes.length; i++){
    shapes[i].drawShape();
  }
  
  renderFrame();
  
  // Check for game over 
  for (let i = 0; i < Matrix[0].length; i++){
    if (Matrix[0][i] == 1 && !shapes[currentShape].isMoving){
      shapes = [];
      currentShape = 0;
      let n = round(random(0, 2));
      shapes.push(new Shape(shapetypes[n]));
      break;
    }
  }
  
  // If shape stopped moving, create new shape
  if (!shapes[currentShape].isMoving){
    clearInterval(moveTimer);
    shapes.push(new Shape(shapetypes[randShape()]));
    currentShape++;
    moveTimer = setInterval(function(){shapes[currentShape].moveDown()}, SPEED);
  }
}