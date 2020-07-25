function preload()
{
	CellNormalImage = loadImage('Assets/Images/CellNormal.png');
	CellEmptyImage = loadImage('Assets/Images/Empty.png');
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
	SetNumberOfMines(0)
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
		DrawMenuScreen(mousePos, mouseIsPressed, LastFramePressed, mouseButton == LEFT)
	}
	LastFramePressed = mouseIsPressed
}

function DrawMenuScreen(mousePos, mouseIsPressed, lastFramePressed, isLeft)
{
		//show game over menu screen
		rect(BoxSizeX*0.1, BoxSizeY*0.25, BoxSizeX*0.8, BoxSizeY*0.6)

		fill(0,0,0)

		text("Main Menu", BoxSizeX*0.30, BoxSizeY*0.26, BoxSizeX*0.5, 100)

		Slider("Mines", 
			createVector(BoxSizeX*0.2, BoxSizeY*0.4),
			createVector(BoxSizeX*0.6, BoxSizeY*0.1),
			mousePos, 
			mouseIsPressed && isLeft,
			SetNumberOfMines,
			GetNumberOfMines())

		Slider("Size", 
			createVector(BoxSizeX*0.2, BoxSizeY*0.6),
			createVector(BoxSizeX*0.6, BoxSizeY*0.1),
			mousePos, 
			mouseIsPressed && isLeft,
			SetSizeOfMap,
			GetSizeOfMap())

		Button("Start New", 
			createVector(BoxSizeX*0.35, BoxSizeY*0.73),
			createVector(BoxSizeX*0.3, BoxSizeY*0.1),
			mousePos, 
			mouseIsPressed && !lastFramePressed && isLeft,
			StartNew)
}

function StartNew()
{
	mineField.MakeField()
}

function SetNumberOfMines(value)
{
	mineField.NumberOfMines = 10 + round(value * 10)
	console.log("set number Of mines: "+mineField.NumberOfMines + " value: "+value)
}
function GetNumberOfMines()
{
	value = (mineField.NumberOfMines - 10) / 10
	return value
}

function SetSizeOfMap(value)
{
	size = 10 + round(value * 10)
	mineField.CellCountY = size
	mineField.CellCountX = size
	console.log("set Size: " + size + " value: "+value)
}
function GetSizeOfMap()
{
	value = (mineField.CellCountY - 10) / 10
	return value
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

function Slider(label, pos, size, mousePos, mouseDown, 
		setAction, value)
{
	center = createVector(pos.x + size.x/6, pos.y)
	TextToFitBox(label, center, size/3)

	sliderPos = createVector(pos.x + size.x/3, pos.y)
	sliderSize = createVector(size.x * 2/3, size.y)
	fill(150, 150, 150)
	noStroke()
	rect(sliderPos.x, pos.y + size.y/2 - 2, sliderSize.x, 4)

	fill(0,0,0)
	valuePoint = createVector(sliderPos.x + sliderSize.x*value, pos.y + size.y/2)
	ellipse(valuePoint.x, valuePoint.y, 15, 15)


	if (mouseDown &&
		mousePos.x >= sliderPos.x &&
		mousePos.x <= sliderPos.x + sliderSize.x &&
		mousePos.y >= sliderPos.y &&
		mousePos.y <= sliderPos.y + sliderSize.y)
	{
		newValue = (mousePos.x - sliderPos.x) / sliderSize.x
		
		setAction(newValue)
	}
	stroke(2)
}