let canvas;
let ctx;
let circles = [];
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
    Start();
  });
  
function Start() {
    const main = document.querySelector("main");
    canvas = document.createElement("canvas");
    canvas.width = 360;
    canvas.height = 600;
    canvas.style.border = "1px solid black";
    canvas.style.position = "absolute";
    canvas.style.left = "50%";
    canvas.style.top = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
    main.appendChild(canvas);
  
    ctx = canvas.getContext("2d");
  
    canvas.addEventListener("click", OnClick);
  
    for (let i = 0; i < 1000; i++) {
      setTimeout(() => {
        createCircle();
      }, i * 500);
    }
  
    requestAnimationFrame(update);
  }
  
  function createCircle() {
    circles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 70,
    });
  }
  
  function update() {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    for (let i = 0; i < circles.length; i++) {
      const c = circles[i];
      if (c.r > 0) {
        c.r -= 0.5;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.fillStyle = "";
        ctx.fill();
      }
    }
  
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
  
    requestAnimationFrame(update);
  }
  
  function OnClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    for (let i = 0; i < circles.length; i++) {
      const c = circles[i];
      const dx = x - c.x;
      const dy = y - c.y;
      if (Math.sqrt(dx * dx + dy * dy) < c.r) {
        circles.splice(i, 1);
        score++;
        break;
      }
    }
  }
  