class Particle
{
	constructor(pos, minLifeTime, maxLifeTime=null, minSize, maxSize=null)
	{
		this.TimeAlive = 0
		this.Pos = createVector(pos.x, pos.y)

		this.Size = this.GetRandomFromRange(minSize, maxSize)
		
		this.Velocity = createVector(Math.random()*4-2, Math.random()*4-2)
		this.Acceleration = this.GetRandomFromRange(0.9, 1)

		this.LifeTime = this.GetRandomFromRange(minLifeTime, maxLifeTime)
	}

	GetRandomFromRange(min, max)
	{
		var ouput = min
		if (max != null)
		{
			ouput += (max-min)*Math.random()
		}
		return ouput
	}

	CanRemove()
	{
		if (this.TimeAlive >= this.LifeTime*2)
		{
			console.error("particle been alive too long!!")
		}
		return this.TimeAlive >= this.LifeTime
	}

	Draw(deltaTime)
	{
		noStroke()
		this.TimeAlive += deltaTime

		this.Velocity.x *= this.Acceleration
		this.Velocity.y *= this.Acceleration

		this.Pos.x += this.Velocity.x// * deltaTime
		this.Pos.y += this.Velocity.y// * deltaTime

		fill(0,0,0, 255-(this.TimeAlive/this.LifeTime)*255)
		ellipse(this.Pos.x, this.Pos.y, this.Size, this.Size)
	}
}
