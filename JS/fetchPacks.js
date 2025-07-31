const imagePath = "https://web-server-q7kx.onrender.com";

let packs = [];
let cards = [];
let cards_data = [];

let packChoose = null;
let wasOpened = false;

document.addEventListener("DOMContentLoaded", () => {
  createComponent();
  fetchPack();
  openPack();
});

function createComponent() {
    document.querySelector(".packComponent").innerHTML = `
        <div class="container text-center">
              <div class="pack_container row" style="margin-top: -100px">
                    <div class="pack_container_width col-md-8 mx-auto">
                      <audio id="tearSound" src="https://www.myinstants.com/media/sounds/sparklee.mp3" preload="auto"></audio>
                      <audio id="nextcard" src="https://www.myinstants.com/media/sounds/card-flip.mp3" preload="auto"></audio>
                      <audio id="rareSound" src="https://www.myinstants.com/media/sounds/undertale-sfx-rare-to-find.mp3" preload="auto"></audio>
                      
                      <section class="Packs">
                        
                      </section>
                    </div>
              </div>
        </div>
    `;

  let Load = `
    <div class="container text-center">
      <div class="row">

        <div class="pack1 col">
          <p class="placeholder-glow"><span class="packPlaceholder placeholder col-12"></span></p>
        </div>

        <div class="pack2 col">
          <p class="placeholder-glow"><span class="packPlaceholder placeholder col-12"></span></p>
        </div>

        <div class="pack3 col">
          <p class="placeholder-glow"><span class="packPlaceholder placeholder col-12"></span></p>
        </div>

      </div>

      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
  `;
  document.querySelector(".Packs").innerHTML = Load;
}

function fetchPack() {
  const packsElement = document.querySelector(".Packs");

  const row = document.createElement("section");
  row.className = "row";

  fetch(serverNet + '/user/packs')
    .then((res) => res.json())
    .then(data => {
      packs = data;

      packsElement.innerHTML = ""; 

      packs.forEach((packData, index) => {
        const col = document.createElement("section");
        col.className = `col pack${index + 1}`;

        const header = imagePath + `/image/Pack${packData.packid}-Header.png`;
        const body = imagePath + `/image/Pack${packData.packid}-Body.png`;

        const pack = `
          <section class="pack" data-packid="${packData.packid}">
            <section class="pack-inner" style="cursor: pointer;">
              <section class="pack-header" style="background-image: url('${header}');"></section>
              <section class="pack-body" style="background-image: url('${body}');"></section>
            </section>
            <section class="cards"></section> <!-- MOVE OUTSIDE pack-inner -->
          </section>
        `;

        col.innerHTML = pack;
        row.appendChild(col);
      });

      packsElement.appendChild(row);

      effect3d();
      openPack();
    })
    .catch(err => {
      console.error("Error fetching packs:", err);
      packsElement.innerHTML = `<p class="text-danger">error in loading packs</p>`;
    });
}

function effect3d(){
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
}

function openPack(){
  let wasChosen = false;
  const token = localStorage.getItem("token");

  const packs = document.querySelectorAll(".pack");

  packs.forEach((pack) => {
    pack.addEventListener("click", () => {
      
      //chcek if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
          openLoginModal();
          return;
      }
      
      //check if user have coins
      if(wasOpened === false && wasChosen === true){
        getUserInfo().then(data => {
          const user_coins = data.coins;
          if (user_coins < 12) {
            console.log("not enough coins");
            return;
          }
        });
      }
      

      if (!packChoose) {
        packChoose = pack;
        wasChosen = true;
        packChoose.classList.add("pack-chosen");
        const chosenCol = pack.closest("section.col");
        const allCols = document.querySelectorAll(".Packs .row > section.col");

        allCols.forEach((col) => {
          if (col !== chosenCol) {
            col.classList.add("hide-with-animation");

            col.addEventListener("animationend", () => {
              col.remove(); 
            }, { once: true });
          }
        });

        return;
      }

      if (pack === packChoose && wasChosen && !wasOpened) {
        wasOpened = true;

        fetch(serverNet + `/pack/getPack/${pack.dataset.packid}`, {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
          .then(res => res.json())
          .then(data => {
            cards_data = data.cards;

            createCards();
            playTearSound();
            nextcard(pack);

            const header = pack.querySelector(".pack-header");
            header.classList.add("tear-top");

            header.addEventListener("animationend", () => {
              const body = pack.querySelector(".pack-body");
              setTimeout(() => {
                body.classList.add("fadeout");
              }, 1000);
            }, { once: true });
          })
          .catch(err => {
            appendAlert("Error fetching cards:", "danger");
          });
      }
    });
    
  });
}

//sound effects
function playTearSound() {
    const audio = document.getElementById("tearSound");
    audio.volume = 0.1;
    audio.currentTime = 0;
    audio.play();
}

function playNextCardsound() {
    const audio = document.getElementById("nextcard");
    audio.volume = 0.2;
    audio.currentTime = 0;
    audio.play();

setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
    }, 500); 
}

function playRareSound() {
    const audio = document.getElementById("rareSound");
    audio.volume = 0.1;
    audio.currentTime = 0;
    audio.play();
}

function createCards() {
  try {
    const cards = document.querySelector(".cards");

    cards.innerHTML = "";
    cards_data.forEach(card => {
      const cardHtml = `
        <section class="card rare_${card.color_id}">
          <img src="${card.image_url}" alt="${card.name}">
        </section>
      `;
      cards.insertAdjacentHTML("beforeend", cardHtml);
    });
  } catch (err) {
    appendAlert("Error loading cards:");
    return false;
  }
}

function nextcard(pack) {
  let cards = Array.from(pack.querySelectorAll(".card"));

  pack.addEventListener("click", () => {

    if (cards.length === 1) {
      setTimeout(() => { 
        location.reload();
      }, 1500);
    }
    const card = cards.pop();

    card.classList.add("fly-up");
    
    if (card.classList.contains("rare_2")) {
      playRareSound();
    } else {
      playNextCardsound();
    }
      
    card.addEventListener("animationend", () => {
      card.remove();
    }, { once: true });
  });
}