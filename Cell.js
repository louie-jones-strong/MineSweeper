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
	constructor(x, y){
		this.GridX = x
		this.GridY = y
		this.IsMine = false
		this.MinesNear = 0
		this.MarkedNear = 0
		this.State = eCellState.Normal
	}

	CreateHtml(x, y, cellSize){
		var cellHtml = "";
		cellHtml += "<div id='cell_"+x+"_"+y+"' class='cell normal'"
		cellHtml += " onclick=ClickCell("+x+","+y+",false)"
		cellHtml += " oncontextmenu=ClickCell("+x+","+y+",true)"
		cellHtml += " style='width:"+cellSize+"px; height:"+cellSize+"px; font-size:"+cellSize+"px;'";
		cellHtml += ">";
		cellHtml += "</div>";

		return cellHtml;
	}

	SetState(state){
		this.State = state

		var cell = document.getElementById("cell_"+this.GridX+"_"+this.GridY);

		cell.classList = "cell"

		switch (this.State)
		{
			case eCellState.Normal:
				cell.classList.add("normal");
				break;

			case eCellState.Flagged:
				cell.classList.add("flagged");
				break;

			case eCellState.QuestionMark:
				cell.classList.add("questionMark");
				break;

			case eCellState.Empty:
				cell.classList.add("empty");

				if (this.IsMine)
				{
					cell.innerHTML = '<div class="mine"></div>'
				}
				else
				{
					if (this.MinesNear > 0)
					{
						var colour = NumberColours[this.MinesNear]
						cell.innerHTML = "<p style='color: "+colour+"'>"+this.MinesNear+"</p>"
					}
				}
				break;
		}
		var cell = document.getElementById("cell_"+this.GridX+"_"+this.GridY);
	}
}