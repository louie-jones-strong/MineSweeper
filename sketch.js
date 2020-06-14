function preload()
{
	CellNormalImage = loadImage('Assets/Images/CellNormal.png');
	CellFlaggedImage = loadImage('Assets/Images/CellFlagged.png');
	CellQuestionMarkImage = loadImage('Assets/Images/CellQuestionMark.png');
}

function setup()
{
	//use this to disable right click button for this page
	document.addEventListener('contextmenu', event => {
		if(InRegion(createVector(mouseX, mouseY)))
		{
			event.preventDefault()
		}
	});

	BoxSizeX = 750
	BoxSizeY = 850
	createCanvas(BoxSizeX, BoxSizeY);
	strokeWeight(4);
	mineField = new MineField(createVector(0, 100), createVector(750,750))
	LastFramePressed = false
	LastFrameTime = millis()
}


function draw()
{
	background(100);
	deltaTime = millis() - LastFrameTime
	deltaTime /= 1000
	LastFrameTime = millis()

	mousePos = createVector(mouseX, mouseY)

	if (mouseIsPressed && !LastFramePressed &&
		(mouseButton == LEFT ||
		mouseButton == RIGHT) &&
		InRegion(mousePos))
	{
		mineField.TouchEvent(mousePos, mouseButton == RIGHT)
	}
	LastFramePressed = mouseIsPressed

	mineField.Draw(deltaTime)

	fill(255,255,255)
	stroke(0,0,0)
	strokeWeight(2)
	textSize(50);

	//Draw timer
	temp = ""
	if (Math.floor(mineField.StopWatch / 60) > 0)
	{
		temp = Math.floor(mineField.StopWatch / 60)+":"
	}
	temp += round((mineField.StopWatch % 60)*100)/100
	text(temp, 0, 25, 100,100)


	//Draw Mines Left
	temp = "left: "+ (mineField.NumberOfMines-mineField.NumberCellsMarked)
	text(temp, BoxSizeX-200, 25, 500, 100)
}


function InRegion(mousePos)
{
	return mousePos.x < BoxSizeX &&
		mousePos.x > 0 &&
		mousePos.y < BoxSizeY &&
		mousePos.y > 0
}