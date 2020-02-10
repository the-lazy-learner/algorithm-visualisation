let values = [];

function setup() {
  for (let i = 1; i <= 10; i++) {
    values.push(Math.floor(random()*101))
  }
  createCanvas(640,480);
  document.write('<h1>'+values+'</h1>');
}

function draw() {
}