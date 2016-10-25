function handleCollision(curObj, otherObj)
{
	// Hardcoded to allow inlining optimization
	
	if(curObj instanceof pBall && otherObj instanceof pBall)
		handleCollisionBallBall(curObj, otherObj);
	else if(curObj instanceof pRect && otherObj instanceof pBall)
		handleCollisionRectBall(curObj, otherObj);
	else if(curObj instanceof pBall && otherObj instanceof pRect)
		handleCollisionRectBall(otherObj, curObj);
}

function handleCollisionBallBall(curBall, otherBall)
{
	var axis = curBall.position.sub(otherBall.position);
	if(axis.mag2() < (curBall.radius + otherBall.radius) * (curBall.radius + otherBall.radius) && curBall.collision && otherBall.collision)
	{
		// Project both velocities to axis frame
		var bc1 = curBall.velocity.proj(axis);
		var bc2 = otherBall.velocity.proj(axis);

		// Convert axis frame to center of mass frame
		// Negate these velocities and return to axis frame
		var cmVel = bc1.mult(curBall.mass).add(bc2.mult(otherBall.mass)).div(curBall.mass + otherBall.mass);
		var newv1 = bc1.sub(cmVel).mult(-1).add(cmVel);
		var newv2 = bc2.sub(cmVel).mult(-1).add(cmVel);

		curBall.velocity = curBall.velocity.sub(bc1).add(newv1);
		otherBall.velocity = otherBall.velocity.sub(bc2).add(newv2);

		// Avoid balls inside each other by moving smaller ball
		var smallerBall = curBall.radius < otherBall.radius ? curBall : otherBall;
		var biggerBall = curBall.radius < otherBall.radius ? otherBall : curBall;
		if(smallerBall == otherBall)
			axis = axis.mult(-1);

		smallerBall.position = biggerBall.position.add(axis.norm().mult(smallerBall.radius + biggerBall.radius));
	}
}

function handleCollisionRectBall(curRect, otherBall)
{
	// Clamp to find closest rectangle point
	var closestX = clamp(otherBall.position.x, curRect.position.x - curRect.width / 2, curRect.position.x + curRect.width / 2);
	var closestY = clamp(otherBall.position.y, curRect.position.y - curRect.height / 2, curRect.position.y + curRect.height / 2);

	var distanceX = otherBall.position.x - closestX;
	var distanceY = otherBall.position.y - closestY;

	if(distanceX * distanceX + distanceY * distanceY < otherBall.radius * otherBall.radius)
	{
		console.log("Collision");
		console.log(curRect.position.y);
	}
}