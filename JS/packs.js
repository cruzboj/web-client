let allitems = [];

fetch('http://localhost:8081/cards')
  .then(response => response.json())
  .then(data => {
    allitems = data;
    renderCards(data); // <<< להוסיף קריאה כאן
  })
  .catch(error => {
    console.error("Error loading JSON:", error);
    document.getElementById("errorContainer").textContent = "Failed to load items. Please try again later";
  });

  function renderCards(cardsData) {
    const cardsContainers = document.querySelectorAll(".cards");
  
    cardsContainers.forEach((container) => {
      container.innerHTML = "";  // מנקה תוכן קודם (מונע שכפול)
  
      cardsData.forEach((item, index) => {
        const cardBorder = document.createElement("section");
        cardBorder.className = "card-border";
        if (index === 0) {
          cardBorder.classList.add("special");
        } else {
          cardBorder.style.backgroundColor = "yellow"; // או כל צבע שתרצה
        }
        
        const card = document.createElement("section");
        card.className = "card";
  
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;
  
        const title = document.createElement("h1");
        title.textContent = item.name;
  
        card.appendChild(img);
        card.appendChild(title);
        cardBorder.appendChild(card);
        container.appendChild(cardBorder);
  
        cardBorder.style.cursor = "pointer";
        cardBorder.addEventListener("click", () => {
          cardBorder.style.transition = "transform 1s ease, opacity 1s ease";
          cardBorder.style.transform = "translateY(-200vh) scale(1.2)";
          cardBorder.style.opacity = "0";
  
          setTimeout(() => {
            cardBorder.style.display = "none";
          }, 500);
        });
      });

    });
  }
  
document.addEventListener("DOMContentLoaded", () => {
  // css styles for the packs section
  const style = document.createElement("style");
  style.innerHTML = `
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      height: 100%;
    }

    #wrapper {
      position: absolute;
      width: 1920px;
      height: 1080px;
      top: 50%;
      left: 50%;
      transform-origin: center center;
      transform: translate(-50%, -50%);
    }

    .packs-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      gap: 30px;
    }

    .pack {
      width: 300px;
      height: 600px;
      perspective: 1000px;
    }

    .pack-inner {
      width: 100%;
      height: 100%;
      /* background-color: rgb(255, 124, 124); */
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
      transform-style: preserve-3d;
    }

    .pack-header {
      height: 100px;
      background-image: url('image/Pack-Header.png');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: bottom center;
      /* background-color: blue; */
    }
    @keyframes tearTop {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 1;
            }
            30% {
                transform: translate(-10px, -10px) rotate(-5deg);
                opacity: 0.9;
            }
            60% {
                transform: translate(-30px, -30px) rotate(-15deg);
                opacity: 0.6;
            }
            100% {
                transform: translate(-100px, -100px) rotate(-25deg);
                opacity: 0;
            }
        }

    .tear-top {
        animation: tearTop 0.8s ease-in forwards;
    }

    .pack-body {
      flex: 1;
      /* background-color: rgb(234, 0, 255); */
      background-image: url('image/Pack-Body.png');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: top center;
    }

    @keyframes fadeout {
      0% {
        opacity: 1;
        transform: translateY(0);
      }
      100% {
        transform: translateY(200px);
        opacity: 0;
      }
    }

    .fadeout {
      animation: fadeout 1s forwards ease-in;
    }

    @keyframes fadeOutShrink {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.8);
        }
    }

    .hide-with-animation {
        animation: fadeOutShrink 0.5s forwards;
    }

    .cards {
      margin-left: 27px;
      
      /* background-color: rgb(255, 230, 0); */
      height: 400px;
      width: 250px;
      position: center;
      transform: translateY(-120%);
      z-index: -1;
      transition: transform 0.5s ease, z-index 0.5s ease;
      position: relative;
      object-fit:cover;
    }

    .cards.show {
      transform: translateY(-150%);
    }

    .card{
      /* background-image: url('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2N3d2NsYm4zMnNsbmxxZGlleGJlZGlsazgxNGFvbXlrcW1raTVncCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LM2Bl3ucXVmCc/giphy.gif'); */
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;

      background-color: #ffffff;
      position: absolute;
      height: 380px;
      width: 233px;
      border-radius: 5px;
      margin: 5px;

      transition: transform 0.3s ease;
      transform-style: preserve-3d;
      will-change: transform;
      overflow: hidden;
    }

    .card img{
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card h1{
      position: absolute;
      z-index: 2;
      margin: 0;
      color: rgb(255, 255, 255);
      font-size: 2rem;
      text-shadow:
        -2px -2px 0 black,
        2px -2px 0 black,
        -2px  2px 0 black,
        2px  2px 0 black;
    }

    @property --angle{
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }

    .card-border {
      position: absolute;
      height: 100%;
      width: 100%;
      padding: 3px;
      z-index: -1;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      border-radius: 5px;
      background-color: yellow;
    }
    .card-border::after , .card-border::before{
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      z-index: -1;
      padding: 3px;
      border-radius: 5px;
      /*background-image: conic-gradient(from var(--angle), #ff4545,#00ff99,#006aff,#ff0095,#ff4545);*/
      animation: 3s spin linear infinite;

      perspective: 1000px;
      transform-style: preserve-3d;
    }
    .card-border.special::before, .card-border.special::after {
      background-image: conic-gradient(from var(--angle), #ff4545, #00ff99, #006aff, #ff0095, #ff4545);
    }
    /* glowing effect */
    .card-border::before{
      filter:  blur(1.5rem);
      opacity: 0.5;
    }

    @keyframes spin{
      from{
        --angle: 0deg;
      }
      to{
        --angle: 360deg;
      }
    }
  `;
  document.head.appendChild(style);

  // <section  class="packs"> is expected to be present in the HTML
  const packsContainer = document.querySelector(".packs");
  if (!packsContainer) return;
  

  packsContainer.innerHTML = `
    <section id="wrapper">
          <section class="packs-container">
            ${[1, 2, 3].map(() => `
              <section class="pack">
                <section class="pack-inner">
                  <section class="pack-header"></section>
                  <section class="pack-body"></section>
                </section>
                <section class="cards"></section>
              </section>
            `).join('')}
          </section>
        </section>
      `;
  document.body.appendChild(packsContainer);

  // size the warper to fit the screen size
  function scaleToFit() {
    const wrapper = document.getElementById("wrapper"); 
    if (!wrapper) return;
    
    const scaleX = window.innerWidth / 1920;
    const scaleY = window.innerHeight / 1080;
    const scale = Math.min(scaleX, scaleY);
    
    wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  window.addEventListener("resize", scaleToFit);
  scaleToFit();

  // open packs with animation
  let packChoose = null;
  const packs = document.querySelectorAll(".pack");

  packs.forEach((pack) => {
    let wasChosen = false;
    let wasOpened = false;

    pack.addEventListener("click", () => {
      if (!packChoose) {
        packChoose = pack;
        wasChosen = true;

        packs.forEach((otherPack) => {
          if (otherPack !== packChoose) {
            otherPack.classList.add("hide-with-animation");
            otherPack.addEventListener(
              "animationend",
              () => {
                otherPack.style.display = "none";
              },
              { once: true }
            );
          }
        });

        return;
      }

      if (pack === packChoose && wasChosen && !wasOpened) {
        wasOpened = true;

        const header = pack.querySelector(".pack-header");

        header.classList.remove("tear-top");
        void header.offsetWidth;
        header.classList.add("tear-top");

        header.addEventListener(
          "animationend",
          () => {
            const body = pack.querySelector(".pack-body");

            setTimeout(() => {
              body.classList.add("fadeout");
            }, 1000);

            const cards = pack.querySelector(".cards");
            //show cards
            cards.classList.add("show");
            setTimeout(() => {
              cards.style.zIndex = "5";
            }, 2000);
          },
          { once: true }
        );
      }
    });
  });

  // 3d effect on hover
  document.querySelectorAll(".pack").forEach((pack) => {
    const inner = pack.querySelector(".pack-inner");

    pack.addEventListener("mousemove", (e) => {
      const rect = pack.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    pack.addEventListener("mouseleave", () => {
      inner.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  });

  document.querySelectorAll(".card-border").forEach(card => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {

      card.style.transition = "transform 1s ease, opacity 1s ease";
      card.style.transform = "translateY(-200vh) scale(1.2)";
      card.style.opacity = "0";

      setTimeout(() => {
        card.style.display = "none";
      }, 500);
    });
  });
});
