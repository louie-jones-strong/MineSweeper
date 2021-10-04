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
		this.MarkedNear = 0

		var psPos = createVector(this.Pos.x+this.Size.x/2, this.Pos.y+this.Size.y/2)

		this.NumberColours = {
			1: color(0,0,255),
			2: color(0,255,0),
			3: color(255,0,0),
			4: color(0,0,255),
			5: color(255,255,255),
			6: color(255,255,255),
			7: color(255,255,255),
			8: color(255,255,255),
		}
	}

	SetState(state)
	{
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
				image(CellEmptyImage, this.Pos.x, this.Pos.y, this.Size.x, this.Size.y);
				if (this.IsMine)
				{
					image(MineImage, this.Pos.x, this.Pos.y, this.Size.x, this.Size.y);
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

						var textPos = createVector(this.Pos.x+this.Size.x/2, this.Pos.y)
						TextToFitBox(this.MinesNear.toString(), textPos, this.Size)
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
}