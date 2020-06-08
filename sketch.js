function preload()
{
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
	BoxSizeY = 750
	createCanvas(BoxSizeX, BoxSizeY);
	strokeWeight(4);
	mineField = new MineField()
	LastFramePressed = false
	FirstFrame = true
}


function draw()
{
	background(100);

	mousePos = createVector(mouseX, mouseY)

	if (mouseIsPressed && !LastFramePressed &&
		(mouseButton == LEFT ||
		mouseButton == RIGHT) &&
		InRegion(mousePos))
	{
		mineField.TouchEvent(mousePos, mouseButton == RIGHT)
	}
	LastFramePressed = mouseIsPressed

	if (FirstFrame)
	{
		mineField.Draw()
	}
}

function InRegion(mousePos)
{
	return mousePos.x < BoxSizeX &&
		mousePos.x > 0 &&
		mousePos.y < BoxSizeY &&
		mousePos.y > 0
}