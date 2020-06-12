const eEmitterShape = {
	Point: 1,
	Square: 2,
}

class ParticleSystem
{
	constructor(pos, duration=-1, numParticles=100,emitterShape=eEmitterShape.Point)
	{
		this.Pos = pos
		this.Particles = []
		this.LastFrameTime = millis()
		this.EmitterShape = emitterShape
		this.Duration = duration
		this.NumberOfParticles = numParticles
		this.TimeSinceLastParticle = 0
		this.TimeAlive = 0
	}

	Draw()
	{
		var deltaTime = millis() - LastFrameTime
		deltaTime /= 100
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

	EmitParticle()
	{
		var numToAdd = 1
		
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
			var particle = new Particle(this.Pos, 0.2, 1, 2, 6)
			this.Particles.push(particle)
			this.TimeSinceLastParticle = 0
		}
	}
}