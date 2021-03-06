var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var size_dropdown = document.getElementById("dropdown");
var clear_button = document.getElementById("clear");
var undo_button = document.getElementById("undo");

var flipH_button = document.getElementById("flipH");
var flipV_button = document.getElementById("flipV");
var rotateC_button = document.getElementById("rotateC");
var rotateCC_button = document.getElementById("rotateCC");

var amtPlaced = document.getElementById("amtCovered");
var amtNeeded = document.getElementById("amtNeeded");

var bgdColor0 = "#C47451";
var bgdColor1 = "#FFFFFF";

var size = 1;
var patchSize = 75;

var board = [[-1]];
var visited = [];

var requestID;

var drawRedBox = function(r, c){
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(r * patchSize, c * patchSize, patchSize, patchSize);
}

var requestID;

var flash = function(){
    window.cancelAnimationFrame( requestID );

    var tick = 0;
    
    var drawFlash = function() {
	if (tick == 0 || tick == 30){

	    //stuff
	    
	}

	tick = (tick + 1) % 60;
	requestID = window.requestAnimationFrame(drawFlash);
    }
    drawFlash();
}

var stop = function(){
    window.cancelAnimationFrame( requestID );
}

var changeCanvasSize = function(e){
    size = parseInt(size_dropdown.options[size_dropdown.selectedIndex].value);
    
    canvas.setAttribute("height", size * patchSize);
    canvas.setAttribute("width", size * patchSize);

    clear();
    drawBackground();
    
    amtNeeded.innerHTML = size * size;
}

var drawBox = function(r, c){
    if (r % 2 != c % 2){
	ctx.fillStyle = bgdColor0;
    }
    else {
	ctx.fillStyle = bgdColor1;
    }
    ctx.fillRect(r * patchSize, c * patchSize, patchSize, patchSize);
}

var drawBackground = function(){
    ctx.clearRect(0, 0, patchSize * size, patchSize * size);
    for (var i = 0; i < size; i++){
	for (var j = 0; j < size; j++){
	    drawBox(i, j);
	}
    }
}

var drawKnight = function(r, c){
    var knight = new Image(patchSize, patchSize);
    knight.setAttribute('crossOrigin', 'anonymous');
    knight.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/45px-Chess_nlt45.svg.png";
    knight.onload = function(){
	ctx.drawImage(knight, r * patchSize, c * patchSize, patchSize, patchSize);
	ctx.font = "20px Arial";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.fillText(board[r][c], r * patchSize + patchSize / 2 + 12, c * patchSize + patchSize / 2 + 15);
    }
}

var canPlaceHere = function(r, c){
    if (visited.length == 0)
	return true;
    console.log(board);
    if (board[r][c] != -1)
	return false;
    console.log("pass1");
    var lastMove = visited[visited.length - 1];
    var diffR = Math.abs(lastMove[0] - r);
    var diffC = Math.abs(lastMove[1] - c);
    if ( (diffR == 2 && diffC == 1) || (diffR == 1 && diffC == 2) )
	return true;
    return false;
}

var place = function(e){

    var xcor = e.offsetX;
    var ycor = e.offsetY;

    var r = Math.floor(xcor / patchSize);
    var c = Math.floor(ycor / patchSize); 

    if (! canPlaceHere(r, c))
	return;
    drawKnight(r, c);
    visited.push([r, c]);
    board[r][c] = visited.length;
    amtCovered.innerHTML = visited.length;
    checkKnight(visited.length - 1);

}

var checkKnight = function(i){
    return;
}


var undo = function(){
    if (visited.length == 0)
	return;
    var lastIndex = visited.length - 1;
    var lastOne = visited[lastIndex];
    var r = lastOne[0];
    var c = lastOne[1];

    ctx.clearRect(r * patchSize, c * patchSize, patchSize, patchSize);
    drawBox(r, c);

    visited.splice(visited.length - 1, 1);

    board[r][c] = -1;

    amtCovered.innerHTML = visited.length; 
}

var clear = function(){
    visited = [];
    amtCovered.innerHTML = 0;
    board = [];
    for (var i = 0; i < size; i++){
	var row = [];
	for (var j = 0; j < size; j++){
	    row.push(-1);
	}
	board.push(row);
    }
    drawBackground();
}


var drawAllKnights = function(){
    for (var index = 0; index < visited.length; index++) {
	var knight = visited[index];
	drawKnight(knight[0], knight[1]);
    }
}

//only run when board has been flipped/rotated
var updateBgdColors = function(){
    if (size % 2 == 0){ //no change for odd N boards (rotational and reflective symmetry)
	var temp = bgdColor1;
	bgdColor1 = bgdColor0;
	bgdColor0 = temp;
    }
}

var flipCoords = function(coord) {
    for (var index = 0; index < visited.length; index++) {
	var knight = visited[index];
	knight[coord] = size - 1 - knight [coord];
    }
}

var flipH = function(){
    flipCoords(0);
    updateBgdColors();
    drawBackground();
    drawAllKnights();
}

var flipV = function(){
    flipCoords(1);
    updateBgdColors();
    drawBackground();
    drawAllKnights();
}

var rotateCoords = function(dir){
    for (var index = 0; index < visited.length; index++) {
	var knight = visited[index];
	var otherCoord = (dir + 1) % 2;
	var temp = knight[otherCoord];
	knight[otherCoord] = knight[dir];
	knight[dir] = size - 1 - temp;
    }
}

var rotateC = function(){
    rotateCoords(0);
    updateBgdColors();
    drawBackground();
    drawAllKnights();
}

var rotateCC = function(){
    rotateCoords(1);
    updateBgdColors();
    drawBackground();
    drawAllKnights();
}

size_dropdown.addEventListener("click", changeCanvasSize);
canvas.addEventListener("click", place);
clear_button.addEventListener("click", clear);
undo_button.addEventListener("click", undo);

flipH_button.addEventListener("click", flipH);
flipV_button.addEventListener("click", flipV);
rotateC_button.addEventListener("click", rotateC);
rotateCC_button.addEventListener("click", rotateCC);
