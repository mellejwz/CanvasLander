window.onload=init;
var ctx;

//stars variables (not yet implemented)
var starX=Math.round(Math.random)*100;
var starY=Math.round(Math.random)*40;

//keyboard keys
var up=false;
var right=false;
var left=false;

//location and rotation of the ship
var x=Math.random()*800;
var y=500;
var rotation=0;

//initial vectors
var vector={
	x: 0,
	y: 0
}

function init(){
	document.onkeydown=handleKeyDown;
	document.onkeyup=handleKeyUp;
	var canvas=document.querySelector("canvas");
	ctx=canvas.getContext("2d");
	animate();
	console.log(starX);
	//alert('Press the up arrow key to accelerate, and the left and right arrow keys to rotate the ship.\n\nThe maximum safe descent rate is 5m/s,\nland faster and you will crash!\n\nClick OK to continue');
}

function animate(){
	moveShip();
	checkBounds();
	drawScene();
	drawStars();
	requestAnimationFrame(animate);
}

//handle keypresses
function handleKeyDown(evt){
	evt=evt||window.event;
	switch(evt.keyCode){
		case 37:
			left=true;
			break;
		case 38:
			up=true;
			break;
		case 39:
			right=true;
			break;
	}
}
function handleKeyUp(evt){
	evt=evt||window.event;
	switch (evt.keyCode){
		case 37:
			left=false;
			break;
		case 38:
			up=false;
			break;
		case 39:
			right=false;
			break;
	}
}

//move the ship
function moveShip(){
	//gravity and horizontal speed
	vector.y-=0.01;
	x+=vector.x;
	y-=vector.y;

	//rotate left
	if(left){
		rotation-=0.03;
	}

	//rotate right
	if(right){
		rotation+=0.03;
	}

	//accelerate towards current direction
	if(up){
		if((y>250 && y<251)&&(x>320&&x<330) || y>=590){
			vector.x+=Math.sin(rotation)*0.05;
			vector.y+=Math.cos(rotation)*0.05;
			y-=0.01;
		}
		else{
			vector.x+=Math.sin(rotation)*0.05;
			vector.y+=Math.cos(rotation)*0.05;
		}
	}
}

function checkBounds(){
	//ground/edge detection and bounce
	if(y>=590){
			if(Math.round(vector.y*10)<-15){
				alert('Crashed!');
				vector.x=0;
				vector.y=0;
			}
			else{
				y=590;
				rotation=0;

				//bounce
				vector.y*=-0.5;
				vector.x*=0.5;
			}
	}
	else if(y<=60){
		if(Math.round(vector.y*10)>30){
			alert('Crashed!');
			vector.x=0;
			vector.y=0;
		}
		else{
			y=60;
			vector.y=-0.5;
		}
	}

	if(x<=30){
		if(Math.round(vector.x*10)<-30){
			alert('Crashed!');
			vector.x=0;
			vector.y=0;
		}
		else{
			x=30;
			vector.x*=-0.3;
		}
	}
	else if(x>=770){
		if(Math.round(vector.x*10)>30){
			alert('Crashed!');
			vector.x=0;
			vector.y=0;
		}
		else{
			x=770;
			vector.x*=-0.3;
		}
	}

	//detect platform 1
	if((y>250 && y<251)&&(x>320&&x<330)){
		if(Math.round(vector.y*10)<-10){
			alert('Crashed!');
			vector.x=0;
			vector.y=0;
		}
		else{
			y=250;
			x=325;
			rotation=0;

			//bounce
			vector.y=0;
			vector.x=0;
		}
	}
}

//draw on the canvas
function drawScene(){
	ctx.clearRect(0, 0, 1000, 640);
	drawHUD();
	drawSpaceShip();
	drawPlatforms();

	//draw the thruster flames
	if(up){
		drawFlame();
	}
	if(left){
		drawRightFlame();
	}
	if(right){
		drawLeftFlame();
	}

	drawVector();
}

function drawStars(){
	ctx.beginPath();
	ctx.arc(starX,starY,10,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle="#fff";
	ctx.strokeStyle="#fff";
	ctx.closePath();
}

function drawPlatforms(){
	//platform 1
	ctx.beginPath();
	ctx.moveTo(290, 300);
	ctx.lineTo(360, 300);
	ctx.strokeStyle="#fff";
	ctx.stroke();
	ctx.closePath();
}

//draw the spaceship
function drawSpaceShip(){
	ctx.save();
	ctx.translate(x, y);

	ctx.rotate(rotation);

	//draw spaceship
	ctx.beginPath();
	ctx.moveTo(0, -60);ctx.bezierCurveTo(-20, -20, -20, 20, -10, 30);ctx.lineTo(10, 30);ctx.bezierCurveTo(20, 20, 20, -20, 0, -60);
	ctx.strokeStyle="#ccc";
	ctx.fillStyle="#fff";
	ctx.stroke();
	ctx.fill();
	ctx.closePath();

	//draw window
	if(Math.round(vector.y*10)>=-15){
		ctx.beginPath();
		ctx.arc(0,-5,10,0,2*Math.PI);
		ctx.strokeStyle="#ccc";
		ctx.fillStyle="#ff0";
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}
	else if(Math.round(vector.y*10)<-15){
		ctx.beginPath();
		ctx.arc(0,-5,10,0,2*Math.PI);
		ctx.strokeStyle="#cc";
		ctx.fillStyle="#f22";
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}

	//draw side fins
	ctx.beginPath();
	ctx.moveTo(10, 30);ctx.bezierCurveTo(20, 30, 30, 50, 30, 49);ctx.bezierCurveTo(35, 40, 25, 20, 17, 10);
	ctx.moveTo(-10, 30);ctx.bezierCurveTo(-20, 30, -30, 50, -30, 49);ctx.bezierCurveTo(-35, 40, -25, 20, -17, 10);
	ctx.strokeStyle="#c00";
	ctx.fillStyle="#f00";
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

function drawFlame(){
	//draw main thruster outer flame
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);

	ctx.beginPath();
	ctx.moveTo(-10, 40);ctx.bezierCurveTo(-12, 50, -8, 90, 0, 100);ctx.bezierCurveTo(8, 90, 12, 50, 10, 40);ctx.lineTo(-10, 40);
	ctx.strokeStyle="#f00";
	ctx.fillStyle="#f00";
	ctx.stroke();
	ctx.fill();
	ctx.closePath();

	//draw main thruster inner flame
	ctx.beginPath();
	ctx.moveTo(-5, 45);ctx.bezierCurveTo(-7, 45, -5, 70, 0, 90);ctx.bezierCurveTo(7, 70, 5, 45, 5, 45);ctx.lineTo(-5, 45);
	ctx.strokeStyle="#ff0";
	ctx.fillStyle="#ff0";
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	ctx.restore();	
}

function drawRightFlame(){
	//draw right thruster outer flame
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);

	ctx.beginPath();
	ctx.moveTo(20, -20);ctx.lineTo(20, -30);ctx.bezierCurveTo(30, -30, 40, -28, 50, -25);ctx.bezierCurveTo(40, -22, 30, -20, 20, -20);
	ctx.strokeStyle="#f00";
	ctx.fillStyle="#f00";
	ctx.stroke();
	ctx.fill();
	ctx.closePath();

	//draw right thruster inner flame
	ctx.beginPath();
	ctx.moveTo(23, -23);ctx.lineTo(23, -27);ctx.bezierCurveTo(30, -27, 40, -25, 43, -25);ctx.bezierCurveTo(40, -25, 30, -23, 23, -23);
	ctx.strokeStyle="#ff0";
	ctx.fillStyle="#ff0";
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

function drawLeftFlame(){
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);

	//draw left thruster outer flame
	ctx.beginPath();
	ctx.moveTo(-20, -20);ctx.lineTo(-20, -30);ctx.bezierCurveTo(-30, -30, -40, -28, -50, -25);ctx.bezierCurveTo(-40, -22, -30, -20, -20, -20);
	ctx.strokeStyle="#f00";
	ctx.fillStyle="#f00";
	ctx.stroke();
	ctx.fill();
	ctx.closePath();

	//draw left thruster inner flame
	ctx.beginPath();
	ctx.moveTo(-23, -23);ctx.lineTo(-23, -27);ctx.bezierCurveTo(-30, -27, -40, -25, -43, -25);ctx.bezierCurveTo(-40, -25, -30, -23, -23, -23);
	ctx.strokeStyle="#ff0";
	ctx.fillStyle="#ff0";
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

function drawVector(){
	ctx.save();
	ctx.translate(x,y);
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo((vector.x*50),(-vector.y*50));
	ctx.strokeStyle="#0b0";
	ctx.lineWidth=2;
	ctx.stroke();
	//show velocity
	ctx.fillText("Velocity: "+velocity+" m/s",vector.x*50,-vector.y*50);
	//show current angle
	if(angle==0){
		ctx.fillText("Rotation: "+Math.abs(angle)+"°",vector.x*50,-vector.y*50+12);
	}

	
	else if(angle!=0){

		if(angle>0){
			if(angle<=180){
				ctx.fillText("Rotation: "+Math.abs(angle)+">°",vector.x*50,-vector.y*50+12);
			}

			else if(angle>180){
				ctx.fillText("Rotation: <"+Math.abs(angle-360)+"°",vector.x*50,-vector.y*50+12);
			}
		}

		else if(angle<-0){
			if(angle>=-180){
				ctx.fillText("Rotation: <"+Math.abs(angle)+"°",vector.x*50,-vector.y*50+12);
			}

			else if(angle<-180){
				ctx.fillText("Rotation: "+Math.abs(angle+360)+">°",vector.x*50,-vector.y*50+12);
			}
		}
	}
	ctx.closePath();
	ctx.restore();
}

function drawHUD(){
	ctx.beginPath();
 	ctx.rect(800,0,200,640);
 	ctx.fillStyle="#fff";
 	ctx.fill();
 	ctx.closePath();

 	//HUD
	velocity = Math.round(Math.abs(Math.sqrt(Math.pow(vector.x,2)+Math.pow(vector.y,2)))*10);
	vSpeed=Math.round(Math.abs(vector.y)*10);
	hSpeed=Math.round(Math.abs(vector.x)*10);
	angle=Math.round(rotation*180/Math.PI)%360;
	x=x;

	if(Math.round(vector.y*10)>=-15){

		//show vertical speed
		ctx.beginPath();
		ctx.fillStyle="#0b0";
		ctx.font = "15px lcd";
		ctx.fillText("Vertical speed: "+vSpeed+" m/s",820,40);
		ctx.closePath();

		//check landing safety for platform 1
		if((y>200 && y<251)&&(x>300&&x<350)){
			if(x<320 || x>330){
				if(x<320){
					ctx.beginPath();
					ctx.fillStyle="#f00";
					ctx.font = "15px lcd";

					ctx.save();
					ctx.translate(x, y);
					ctx.fillText(">",30,0);
					ctx.restore();

					ctx.closePath();
				}
				else if(x>330){
					ctx.beginPath();
					ctx.fillStyle="#f00";
					ctx.font = "15px lcd";

					ctx.save();
					ctx.translate(x, y);
					ctx.fillText("<",-30,0);
					ctx.restore();

					ctx.closePath();
				}
			}
			else if(x>320 && x<330 && y<248){
				ctx.beginPath();
				ctx.fillStyle="#0b0";
				ctx.font = "15px lcd";

				ctx.save();
				ctx.translate(x,y);
				ctx.fillText("OK",30,0);
				ctx.restore();

				ctx.closePath();
			}
		}
	}

	//check if you're going down too fast
	else if(Math.round(vector.y*10)<-15){
		ctx.beginPath();
		ctx.fillStyle="#f00";
		ctx.font = "15px lcd";

		ctx.save();
		ctx.translate(x, y);
		ctx.fillText("Slow down!",60,0);
		ctx.restore();

		ctx.fillText("Vertical speed: "+vSpeed+" m/s",820,40);
		ctx.closePath();	
	}

	ctx.fillStyle="#0b0";
	ctx.font = "15px lcd";
	//show horizontal speed
	ctx.fillText("Horizontal speed: "+hSpeed+" m/s",820,55);
	
	ctx.fillText("Height: "+Math.round(Math.abs(y-590)),820,100);
	ctx.fillText("x(debugging): "+Math.round(x),820,115);	
	ctx.fillText("y(debugging): "+Math.round(y),820,130);
}