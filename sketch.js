var PLAY = 1;
var END = 0;
var gameState = PLAY;

var kangaroo, kangarunning, kangacollide;
var ground, invisibleGround, groundImage;

var badarooGroup, badaroo, badarooImg;

var score;

var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;
//var message;

function preload(){
  kangarunning = loadAnimation("kangaroo1.png", "kangaroo2.png");
  kangacollided = loadAnimation("kangaroo3.png");
  
  groundImage = loadImage("ground.png");
  
  badarooImg = loadImage("badaroo.png")
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  kangaroo = createSprite(50,height/2,20,50);
  kangaroo.addAnimation("running", kangarunning);
  kangaroo.scale = 0.5;
  
  ground = createSprite(200,height-70,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(350,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(350,140);
  restart.addImage(restartImg);
  restart.scale = 0.05
  
  gameOver.scale = 0.8;
  restart.scale = 0.8;
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  badarooGroup = createGroup();
  
 // console.log("Hello" + 5);
  
  kangaroo.setCollider("circle",0,0,50);
  //trex.debug = true
  
  score = 0;
  
}

function draw() {

  
  background(270);
  //console.log(message)
  //message = "from draw"

  //displaying score
  text("Score: "+ score, 500,50);
  
  //console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(6 + 2*score/100);
    //scoring
    score = score + Math.round(frameRate()/58);
  
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if((keyDown("space") || touches.length>0)&& kangaroo.y >= height-120) {
     kangaroo.velocityY = -13;
     jumpSound.play()
     touches = []
    }
    
    //add gravity
    kangaroo.velocityY = kangaroo.velocityY + 0.8
  
  
    //spawn obstacles on the ground
    spawnBadaroo()

    if (score % 100 ===  0 && score > 0){
     checkPointSound.play()
   }
    
    if(badarooGroup.isTouching(kangaroo)){
     gameState = END;
     dieSound.play()
    // trex.velocityY = -12
     jumpSound.play()
    }
  }
   else if (gameState === END) {
     //console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      kangaroo.velocityY = 0
      badarooGroup.setVelocityX = 0
     
      //change the trex animation
      kangaroo.changeAnimation("running", kangacollide);
     
      //set lifetime of the game objects so that they are never destroyed
      badarooGroup.setLifetimeEach(-1)
   }

   
  
 
  //stop trex from falling down
  kangaroo.collide(invisibleGround);
  if (mousePressedOver(restart)){
    console.log("restart game")
    reset()
  }
  
  
  
  drawSprites();
}

function reset(){
 gameState = PLAY
 badarooGroup.destroyEach();
 kangaroo.changeAnimation("running", kangarunning)
 score = 0
}

function spawnBadaroo(){
 if (frameCount % 120 === 0){
    var badaroo = createSprite(600,height-85,10,40);
    badaroo.velocityX = -(8 + score/100)
    badaroo.addImage(badarooImg)
   
    //assign scale and lifetime to the obstacle           
    badaroo.scale = 0.5;
    badaroo.lifetime = 300;
   
   //add each obstacle to the group
    badarooGroup.add(badaroo);
    badaroo.depth = kangaroo.depth
 }
}


