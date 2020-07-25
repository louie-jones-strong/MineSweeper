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

	clicked =mouseIsPressed && !LastFramePressed &&
			(mouseButton == LEFT ||
			mouseButton == RIGHT)
	LastFramePressed = mouseIsPressed

	if (clicked &&
		InRegion(mousePos))
	{
		mineField.TouchEvent(mousePos, mouseButton == RIGHT)
	}

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

	//Draw Game over Screen
	if (mineField.State == eFieldState.Menu ||
		((mineField.State == eFieldState.Won ||
		mineField.State == eFieldState.Lose) &&
		mineField.TimeInState >= 2))
	{
		//play end animation
		DrawMenuScreen(mousePos, clicked && mouseButton == LEFT)
	}
}

function DrawMenuScreen(mousePos, leftClicked)
{
		//show game over menu screen
		rect(BoxSizeX*0.1, BoxSizeY*0.25, BoxSizeX*0.8, BoxSizeY*0.6)

		fill(0,0,0)

		text("Main Menu", BoxSizeX*0.30, BoxSizeY*0.26, BoxSizeX*0.5, 100)

		Button("Start New", 
			createVector(BoxSizeX*0.35, BoxSizeY*0.73),
			createVector(BoxSizeX*0.3, BoxSizeY*0.1),
			mousePos, 
			leftClicked,
			StartNew)
}

function StartNew()
{
	mineField.MakeField()
}


function InRegion(mousePos)
{
	return mousePos.x < BoxSizeX &&
		mousePos.x > 0 &&
		mousePos.y < BoxSizeY &&
		mousePos.y > 0
}

function TextToFitBox(string, center, size)
{
	textSize(size.y)
	var width = textWidth(string)
	var newSize = min(size.y, size.y*(size.x/width))
	textSize(newSize)
	var yOffset = (size.y - newSize)/2
	var xOffset = (size.x - width)/2

	yOffset += size.y/10

	text(string, center.x+xOffset, center.y+yOffset, size.x, size.y)
}

function Button(label, pos, size, mousePos, leftClicked, action)
{
	strokeWeight(3)
	fill(255,255,255)

	rect(pos.x, pos.y, size.x, size.y)

	center = createVector(pos.x + size.x/2, pos.y)

	fill(0,0,0)
	TextToFitBox(label, center, size)

	if (leftClicked &&
		mousePos.x >= pos.x &&
		mousePos.x <= pos.x + size.x &&
		mousePos.y >= pos.y &&
		mousePos.y <= pos.y + size.y)
	{
		console.log("Triggered('"+label+"')");
		
		action()
	}
}