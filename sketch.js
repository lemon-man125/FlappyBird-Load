const imageLoad = false;
const DEFAULT_TIMESTEPS = 3;
const MAX_TIMESTEPS = 10;
const FIXED_TIMESTEPS = true;
const AUTO_SAVE = false;

let bird;
let player;

let timeSteps = 1;
let slider;
let counter = 0;
let pipes = [];
// Interface elements
let speedSlider;
let speedSpan;

// loading best-bird elements
let submitButton;

// Button to highlight the bestbird during training;

let spiritImage;
let treeImage;

let brain;

function preload() {
  if (imageLoad) {
    spiritImage = loadImage("./spirit.png");
    treeImage = loadImage("./tree.png");
  }
}

function setup() {
  createCanvas(600, 400).parent("canvas-wrapper");
  background(0, 165, 255);
  noLoop();
  tf.setBackend("cpu");
  angleMode(DEGREES);
  player = new Bird();
  submitButton = select("#submit");
  submitButton.mousePressed(async () => {
    if (brain != null) return;
    const fileButton = document.body.querySelector("#birdbrain");
    const text = await fileButton.files[0].text();
    brain = JSON.parse(text);
    const birdBrain = NeuroEvolution.load(brain);
    bird = new Bird();
    bird.brain = birdBrain.copy();
    bird.highlight = true;
    loop();
  });
  // Access the interface elements
  if (FIXED_TIMESTEPS) {
    speedSlider = createSlider(1, MAX_TIMESTEPS, 0.1);
  }
}

function keyPressed() {
  if (key == " ") {
    player.jump();
  }
}

function draw() {
  background(0);

  if (FIXED_TIMESTEPS) {
    timeSteps = speedSlider.value();
  }

  if (timeSteps > MAX_TIMESTEPS) {
    timeSteps = MAX_TIMESTEPS;
  }

  for (let n = 0; n < timeSteps; n++) {
    for (const pipe of pipes) {
      if (pipe.hits(bird)) {
        console.log("HIT");
      }
    }

    if (counter % 75 === 0) {
      pipes.push(new Pipe());
    }
    counter++;

    bird.update();
    bird.think(pipes);
    // bird.edges();

    //    player.update();

    for (pipe of pipes) {
      pipe.update();
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      if (pipes[i].offScreen()) {
        pipes.splice(i, 1);
      }
    }
  }

  for (const pipe of pipes) {
    pipe.show();
  }

  bird.show();
  //  player.show();

  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(bird.score, bird.pos.x, bird.pos.y - bird.r * 3);
}
