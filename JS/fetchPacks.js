const imagePath = "https://web-server-q7kx.onrender.com";

let packs = [];
let cards = [];

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
      console.log("Packs from server:", data);
      packs = data;

      packsElement.innerHTML = ""; //delete after loading

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
      openPack(); // רק אחרי שהדף נטען
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
  // let packChoose = null;
  let wasChosen = false;
  // let wasOpened = false;
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
          console.log("user coins :" + user_coins);

          if (user_coins < 12) {
            console.log("not enough coins");
            return;
          }
          else {
            fetch(serverNet + `/pack/getPack/${pack.dataset.packid}`, {
              method: "GET",
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }
              
            )
          }
        })
      }
      

      if (!packChoose) {
        packChoose = pack;
        wasChosen = true;
        packChoose.classList.add("pack-chosen");

        //log
        const packId = pack.dataset.packid;
        console.log("pack chosen:", packId);

        // מציאת האלמנט של col שעוטף את ה-pack
        const chosenCol = pack.closest("section.col");
        // remove all col's
        const allCols = document.querySelectorAll(".Packs .row > section.col");

        allCols.forEach((col) => {
          if (col !== chosenCol) {
            col.classList.add("hide-with-animation");

            col.addEventListener("animationend", () => {
              col.remove(); //
              // col.style.visibility = "hidden";
              // col.style.pointerEvents = "none";


            }, { once: true });
          }
        });

        return;
      }

      // פתיחה בפועל (אם כבר בחרנו חבילה ולא פתחנו אותה עדיין)
      if (pack === packChoose && wasChosen && !wasOpened) {
        wasOpened = true;
        
        createCards(pack.dataset.packid).then(() => {
          playTearSound();
          nextcard(pack);
        });

        const header = pack.querySelector(".pack-header");
        header.classList.add("tear-top");

        header.addEventListener("animationend", () => {
          const body = pack.querySelector(".pack-body");

          setTimeout(() => {
          body.classList.add("fadeout");
          }, 1000);

        }, { once: true });
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

async function createCards(packId) {
  try {
    const res = await fetch(serverNet + `/user/packs/${packId}`);
    const data = await res.json();
    const cards = document.querySelector(".cards");  // זה ה-container שלך

    cards.innerHTML = ""; // מנקים קודם כל

    data.forEach(card => {  // forEach, לא foreach
      const cardHtml = `
        <section class="card rare_${card.color_id}">
          <img src="${card.image_url}" alt="${card.name}">
        </section>
      `;
      cards.insertAdjacentHTML("beforeend", cardHtml); // cards ולא cardsContainer
    });
  } catch (err) {
    console.error("Error loading cards:", err);
    return false;
  }
}

function nextcard(pack) {
  console.log("packid :" + pack.dataset.packid);
  // מציבים את כל הקלפים במערך (NodeList => Array)
  let cards = Array.from(pack.querySelectorAll(".card"));

  pack.addEventListener("click", () => {

    //reload page
    if (cards.length === 1) {
      setTimeout(() => { 
        location.reload();
      }, 1500);
    }
    const card = cards.pop(); // מוציאים קלף אחד מהסוף

    card.classList.add("fly-up");
    
    if (card.classList.contains("rare_2")) {
      playRareSound(); // קול של rare
    } else {
      playNextCardsound(); // קול רגיל
    }
      
    card.addEventListener("animationend", () => {
      card.remove();
    }, { once: true });
  });
}