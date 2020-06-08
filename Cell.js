const eCellState = {
	Normal: 1,
	Flagged: 2,
	QuestionMark: 4,
	Empty: 8,
	All: 15
}

class Cell
{
	constructor(gridPos, size, isMine)
	{
		this.GridPos = gridPos
		this.Pos = createVector(gridPos.x*size.x, gridPos.y*size.y)
		this.Size = size
		this.IsMine = isMine
		this.SetState(eCellState.Normal)
		this.MinesNear = 0
	}

	SetState(state)
	{
		this.State = state
		// this is not needed atm this.TimeInState = 0
	}

	Draw()
	{

		fill(255,255,255)
		stroke(0,0,0)
		strokeWeight(2)
		textSize(100);

		switch (this.State) 
		{
			case eCellState.Normal:
				fill(255,255,255)
				rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				break;

			case eCellState.Flagged:
				fill(0,255,0)
				rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				break;
				
			case eCellState.QuestionMark:
				fill(0,0,255)
				rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				fill(255,255,255)
				text("?", this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				break;

			case eCellState.Empty:
				if (this.IsMine)
				{
					fill(255,0,0)
					rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				}
				else if (this.MinesNear > 0)
				{
					strokeWeight(6)
					text(this.MinesNear.toString(), this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				}
				break;
		}

		// if (this.IsMine)
		// {
		// 	fill(255,0,0)
		// 	rect(this.Pos.x, this.Pos.y, this.Size.x/4, this.Size.y/4)
		// }
		
	}
}