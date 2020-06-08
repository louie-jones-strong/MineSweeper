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
				var pos = createVector(x, y)
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
					this.GetAllowedNearCells(cell).forEach(nearCell => {
						nearCell.MinesNear += 1
					});
				}
			}
		}
	}

	CheckFinshed()
	{
		for (let y = 0; y < this.CellCountY; y++)
		{
			for (let x = 0; x < this.CellCountX; x++)
			{
				var cell = this.Grid[x][y]
				
				if (!cell.IsMine && cell.State != eCellState.Empty)
				{
					return false
				}
			}
		}
		return true
	}

	GetAllowedNearCells(cell, stateFiliter=eCellState.Normal)
	{
		var x = cell.GridPos.x
		var y = cell.GridPos.y

		var cellList = []
		for (let xOffSet = -1; xOffSet <= 1; xOffSet++) 
		{
			if (x+xOffSet >= 0 && x+xOffSet < this.CellCountX)
			{
				for (let yOffSet = -1; yOffSet <= 1; yOffSet ++) 
				{
					if (y+yOffSet >= 0 && y+yOffSet < this.CellCountY &&
						!(yOffSet == 0 && xOffSet == 0))
					{
						var subCell = this.Grid[y+yOffSet][x+xOffSet]
						if (subCell.State & stateFiliter == subCell.State)
						{
							cellList.push(subCell)
						}
					}
				}
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
			}
		}
		else if (cell.State != eCellState.Flagged && cell.State != eCellState.QuestionMark)
		{
			if (cell.IsMine)
			{
				cell.SetState(eCellState.Exploded)
				//game is now over
				this.MakeField()
			}
			else
			{
				this.RevealCell(cell)
				// need to reveal area around it

				if (this.CheckFinshed())
				{
					this.MakeField()
				}
			}
		}
		this.Draw()
	}

	RevealCell(cell)
	{
		if (!cell.IsMine)
		{
			cell.SetState(eCellState.Empty)
			if (cell.MinesNear == 0)
			{
				this.GetAllowedNearCells(cell, eCellState.Normal).forEach(nearCell => {
					this.RevealCell(nearCell)
				});
			}
		}
	}
}