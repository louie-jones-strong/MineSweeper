class ParticleSystem
{
	constructor(pos)
	{
		this.Pos = pos
		this.Particles = []
		this.LastFrameTime = millis()
	}

	Draw()
	{
		var deltaTime = millis() - LastFrameTime
		deltaTime /= 1000
		this.LastFrameTime = millis()
		
		for (let loop = this.Particles.length-1; loop > 0; loop-- )
		{
			var particle = this.Particles[loop];
			particle.Draw(deltaTime)
			
			if (particle.CanRemove())
			{
				this.Particles.splice(loop, 1)
			}
		}

		for (let loop = 0; loop < 1; loop++)
		{
			var particle = new Particle(this.Pos, 0.1, 0.2, 2, 6)
			this.Particles.push(particle)
		}
	}
}