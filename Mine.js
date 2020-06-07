const eMineState = {
	Normal: 0,
	Flagged: 1,
	QuestionMark: 2,
	Empty: 3,
	Exploded: 4
}

class Mine
{
	constructor(pos, size, isMine)
	{
		this.Pos = pos
		this.Size = size
		this.IsMine = isMine
		this.SetState(eMineState.Normal)
		this.MinesNear = 2
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
			case eMineState.Normal:
				fill(255,255,255)
				rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				break;

			case eMineState.Flagged:
				fill(0,255,0)
				rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				break;
				
			case eMineState.QuestionMark:
				fill(0,0,255)
				rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				text("?", this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				break;

			case eMineState.Empty:
				strokeWeight(6)
				text(this.MinesNear.toString(), this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				break;

			case eMineState.Exploded:
				fill(255,0,0)
				rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				break;
		}
		
	}
}