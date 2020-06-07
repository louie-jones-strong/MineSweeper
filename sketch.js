function preload()
{
}

function setup()
{
	BoxSizeX = 750
	BoxSizeY = 750
	createCanvas(BoxSizeX, BoxSizeY);
	strokeWeight(4);
	mineField = new MineField()
	LastFramePressed = false
}


function draw()
{
	background(100);

	mousePos = createVector(mouseX, mouseY)

	if (mouseIsPressed && !LastFramePressed &&
		(mouseButton == LEFT ||
		mouseButton == RIGHT))
	{
		mineField.TouchEvent(mousePos, mouseButton == RIGHT)
	}
	LastFramePressed = mouseIsPressed

	stroke(0,0,0)
	strokeWeight(2)

	mineField.Draw()

	strokeWeight(10)
	stroke(0,0,0)

	point(mousePos.x, mousePos.y)
}