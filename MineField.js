class MineField
{
	constructor()
	{
		BoxSizeX, BoxSizeY

		this.MineCountY = 25
		this.MineCountX = 25

		var size = createVector(BoxSizeX/this.MineCountX, BoxSizeY/this.MineCountY)

		this.Grid = []
		for (let y = 0; y < this.MineCountY; y++)
		{
			var temp = []
			for (let x = 0; x < this.MineCountX; x++)
			{
				var isMine = Math.random()*100 <= 1
				var pos = createVector(x*size.x, y*size.y)
				temp.push(new Mine(pos, size, isMine))
			}
			this.Grid.push(temp)
		}
	}

	Draw(mousePos)
	{
		this.Grid.forEach(y => 
		{
			y.forEach(mine => 
			{
				mine.Draw()
			});
		});
	}

	TouchEvent(mousePos, isRight)
	{
		if (mousePos.x > BoxSizeX || 
			mousePos.x < 0 ||
			mousePos.y > BoxSizeY || 
			mousePos.y < 0)
		{
			return
		}
		touchX = int(mousePos.x / (BoxSizeX/this.MineCountX))
		touchY = int(mousePos.y / (BoxSizeY/this.MineCountY))

		this.Grid[touchY][touchX].Touch(isRight)
	}
}