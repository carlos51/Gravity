var G = 1

class Planet {
  constructor(x , y, vx, vy, r, m, c){
    this.v = createVector(vx, vy)
    this.a = createVector()
    this.p = createVector(x, y)
    this.r = r
    this.m = m
    this.c = c


  }
  draw(){
    
    push()
   
    fill(this.c)
    circle(this.p.x, this.p.y, this.r*2)
    pop()
    
    //drawArrow(this.a, this.p, 'magenta', 1)
    drawArrow(this.p, this.a, 'blue', 1000)
    drawArrow(this.p, this.v, 'lime', 10)
  }
  
  velocidad(a){
    this.v = this.v.add(this.a)
    this.p = this.p.add(this.v)
    
  }
 
  wall(){
    if (this.p.x-this.r < 0){
        this.v.mult([-1,1])
    }
    if (this.p.x+this.r > 600){
      this.v.mult([-1,1])
    }
    if (this.p.y-this.r < 0){
      this.v.mult([1,-1])
    }
    if (this.p.y+this.r > 600){
      this.v.mult([1,-1])
    }

  }

}

function drawArrow(base, vec, myColor, esc) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  var escale = esc
  line(0, 0, vec.x*escale, vec.y*escale);
  rotate(vec.heading());
  let arrowSize = 2;
  translate(vec.mag()*esc - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function rotateV(velocity, angle) {
  let x = velocity.x * cos(angle) - velocity.y * sin(angle)
  let y = velocity.x * sin(angle) + velocity.y * cos(angle)
  var rotateVel = createVector(x ,y)
  return rotateVel
  
}

function collision(a, b) {
  const xVelocityDiff = a.v.x - b.v.x;
  const yVelocityDiff = a.v.y - b.v.y;

  const xDist = b.p.x - a.p.x;
  const yDist = b.p.y - a.p.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0){
    let va_cp = a.v.copy()
    let vb_cp = b.v.copy()
    let r = vb_cp.sub(va_cp)
    let an = atan(r.y/r.x)

    let ma = a.m
    let mb = b.m

    let ua = rotateV(a.v, an)
    let ub = rotateV(b.v, an)
    let va
    let vb
  
    if(ma == mb){
      va = createVector(ub.x*2*mb/(ma+mb), ua.y)
      vb = createVector(ua.x*2*ma/(ma+mb), ub.y)
    }
    else{
      let ua_cp = ua.copy()
      let ub_cp = ub.copy()
      
      ua_cp.mult(ma-mb)
      ub_cp.mult(ma-mb)

      va = p5.Vector.add(ua_cp, ub.mult(2*mb)).div(ma+mb)
      vb = p5.Vector.add(ua_cp, ua.mult(2*ma)).div(ma+mb)
    }
    
    
    a.v = rotateV(va, -an)
    b.v = rotateV(vb, -an)

  }

}

function atraction(a, b) {
    let vec_a = a.p.copy()
    let vec_b = b.p.copy()
    let r = vec_b.sub(vec_a)
    let an
    if (a.p.x < b.p.x){
      an = atan(r.y/r.x)
    }
    else {
      an = atan(r.y/r.x) + PI
    }

    let ac = (G*b.m)/(pow(r.x, 2) + pow(r.y, 2))

    a.a.x = ac * cos(an)
    a.a.y = ac * sin(an)

}
function hitBox(a, b){
  if((a.p.dist(b.p)) < (a.r + b.r)){
    return true
  }
  else return false 
}
function noOverlaping(amount, ri) {
  let x, y, r, vx ,vy
 
  let objs = []
  let currentElemet
  while (objs.length <= amount) {

    r = floor(random(10, 30))
    x = random(r , width-r)
    y = random(r, height-r)
    vx = random(5)
    vy = random(5)
    currentElemet = new Planet(x, y, 0, 0, ri, 300, 'gray') 
    let overlaping = false
    for (let index = 0; index < objs.length; index++) {
      const element = objs[index];
      if(hitBox(currentElemet, element)){
        overlaping = true
        break
      }
      
    }

    if(!overlaping){
      objs.push(currentElemet)
    }

  }
  return objs
}
function animation_balls(objs) {
  
  objs.forEach(j => {
    j.draw()
    j.velocidad(j.a)
    j.wall()

    objs.forEach(k => {
      if(j!=k){
        if(hitBox(j, k)){
          collision(j,k)
        }
        atraction(j, k)
      }
    });
  });
}
var objs = []
var base
var prueba
var angle
var r
var a 
var b
var nuevo
function setup() {
  
  createCanvas(600, 600);
  

  prueba = p5.Vector.fromAngle(PI*1.5, 50)
  base = createVector(100, 100)
  r = 0
  a = 0
  b = 2
  objs = noOverlaping(0, 30)

  

}
  
function draw() {
  background(220);
  
  animation_balls(objs)
  
  
    
  }