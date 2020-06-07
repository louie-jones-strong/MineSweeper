const eMineState = {
	Normal: 0,
	Flagged: 1,
	QuestionMark: 2,
	Exploded: 3,
	Empty: 4
}

class Mine
{
	constructor(pos, size, isMine)
	{
		this.Pos = pos
		this.Size = size
		this.IsMine = isMine
		this.SetState(eMineState.Normal)
	}

	SetState(state)
	{
		this.State = state
		// this is not needed atm this.TimeInState = 0
	}

	Draw()
	{

		
		stroke(0,0,0)
		fill(255,255,255)
		strokeWeight(2)
		switch (this.State) 
		{
			case eMineState.Normal:
				rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				break;
			case eMineState.Empty:
				break;
			case eMineState.Exploded:
				fill(255,0,0)
				rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				break
		}
		
	}
}