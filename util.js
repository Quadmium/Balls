function clamp(num, lower, upper)
{
	return Math.min(Math.max(num, lower), upper);
}

function componentToHex(c) 
{
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) 
{
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var graphics = function() 
{
	this.canvas = document.getElementById("can");
	this.ctx = this.canvas.getContext("2d");
};

var vector = function(x, y)
{
	this.x = x;
	this.y = y;
	this.mag = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};
	this.mag2 = function() {
		return this.x * this.x + this.y * this.y;
	};
	this.mult = function(c) {
		return new vector(this.x * c, this.y * c);
	};
	this.div = function(c) {
		return new vector(this.x / c, this.y / c);
	};
	this.add = function(v) {
		return new vector(this.x + v.x, this.y + v.y);
	};
	this.sub = function(v) {
		return new vector(this.x - v.x, this.y - v.y);
	};
	this.norm = function() {
		return new vector(this.x, this.y).div(this.mag());
	};
	this.dot = function(v) {
		return this.x * v.x + this.y * v.y;
	};
	this.comp = function(v) {
		return this.dot(v) / v.mag();
	};
	this.proj = function(v) {
		return v.norm().mult(this.comp(v));
	};
	this.clone = function() {
		return new vector(this.x, this.y);
	};
}