var frameNumber = 0;
var heart = [];
var heartCount;
let particles = [];

// found via (https://codepen.io/Kourga/pen/EoaKqQ)and adapted from an ellipse to a heart
class Particle {

  constructor(x, y, r) {
    // set center of explosion to center of notecard
    this.pos = createVector(150, 125);

    // set X and Y quadrants for vector direction so explosion grows in direction of mouse
    var quadX1;
    var quadY1;
    var quadX2;
    var quadY2;

    // for quad 1&4
    if ((mouseX < 150 && mouseY < 150) || (mouseX > 150 && mouseY > 150)){
      quadX1=mouseX-150;
      quadY1=150-mouseY;
      quadX2= 150-mouseX;
      quadY2= mouseY-150;

    // for quad 2&3
    } else if ((mouseX < 150 && mouseY > 150)||(mouseX > 150 && mouseY < 150)){
      quadX1=mouseX-150;
      quadY1=mouseY-150;
      quadX2=mouseX-150;
      quadY2=mouseY-150;
    }

    // have explosion spread out the further away the curosr is from center of notecard
    this.vel = createVector(random(quadX1, quadY1), random(quadX2, quadY2));
    this.acc = createVector(0, 0);
    this.r = r ? r : 50;
    this.halfr = r / 2;
  }

  update() { //have hearts move at different speeds
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  display() { //show hearts
    noStroke();
    fill(255, 0, 0, Math.random()*255);
    heartDraw(this.pos.x, this.pos.y, this.r); //changed from ellipse
  }

  edges() { //makes bounds for heart explosion
    if (this.pos.y > (height - this.halfr)) {
      this.vel.y *= -1;
      this.pos.y = (height - this.halfr);
    }

    if (this.pos.y < 0 + this.halfr) {
      this.vel.y *= -1;
      this.pos.y = 0 + this.halfr;
    }

    if (this.pos.x > (width - this.halfr)) {
      this.vel.x *= -1;
      this.pos.x = (width - this.halfr);
    }

    if (this.pos.x < this.halfr) {
      this.vel.x /= -1;
      this.pos.x = this.halfr;
    }
  }

}

//heart (found via https://editor.p5js.org/Mithru/sketches/Hk1N1mMQg)
function heartDraw(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

function heartExplosion() {
  //heart explosion

  // var gravity = createVector(0, 0.05);
  // var wind = createVector(0.1, 0);

  if (particles.length > 0) {
    // translate(150,150);
    for (var i = 0; i < particles.length/10; i++) {
      particles[i].update();
      particles[i].display();
    }
  }

  var i = 0;
  setInterval(function() {
    if (i <= 100) {
      // have cursor move center of heart explosion within the bounds of the notecard
      let notecardBoundsX = mouseX;
      if (notecardBoundsX < 50){
        notecardBoundsX = 50;
      } else if (notecardBoundsX > 250){
        notecardBoundsX = 250;
      }

      let notecardBoundsY = mouseY;
      if (notecardBoundsY < 50){
        notecardBoundsY = 50;
      } else if (notecardBoundsY > 200) {
        notecardBoundsY = 200;
      }

      // make new particles of random sizes
      particles[i] = new Particle(notecardBoundsX, notecardBoundsY, random(3, 25));
      i++;
    }
  }, 15);
}

function envelope() { // Determines if the envelope is displayed opened or closed
  if (keyCode == UP_ARROW) {
    frameNumber = 0;
    fill(255, 182, 193);
    triangle(50, 100, 150, 25, 250, 100); //top envelope flap

    //notecard
    fill(255);
    rect(50, 50, 200, 150);
    textFont('Georgia'); // notecard text
    textSize(25);
    noStroke();
    fill(255, 0, 0);
    text("Sending Love", 75, 100);

    //envelope
    stroke(0);
    fill(255, 182, 193); //envelope fill
    triangle(50, 100, 150, 160, 50, 250); //left triangle
    triangle(250, 100, 150, 160, 250, 250); //right triangle
    quad(50, 250, 130, 150, 170, 150, 250, 250); //bottom quad

    heartExplosion();

  } else {
    textFont('Georgia');
    textSize(16);
    text("Open Me with the Up Arrow!", 50, 75);
    triangle(50, 250, 150, 137.5, 250, 250); //bottom triangle
    triangle(50, 100, 150, 175, 250, 100); //top triangle
  }
}



function setup() {
  let canvas = createCanvas(300, 300);
  canvas.parent('sketch-container');
  canvas.mouseClicked(envelope);

}

function draw() {
  loadImage('background.jpeg', img => { // add background image
    image(img, 0, 0);
  });
  rect(50, 100, 200, 150); // envelope base
  stroke(0);
  fill(mouseX, 135, mouseY); // envelope color

  envelope();
  frameNumber++;
}
