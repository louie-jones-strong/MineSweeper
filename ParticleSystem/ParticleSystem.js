const eEmitterShape = {
	Point: 1,
	Square: 2,
}

class ParticleSystem
{
	constructor(pos, duration, numOfParticles, emitterShape, emitterSize)
	{
		this.Pos = pos
		this.Particles = []
		this.LastFrameTime = millis()

		this.EmitterShape = emitterShape
		this.EmitterSize = emitterSize


		this.Duration = duration
		this.NumberOfParticles = numOfParticles
		this.TimeSinceLastParticle = 0
		this.TimeAlive = 0
		this.Started = false

		this.SetColour(255, 255, 255)
		this.SetParticleSize(5, 10)
	}

	SetColour(red, green, blue)
	{
		this.ColourRed = red
		this.ColourGreen = green
		this.ColourBlue = blue
	}

	SetParticleSize(minSize, maxSize=null)
	{
		this.MinSize = minSize
		this.MaxSize = maxSize
	}

	Play()
	{
		this.Started = true
		this.TimeSinceLastParticle = 0
		this.TimeAlive = 0
		this.LastFrameTime = millis()
	}

	Draw()
	{
		if (this.Started)
		{
			var deltaTime = millis() - this.LastFrameTime
			deltaTime /= 1000
			this.LastFrameTime = millis()
			this.TimeSinceLastParticle += deltaTime
			this.TimeAlive += deltaTime
			
			for (let loop = this.Particles.length-1; loop > 0; loop-- )
			{
				var particle = this.Particles[loop];
				particle.Draw(deltaTime)
				
				if (particle.CanRemove())
				{
					this.Particles.splice(loop, 1)
				}
			}

			this.EmitParticle()
		}
	}

	EmitParticle()
	{
		var numToAdd = this.NumberOfParticles
		
		if (this.TimeAlive > this.Duration && this.Duration > 0)
		{
			return
		}

		if (this.Duration > 0 && this.NumberOfParticles > 0)
		{
			numToAdd = this.TimeSinceLastParticle/(this.Duration/this.NumberOfParticles)
		}

		for (let loop = 0; loop < numToAdd; loop++)
		{
			var pos = createVector(this.Pos.x, this.Pos.y)
			if (this.EmitterShape == eEmitterShape.Square)
			{
				if (Math.random()-0.5 < 0)
				{
					pos.x += Math.random()*this.EmitterSize.x
					pos.y += Math.floor(Math.random()*2)*this.EmitterSize.y
				}
				else
				{
					pos.x += Math.floor(Math.random()*2)*this.EmitterSize.x
					pos.y += Math.random()*this.EmitterSize.y
				}
				
				pos.x -= this.EmitterSize.x/2
				pos.y -= this.EmitterSize.y/2
			}


			var particle = new Particle(pos, 0.2, 1, this.MinSize, this.MaxSize)
			particle.SetColour(this.ColourRed, this.ColourGreen, this.ColourBlue)
			this.Particles.push(particle)
			this.TimeSinceLastParticle = 0
		}
	}
}