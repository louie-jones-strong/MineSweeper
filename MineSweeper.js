const eFieldState = {
	WaitingForStart: 1,
	Playing: 2,
	Won: 3,
	Lose: 4
}

const eCellState = {
	Normal: 1,
	Flagged: 2,
	QuestionMark: 4,
	Empty: 8,
	All: 15
}

NumberColours = {
	1: "rgb(0,0,255)",
	2: "rgb(0,255,0)",
	3: "rgb(255,0,0)",
	4: "rgb(0,0,255)",
	5: "rgb(255,255,255)",
	6: "rgb(255,255,255)",
	7: "rgb(255,255,255)",
	8: "rgb(255,255,255)",
}

class Cell
{
	constructor(x, y) {
		this.GridX = x
		this.GridY = y
		this.IsMine = false
		this.MinesNear = 0
		this.MarkedNear = 0
		this.State = eCellState.Normal
	}

	CreateHtml(x, y) {
		var cellHtml = "";
		cellHtml += "<div id='cell_"+x+"_"+y+"' class='cell normal'"
		cellHtml += " onclick=ClickCell("+x+","+y+",false)"
		cellHtml += " oncontextmenu=ClickCell("+x+","+y+",true)"
		cellHtml += ">";
		cellHtml += "</div>";

		return cellHtml;
	}

	SetState(state) {
		if (this.State == state)
		{
			return;
		}
		this.State = state

		var cell = document.getElementById("cell_"+this.GridX+"_"+this.GridY);

		cell.classList = "cell"
		let html = "";

		switch (this.State)
		{
			case eCellState.Normal:
				cell.classList.add("normal");
				break;

			case eCellState.Flagged:
				cell.classList.add("normal");
				cell.classList.add("flagged");
				break;

			case eCellState.QuestionMark:
				cell.classList.add("normal");
				html = "<p>?</p>"
				break;

			case eCellState.Empty:
				cell.classList.add("empty");

				if (this.IsMine)
				{
					html = '<div class="mine"></div>'
				}
				else
				{
					if (this.MinesNear > 0)
					{
						var colour = NumberColours[this.MinesNear]
						html = "<p style='color: "+colour+"'>"+this.MinesNear+"</p>"
					}
				}
				break;
		}

		cell.innerHTML = html;
	}
}

class MineField
{
	constructor() {
		this.CellSize = 56 //pixels

		var gridSize = this.GetGridSize();
		this.Reset(gridSize[0], gridSize[1]);
		this.StartTime = 0;
	}

	GetGridSize() {
		var mineField = document.getElementById("mineField");

		var width = mineField.clientWidth;
		var height = mineField.clientHeight;

		var cellCountX = Math.floor(width / this.CellSize);
		var cellCountY = Math.floor(height / this.CellSize);

		return [cellCountX, cellCountY];
	}

	Reset(cellCountX, cellCountY) {
		this.CellCountX = cellCountX;
		this.CellCountY = cellCountY;

		this.NumberOfMines = Math.floor(this.CellCountX * this.CellCountY * 0.1);

		var mineField = document.getElementById("mineField");
		mineField.innerHTML = ""

		this.Grid = []
		var itemsToPickFrom = []
		for (let y = 0; y < this.CellCountY; y++)
		{
			var temp = []
			var rowText = "<div id='row_"+y+"' class='row'>";

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

		this.NumberCellsMarked = 0;
		this.SetState(eFieldState.WaitingForStart);
		this.LastClickedCellX = 0;
		this.LastClickedCellY = 0;
		this.LastClickTime = Date.now();
		this.StartTime = 0;
	}

	SetState(state) {
		if (this.State != state)
		{
			this.State = state
			this.TimeInState = 0
		}
	}

	CheckFinished() {
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

	UpdateCellMarked(cell, marked) {
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

	GetAllowedNearCells(cell, stateFilter=eCellState.Normal) {
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

	TouchEvent(cellX, cellY, isRight) {
		if (this.State != eFieldState.WaitingForStart &&
			this.State != eFieldState.Playing)
		{
			return
		}

		if (this.State == eFieldState.WaitingForStart){
			this.StartTime = Date.now();
			this.SetState(eFieldState.Playing);
		}

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
							(Date.now() - this.LastClickTime) < 200

			this.RevealCell(cell, doubleClick)
			// need to reveal area around it

			if (this.CheckFinished())
			{
				this.SetState(eFieldState.Won);
				this.StartTime = Date.now() - this.StartTime;
				ShowPopup("You Won", this.StartTime);
				return
			}

			this.LastClickedCellX = cellX
			this.LastClickedCellY = cellY
			this.LastClickTime = Date.now();
		}
		return
	}

	RevealCell(cell, doubleClick) {
		cell.SetState(eCellState.Empty)
		if (cell.IsMine)
		{
			this.SetState(eFieldState.Lose)
			this.StartTime = Date.now() - this.StartTime;
			//game is now over
			ShowPopup("You Lose", this.StartTime);
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

document.getElementById("mineField").addEventListener('contextmenu', event => {
	event.preventDefault();
});


window.addEventListener('resize', Resize);

function Resize()
{

	var gridSize = Manager.GetGridSize();

	if (gridSize[0] != Manager.CellCountX ||
		gridSize[1] != Manager.CellCountY)
	{
		Manager.Reset(gridSize[0], gridSize[1]);
	}
}

function Restart() {
	var gridSize = Manager.GetGridSize();
	Manager.Reset(gridSize[0], gridSize[1]);

	var popupHolder = document.getElementById("popupHolder");
	popupHolder.classList.remove("popupShowing");
	popupHolder.innerHTML = "";
}

function ClickCell(x, y, isRightClick) {
	Manager.TouchEvent(x, y, isRightClick)
}

function GetTimeString(ms)
{
	var seconds = Math.round(ms / 1000);
	var mins = Math.floor(seconds / 60);
	var remainingSeconds = seconds % 60;

	if (remainingSeconds < 10)
	{
		remainingSeconds = "0"+remainingSeconds;
	}

	return mins + ":" + remainingSeconds;
}

function UpdateControls()
{

	var elapsedTimeMs = Manager.StartTime;

	if (Manager.State == eFieldState.Playing){
		elapsedTimeMs = Date.now() - Manager.StartTime;
	}

	document.getElementById('mineSweeperTimer').innerHTML = GetTimeString(elapsedTimeMs);

	document.getElementById('mineSweeperBombs').innerHTML = Manager.NumberOfMines - Manager.NumberCellsMarked;

	setTimeout(UpdateControls, 500);
}

function ShowPopup(title, elapsedTimeMs)
{
	var popupHolder = document.getElementById("popupHolder");
	popupHolder.classList.add("popupShowing");

	popupHolder.innerHTML = `
		<div class="popup">
			<h1>Game Over!</h1>
			<h2>${title}</h2>

			<div id="mineSweeperControls">
				<div class="control">
					<span class="material-icons">schedule</span>
					<p>${GetTimeString(elapsedTimeMs)}</p>
				</div>
			</div>

			<button onclick="Restart()">Play Again</button>
		</div>`;
}

var Manager = new MineField();
UpdateControls();