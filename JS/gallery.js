const style = document.createElement("style");
style.textContent = `


  body {
    margin: 0;
    background: #000;
  }
  .gallery {
    position: relative;
    width: 150px;
    height: 270px;
    transform-style: preserve-3d;
    animation: rotate 120s linear infinite;
  }
  @keyframes rotate {
    from {
      transform: perspective(1200px) rotateY(0deg);
    }
    to {
      transform: perspective(1200px) rotateY(360deg);
    }
  }
  .gallery span {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: center;
    transform-style: preserve-3d;
  }
  .card {
    background-color: transparent;
    border: none;
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 1s;
  }
  .card:hover {
    transform: rotateY(180deg);
  }
  .front, .back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
  }
  .front img, .back img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .back {
    transform: rotateY(180deg);
  }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
  showGallery();
});

function showGallery() {
  const gallery = document.querySelector(".gallery");

  const frontImages = [
    "./src/packfront.png",
    "./src/packfront.png",
    "./src/packfront.png",
    "./src/packfront.png",
    "./src/packfront.png",
    "./src/packfront.png",
    "./src/packfront.png",
    "./src/packfront.png",
    "./src/packfront.png",
    "./src/packfront.png",
  ];
  const backImages = [
    "./src/packback.png",
    "./src/packback.png",
    "./src/packback.png",
    "./src/packback.png",
    "./src/packback.png",
    "./src/packback.png",
    "./src/packback.png",
    "./src/packback.png",
    "./src/packback.png",
    "./src/packback.png",
  ];

  const total = frontImages.length;
  const degPerImage = 360 / total;
  const distance = 280;

  for (let i = 0; i < total; i++) {
    const span = document.createElement("span");
    span.style.transform = `rotateY(${degPerImage * i}deg) translateZ(${distance}px)`;

    const card = document.createElement("div");
    card.className = "card";

    const front = document.createElement("div");
    front.className = "front";
    const frontImg = document.createElement("img");
    frontImg.src = frontImages[i];
    front.appendChild(frontImg);

    const back = document.createElement("div");
    back.className = "back";
    const backImg = document.createElement("img");
    backImg.src = backImages[i];
    back.appendChild(backImg);

    card.appendChild(front);
    card.appendChild(back);
    span.appendChild(card);
    gallery.appendChild(span);
  }
}
