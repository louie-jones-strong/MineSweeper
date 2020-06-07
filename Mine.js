const eState = {
	Normal: 0,
	Exploded: 1,
	Empty: 2,
}

class Mine
{
	constructor(pos, size, isMine)
	{
		this.Pos = pos
		this.Size = size
		this.State = eState.Normal
		this.IsMine = isMine
	}

	Draw()
	{

		
		stroke(0,0,0)
		fill(255,255,255)
		strokeWeight(2)
		switch (this.State) 
		{
			case eState.Normal:
				rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				break;
			case eState.Empty:
				break;
		}
		
		if (this.IsMine)
		{
			fill(255,0,0)
			rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
		}
	}

	Touch()
	{
		this.State = eState.Empty
	}
}