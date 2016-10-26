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
	// Convert to rectangle frame
	var posRect = otherBall.position.sub(curRect.position);
	posRect = posRect.rotate(curRect.rotation);
	var velRect = otherBall.velocity.rotate(curRect.rotation);
	
	// Clamp to find closest rectangle point
	var closestX = clamp(posRect.x, -curRect.width / 2, curRect.width / 2);
	var closestY = clamp(posRect.y, -curRect.height / 2, curRect.height / 2);

	var distanceX = posRect.x - closestX;
	var distanceY = posRect.y - closestY;

	// If less than radius away from closest point within rectangle, am hitting rectangle
	if(distanceX * distanceX + distanceY * distanceY < otherBall.radius * otherBall.radius)
	{
		// Project onto opposite axis in order to flip the correct component
		// i.e. flip the y component by projecting to the perpendicular axis, which happens to be the other axis in a rect
		var axis;

		if(Math.abs(distanceX) > Math.abs(distanceY))
		{
			axis = new vector(curRect.width, 0);
			posRect.x = (distanceX < 0 ? -1 : 1) * (curRect.width / 2 + otherBall.radius);
		}
		else
		{
			axis = new vector(0, curRect.height);
			posRect.y = (distanceY < 0 ? -1 : 1) * (curRect.height / 2 + otherBall.radius);
		}

		var projVel = velRect.proj(axis);
		velRect = velRect.add(projVel.mult(-2));

		otherBall.velocity = velRect.rotate(-curRect.rotation);
		posRect = posRect.rotate(-curRect.rotation);
		otherBall.position = curRect.position.add(posRect);
	}
}