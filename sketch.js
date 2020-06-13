function preload()
{
	CellNormalImage = loadImage('assets/CellNormal.png');
	CellFlaggedImage = loadImage('assets/CellFlagged.png');
	CellQuestionMarkImage = loadImage('assets/CellQuestionMark.png');
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
	text(mineField.StopWatch, 0, 25, 100,100)
}

function InRegion(mousePos)
{
	return mousePos.x < BoxSizeX &&
		mousePos.x > 0 &&
		mousePos.y < BoxSizeY &&
		mousePos.y > 0
}