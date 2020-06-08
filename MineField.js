class MineField
{
	constructor()
	{
		BoxSizeX, BoxSizeY

		this.CellCountY = 5
		this.CellCountX = 5
		this.NumberOfMines = 5

		this.MakeField()
	}

	MakeField()
	{
		var cellSize = createVector(BoxSizeX/this.CellCountX, BoxSizeY/this.CellCountY)

		this.Grid = []
		for (let y = 0; y < this.CellCountY; y++)
		{
			var temp = []
			for (let x = 0; x < this.CellCountX; x++)
			{
				var isMine = Math.random()*100 <= 10
				var pos = createVector(x*cellSize.x, y*cellSize.y)
				var cell = new Cell(pos, cellSize, isMine)

				temp.push(cell)
			}
			this.Grid.push(temp)
		}

		for (let y = 0; y < this.CellCountY; y++)
		{
			for (let x = 0; x < this.CellCountX; x++)
			{
				var cell = this.Grid[x][y]
				
				if (cell.IsMine)
				{
					this.GetAllowedNearCells(x, y).forEach(nearCell => {
						nearCell.MinesNear += 1
					});
				}
			}
		}
	}

	GetAllowedNearCells(x, y)
	{
		var cellList = []
		if (x-1 >= 0)
		{
			if (y-1 >= 0)
			{
				cellList.push(this.Grid[x-1][y-1])
			}

			cellList.push(this.Grid[x-1][y])

			if (y+1 <this.CellCountY)
			{
				cellList.push(this.Grid[x-1][y+1])
			}
		}
		
		if (y-1 >= 0)
		{
			cellList.push(this.Grid[x][y-1])
		}

		if (y+1 <this.CellCountY)
		{
			cellList.push(this.Grid[x][y+1])
		}

		if (x+1 <this.CellCountX)
		{
			if (y-1 >= 0)
			{
				cellList.push(this.Grid[x+1][y-1])
			}

			cellList.push(this.Grid[x+1][y])

			if (y+1 <this.CellCountY)
			{
				cellList.push(this.Grid[x+1][y+1])
			}
		}
		
		return cellList
	}

	Draw(mousePos)
	{
		this.Grid.forEach(y => 
		{
			y.forEach(cell => 
			{
				cell.Draw()
			});
		});
	}

	TouchEvent(mousePos, isRight)
	{
		touchX = int(mousePos.x / (BoxSizeX/this.CellCountX))
		touchY = int(mousePos.y / (BoxSizeY/this.CellCountY))

		var cell = this.Grid[touchY][touchX]

		if (isRight)
		{
			switch (cell.State) 
			{
				case eCellState.Normal:
					cell.SetState(eCellState.Flagged)
					break;

				case eCellState.Flagged:
					cell.SetState(eCellState.QuestionMark)
					break;

				case eCellState.QuestionMark:
					cell.SetState(eCellState.Normal)
					break;
				default:
					break;
			}
		}
		else if (cell.State != eCellState.Flagged && cell.State != eCellState.QuestionMark)
		{
			if (cell.IsMine)
			{
				cell.SetState(eCellState.Exploded)
				//game is now over
			}
			else
			{
				cell.SetState(eCellState.Empty)
				// need to reveal area around it
			}
		}
	}
}