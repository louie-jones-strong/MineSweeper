const eFieldState = {
	WaitingForStart: 1,
	Playing: 2,
	Won: 3,
	Lose: 4
}

class MineField
{
	constructor()
	{
		this.CellSize = 50
		this.NumberOfMines = 10;

		var mineField = document.getElementById("mineField");

		var height = mineField.clientHeight;
		var width = mineField.clientWidth;

		this.CellCountY = height / this.CellSize;
		this.CellCountX = width / this.CellSize;

		console.log(height, width);
		console.log(this.CellCountY, this.CellCountX);

		this.MakeField()
		this.SetState(eFieldState.WaitingForStart)

		this.LastClickedCellX = 0
		this.LastClickedCellY = 0
		this.LastClickTime = Time.getTime();
	}

	SetState(state)
	{
		if (this.State != state)
		{
			console.log(this.State, "->", state);
			this.State = state
			this.TimeInState = 0
		}
	}

	MakeField()
	{
		this.StopWatch = 0
		this.SetState(eFieldState.WaitingForStart)
		this.NumberCellsMarked = 0

		var mineField = document.getElementById("mineField");
		mineField.innerHTML = ""

		this.Grid = []
		var itemsToPickFrom = []
		for (let y = 0; y < this.CellCountY; y++)
		{
			var temp = []
			var rowText = "<div id='row_"+y+"' class='row' style='height:"+this.CellSize+"px;'>";

			for (let x = 0; x < this.CellCountX; x++)
			{
				var cell  = new Cell(x, y)
				temp.push(cell)
				itemsToPickFrom.push(cell)

				rowText += cell.CreateHtml(x, y, this.CellSize);
			}
			this.Grid.push(temp)
			rowText += "</div>";
			mineField.innerHTML += rowText;
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
				var cell = this.Grid[y][x]

				if (!cell.IsMine && cell.State != eCellState.Empty)
				{
					return false
				}
			}
		}
		return true
	}

	UpdateCellMarked(cell, marked)
	{
		var nearCells = this.GetAllowedNearCells(cell, eCellState.All)

		nearCells.forEach(nearCell => {
			if(marked)
			{
				nearCell.MarkedNear += 1
			}
			else
			{
				nearCell.MarkedNear -= 1
			}
		});
	}

	GetAllowedNearCells(cell, stateFilter=eCellState.Normal)
	{
		var x = cell.GridX
		var y = cell.GridY

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

						if ((subCell.State & stateFilter) == subCell.State)
						{
							cellList.push(subCell)
						}
					}
				}
			}
		}
		return cellList
	}

	TouchEvent(cellX, cellY, isRight)
	{
		if (this.State != eFieldState.WaitingForStart &&
			this.State != eFieldState.Playing)
		{
			return
		}

		this.SetState(eFieldState.Playing)

		var cell = this.Grid[cellY][cellX]

		if (isRight)
		{
			switch (cell.State)
			{
				case eCellState.Normal:
					this.NumberCellsMarked += 1
					cell.SetState(eCellState.Flagged)
					this.UpdateCellMarked(cell, true)
					break;

				case eCellState.Flagged:
					this.NumberCellsMarked -= 1
					cell.SetState(eCellState.QuestionMark)
					this.UpdateCellMarked(cell, false)
					break;

				case eCellState.QuestionMark:
					cell.SetState(eCellState.Normal)
					break;
			}
		}
		else if (cell.State != eCellState.Flagged && cell.State != eCellState.QuestionMark)
		{

			var doubleClick = this.LastClickedCellX == cellX &&
							this.LastClickedCellY == cellY &&
							(Time.getTime() - this.LastClickTime) < 200

			this.RevealCell(cell, doubleClick)
			// need to reveal area around it

			if (this.CheckFinished())
			{
				this.SetState(eFieldState.Won)
				return
			}

			this.LastClickedCellX = cellX
			this.LastClickedCellY = cellY
			this.LastClickTime = Time.getTime();
		}
		return
	}

	RevealCell(cell, doubleClick)
	{
		cell.SetState(eCellState.Empty)
		if (cell.IsMine)
		{
			this.SetState(eFieldState.Lose)
			//game is now over
			return
		}
		else
		{

			if (cell.MinesNear == 0 ||
				(doubleClick &&
				cell.MarkedNear >= cell.MinesNear))
			{
				this.GetAllowedNearCells(cell, eCellState.Normal).forEach(nearCell => {
					this.RevealCell(nearCell, false)
				});
			}
		}
	}
}

document.addEventListener('contextmenu', event => {
	event.preventDefault();
});


window.addEventListener('resize', Resize);

function Resize()
{
	console.log("resize");
	// Manager = new MineField();
}

function ClickCell(x, y, isRightClick)
{
	Manager.TouchEvent(x, y, isRightClick)
}

var Time = new Date();
var Manager = new MineField();