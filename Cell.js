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

		var psPos = createVector(this.Pos.x+this.Size.x/2, this.Pos.y+this.Size.y/2)
		this.ParticleSystem = new ParticleSystem(psPos, this.Size)

		this.NumberColours = {
			1:color(0,0,255),
			2:color(0,255,0),
			3:color(255,0,0),
			4:color(0,0,255),
			5:color(255,255,255),
			6:color(255,255,255),
			7:color(255,255,255),
			8:color(255,255,255),
		}
	}

	SetState(state)
	{
		// this is not needed atm this.TimeInState = 0
		if (this.State != state)
		{
			switch (state) 
			{
				case eCellState.Empty:
					if (this.IsMine)
					{
						this.ParticleSystem.SetColour(255, 0, 0)
						this.ParticleSystem.SetEmitSetting(eEmitterShape.Point, 0.1, 50)
						this.ParticleSystem.SetParticleLifeTime(2, 3)
						this.ParticleSystem.SetParticleSize(10,20)
					}
					else
					{
						this.ParticleSystem.SetParticleSize(4,6)
						this.ParticleSystem.SetEmitSetting(eEmitterShape.Square, 0.2, 30)
						this.ParticleSystem.SetColour(255, 150, 0)
						this.ParticleSystem.SetParticleLifeTime(0.1, 0.4)
					}
					this.ParticleSystem.Play()
					break;
				
				case eCellState.Flagged:
						
					this.ParticleSystem.SetParticleSize(6,9)
					this.ParticleSystem.SetEmitSetting(eEmitterShape.Square, 0.2, 30)
					this.ParticleSystem.SetColour(0, 255, 0)
					this.ParticleSystem.SetParticleLifeTime(0.5, 0.65)
					
					this.ParticleSystem.Play()
					break;

				case eCellState.QuestionMark:
					this.ParticleSystem.SetEmitSetting(eEmitterShape.Square, 0.2, 40)
					this.ParticleSystem.SetParticleSize(4,6)
					this.ParticleSystem.SetColour(128,0,128)
					this.ParticleSystem.SetParticleLifeTime(0.1, 0.5)
					
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
					ellipse(this.Pos.x+this.Size.x/2, this.Pos.y+this.Size.y/2, this.Size.x/2, this.Size.y/2)
				}
				else 
				{
					strokeWeight(1)
					stroke(0,0,0,25)
					noFill()
					rect(this.Pos.x, this.Pos.y, this.Size.x, this.Size.y)

					if (this.MinesNear > 0)
					{
						var colour = color(255,255,255)
						if (this.MinesNear in this.NumberColours)
						{
							colour = this.NumberColours[this.MinesNear]
						}
						stroke(0,0,0)
						fill(colour)
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

		yOffset += this.Size.y/10

		text(string, this.Pos.x+xOffset, this.Pos.y+yOffset, this.Size.x, this.Size.y)
	}
}