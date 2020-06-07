class MineField
{
	constructor()
	{
		BoxSizeX, BoxSizeY

		this.MineCountY = 5
		this.MineCountX = 5

		var size = createVector(BoxSizeX/this.MineCountX, BoxSizeY/this.MineCountY)

		this.Grid = []
		for (let y = 0; y < this.MineCountY; y++)
		{
			var temp = []
			for (let x = 0; x < this.MineCountX; x++)
			{
				var isMine = Math.random()*100 <= 10
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

		var mine = this.Grid[touchY][touchX]

		if (isRight)
		{
			switch (mine.State) 
			{
				case eMineState.Normal:
					mine.SetState(eMineState.Flagged)
					break;

				case eMineState.Flagged:
					mine.SetState(eMineState.QuestionMark)
					break;

				case eMineState.QuestionMark:
					mine.SetState(eMineState.Normal)
					break;
				default:
					break;
			}
		}
		else if (mine.State != eMineState.Flagged && mine.State != eMineState.QuestionMark)
		{
			if (mine.IsMine)
			{
				mine.SetState(eMineState.Exploded)
				// need to reveal area around it
			}
			else
			{
				mine.SetState(eMineState.Empty)
			}
		}
	}
}