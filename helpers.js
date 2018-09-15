// Create matrix at startup
function createMatrix() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      Matrix[i].push(0);
    }
    Matrix.push([]);
  }
}


function randShape(){
  return round(random(0, 6));
}


// Sets all blocks to 0
function updateMatrix(){
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      Matrix[i][j] = 0;
    }
  }
}


function controlPermission(direction){
  let controlAllow = true;
  // Direction is either +1 right or -1 left
  for (let i = 0; i < shapes[currentShape].blocks.length; i++){
    let currentBlock = shapes[currentShape].blocks[i];
    let nextBlock = [currentBlock[0], currentBlock[1] + direction];  // ERROR!!: don't really know why, gives me typeError, not crashing
    
    if (nextBlock[1] >= COLS || nextBlock[1] < 0){
      controlAllow = false;
    }
    if (!partOfSelf(shapes[currentShape].blocks, nextBlock) && 
    Matrix[nextBlock[0]][nextBlock[1]] == 1){
      console.log("Can't move!");
      controlAllow = false;
    }
  }
  return controlAllow;
}

// function rotatePermission(){
//   nextRotation = [];
//   rotate(shapes[currentShape].blocks

//   if (rotate(shapes[currentShape].blocks))
// }


// Controls for shapes, also checks if shape is allowed to move L or R
function keyPressed(){
  if (keyCode === LEFT_ARROW){
    if (controlPermission(-1) && shapes[currentShape].isMoving){
      shapes[currentShape].xPos -= 1;
    }
  } else if (keyCode === RIGHT_ARROW){
    if (controlPermission(1) && shapes[currentShape].isMoving){
      shapes[currentShape].xPos += 1;
    }
  } else if (keyCode === UP_ARROW){
    // TODO: Add collision check before rotation occurs
    shapes[currentShape].rotate();
  }
}


function partOfSelf(coordinateList, nextBlock){
  // Takes in a block of a shape, and the block below it
  // Returns true if that block is part of itself, otherwise returns false
  let comparison = 0;
  for (let j = 0; j < coordinateList.length; j++){
    for (let i = 0; i < 2; i++){
      if (nextBlock[i] == coordinateList[j][i]){
        comparison += 1
      }
    }
    if (comparison == 2){
      return true;
    } else {
      comparison = 0;
    }
  }
  if (comparison != 2){
    return false;
  }
}


function rotateShape(m){
  // Takes in a list of coordinates, with origin as m[0]
  // Returns coordinates rotated 90 degrees clockwise around origin

  let origin = m[0];
  let degrees = 1/2*Math.PI
  let newX, newY;
  let newCoordinates = [];

  for (let i = 0; i < m.length; i++){
    m[i][0] -= shapes[currentShape].yPos;
    m[i][1] -= shapes[currentShape].xPos;

    if (i == 0) newCoordinates.push(m[i]);
    // console.log("Current yPos: ", shapes[currentShape].yPos);
    // console.log("Original yPos", m[i][0]);

    if (i > 0){
      // X' = (x - a) * cos(degrees) - (y - b) sin(degrees) + a
      // Y' = (x - a) * sin(degrees) - (y - b) cos(degrees) + b
      newX = ((m[i][1] - origin[1]) * cos(degrees)) - ((m[i][0] - origin[0]) * sin(degrees)) + origin[1];
      newY = ((m[i][1] - origin[1]) * sin(degrees)) - ((m[i][0] - origin[0]) * cos(degrees)) + origin[0];
      newCoordinates.push([round(newY), round(newX)]);
    }
  }
  // console.log(shapes[currentShape].type);
  return newCoordinates;
}