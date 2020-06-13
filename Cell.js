const eCellState = {
	Normal: 1,
	Flagged: 2,
	QuestionMark: 4,
	Empty: 8,
	All: 15
}

class Cell
{
	constructor(gridPos, size, posOffSet)
	{
		this.GridPos = gridPos
		this.Pos = createVector((gridPos.x*size.x)+posOffSet.x, (gridPos.y*size.y)+posOffSet.y)
		this.Size = size
		this.IsMine = false
		this.SetState(eCellState.Normal)
		this.MinesNear = 0

		this.ParticleSystem = new ParticleSystem(this.Pos, 0.2, 50, eEmitterShape.Square)
	}

	SetState(state)
	{
		// this is not needed atm this.TimeInState = 0
		if (this.State != state)
		{
			switch (state) 
			{
				case eCellState.Empty:
					this.ParticleSystem.Play()
					break;
			
				default:
					break;
			}
		}
		this.State = state
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
				image(CellNormalImage, this.Pos.x, this.Pos.y, this.Size.x, this.Size.y);
				break;

			case eCellState.Flagged:
				image(CellFlaggedImage, this.Pos.x, this.Pos.y, this.Size.x, this.Size.y);
				break;
				
			case eCellState.QuestionMark:
				image(CellQuestionMarkImage, this.Pos.x, this.Pos.y, this.Size.x, this.Size.y);
				break;

			case eCellState.Empty:
				if (this.IsMine)
				{
					fill(255,0,0)
					rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)
				}
				else 
				{
					strokeWeight(1)
					stroke(0,0,0,25)
					noFill()
					rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)

					if (this.MinesNear > 0)
					{
						stroke(0,0,0)
						fill(255,255,255)
						strokeWeight(6)
						this.TextToFitBox(this.MinesNear.toString())
					}
				}
				break;
		}
		// if (this.IsMine)
		// {
		// 	fill(255,0,0)
		// 	rect(this.Pos.x, this.Pos.y, this.Size.x/4, this.Size.y/4)
		// }
	}

	DrawParticles()
	{
		this.ParticleSystem.Draw()
	}

	TextToFitBox(string)
	{
		textSize(this.Size.y)
		var width = textWidth(string)
		var newSize = min(this.Size.y, this.Size.y*(this.Size.x/width))
		textSize(newSize)
		var yOffset = (this.Size.y - newSize)/2
		var xOffset = (this.Size.x - width)/2

		text(string, this.Pos.x+xOffset, this.Pos.y+yOffset, this.Size.x, this.Size.y)
	}
}