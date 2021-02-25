const eFieldState = {
	Menu: 1,
	WaitingForStart: 2,
	Playing: 4,
	Won: 8,
	Lose: 16,
	All: 31
}

class MineField
{
	constructor(pos, size)
	{
		this.Pos = pos
		this.Size = size

		this.CellCountY = 10
		this.CellCountX = 10
		this.NumberOfMines = 10

		this.MakeField()
		this.SetState(eFieldState.Menu)
	}

	SetState(state)
	{
		if (this.State != state)
		{
			this.State = state
			this.TimeInState = 0
		}
	}

	MakeField()
	{
		this.StopWatch = 0
		this.NumInteractions = 0
		this.SetState(eFieldState.WaitingForStart)
		this.NumberCellsMarked = 0

		var cellSize = createVector(this.Size.x/this.CellCountX, this.Size.y/this.CellCountY)
		this.Grid = []
		var itemsToPickFrom = []
		for (let y = 0; y < this.CellCountY; y++)
		{
			var temp = []
			for (let x = 0; x < this.CellCountX; x++)
			{
				var cell  = new Cell(createVector(x, y), cellSize, this.Pos)
				temp.push(cell)
				itemsToPickFrom.push(cell)
			}
			this.Grid.push(temp)
		}



		
		for (let mineNum = 0; mineNum < this.NumberOfMines; mineNum++)
		{
			var pickedItem = itemsToPickFrom[Math.floor(Math.random() * itemsToPickFrom.length)];
			var index = itemsToPickFrom.indexOf(pickedItem);
			itemsToPickFrom.splice(index, 1)

			pickedItem.IsMine = true
			this.GetAllowedNearCells(pickedItem).forEach(nearCell => {
				nearCell.MinesNear += 1
			});
		}
	}

	CheckFinished()
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

	Draw(deltaTime)
	{
		if ((this.State == eFieldState.WaitingForStart ||
			this.State == eFieldState.Playing) &&
			this.NumInteractions > 0)
		{
			this.StopWatch += deltaTime
		}
		this.TimeInState += deltaTime

		this.Grid.forEach(y => 
		{
			y.forEach(cell => 
			{
				cell.Draw()
			});
		});

		this.Grid.forEach(y => 
		{
			y.forEach(cell => 
			{
				cell.DrawParticles()
			});
		});
	}

	TouchEvent(mousePos, isRight)
	{
		if (this.State != eFieldState.WaitingForStart &&
			this.State != eFieldState.Playing)
		{
			return
		}
		var posX = mousePos.x-this.Pos.x
		var posY = mousePos.y-this.Pos.y

		if (posX < 0 || posY < 0 ||
			posX > (this.Size.x) ||
			posY > (this.Size.y))
		{
			return;
		}

		touchX = int(posX / (this.Size.x/this.CellCountX))
		touchY = int(posY / (this.Size.y/this.CellCountY))

		console.log(touchX, touchY);
		var cell = this.Grid[touchY][touchX]

		if (isRight)
		{
			this.NumInteractions += 1
			switch (cell.State) 
			{
				case eCellState.Normal:
					this.NumberCellsMarked += 1
					cell.SetState(eCellState.Flagged)
					break;

				case eCellState.Flagged:
					this.NumberCellsMarked -= 1
					cell.SetState(eCellState.QuestionMark)
					break;

				case eCellState.QuestionMark:
					cell.SetState(eCellState.Normal)
					break;
			}
		}
		else if (cell.State != eCellState.Flagged && cell.State != eCellState.QuestionMark)
		{
			this.NumInteractions += 1
			if (cell.IsMine)
			{
				cell.SetState(eCellState.Empty)
				this.SetState(eFieldState.Lose)
				//game is now over
				return
			}
			else
			{
				this.RevealCell(cell)
				// need to reveal area around it

				if (this.CheckFinished())
				{
					this.SetState(eFieldState.Won)
					return
				}
			}
		}
		return
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