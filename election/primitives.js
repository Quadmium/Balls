var pBall = function(radius, position) 
{
	this.radius = radius == undefined ? 50 : radius;
	this.position = position == undefined ? new vector(0, 0) : position.clone();
	this.velocity = new vector(0, 0);
	this.acceleration = new vector(0, 0);
	this.mass = 1;
	this.color = "#000000";
	this.collision = true;
};

var pRect = function(width, height, position, rotation)
{
	this.width = width;
	this.height = height;
	this.position = position == undefined ? new vector(0, 0) : position.clone();
	this.rotation = rotation == undefined ? 0 : rotation;
	this.velocity = new vector(0, 0);
	this.acceleration = new vector(0, 0);
	this.mass = 1;
	this.color = "#000000";
	this.collision = true;
	this.outline = false;
};

pBall.prototype.onUpdate = function(deltaTime) 
{
	this.acceleration.y = -500;
	this.velocity = this.velocity.add(this.acceleration.mult(deltaTime));
	this.position = this.position.add(this.velocity.mult(deltaTime));

	if(this.position.y < this.radius)
	{
		this.velocity.y = -this.velocity.y;
		this.position.y = this.radius;
		if(friction)
			this.velocity.y *= mu;
	}

	if(this.position.y > g.height - this.radius)
	{
		this.velocity.y = -this.velocity.y;
		this.position.y = g.height - this.radius;
		if(friction)
			this.velocity.y *= mu;
	}

	if(this.position.x < this.radius)
	{
		this.velocity.x = -this.velocity.x;
		this.position.x = this.radius;
		if(friction)
			this.velocity.x *= mu
	}

	if(this.position.x > g.width - this.radius)
	{
		this.velocity.x = -this.velocity.x;
		this.position.x = g.width - this.radius;
		if(friction)
			this.velocity.x *= mu;
	}
}

pBall.prototype.onDraw = function(g) 
{
	g.ctx.fillStyle = this.color;
	g.ctx.beginPath();
	g.ctx.arc(this.position.x * scale, g.canvas.height - this.position.y * scale, this.radius * scale, 0, 2 * Math.PI);
	g.ctx.fill();
	g.ctx.closePath();
}

pRect.prototype.onUpdate = function(deltaTime) 
{
	this.rotation += deltaTime;
}

pRect.prototype.onDraw = function(g) 
{
	g.ctx.fillStyle = this.color;
	g.ctx.strokeStyle = this.color;
	g.ctx.beginPath();
	g.ctx.save();
	g.ctx.translate(this.position.x * scale, g.canvas.height - this.position.y * scale);
	g.ctx.rotate(this.rotation);
	g.ctx.rect(-this.width / 2 * scale, -this.height / 2 * scale, this.width * scale, this.height * scale);
	if(this.outline)
		g.ctx.stroke();
	else
		g.ctx.fill();
	g.ctx.restore();
	g.ctx.closePath();
}