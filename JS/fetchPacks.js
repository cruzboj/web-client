const local = "http://localhost:8081";
const serverNet = local //for now its local

let packs = [];
let cards = [];

let packChoose = null;
let wasOpened = false;

document.addEventListener("DOMContentLoaded", () => {
// fetch the packs from the server
    fetch(serverNet +"/packs")
        .then(response => response.json())
        .then(data => {
            packs = data;
            createPacks(data);
        })
        .catch(error => {
            console.error("Error loading JSON:", error);
            document.getElementById("errorContainer").textContent = "Failed to load items. Please try again later";
        });
});
        
function createPacks(data){
    const packsContainer = document.querySelector(".packs");
    const wrapper = document.createElement("section");
    wrapper.id = "wrapper";

    const container = document.createElement("section");
    container.classList.add("packs-container");

    data.forEach((pack, index) => {
        // console.log(`Pack #${index + 1}:`);
        // console.log('Header Image:', pack.header);
        // console.log('Body Image:', pack.body);
        // console.log('Search Query:', pack.query);

        const packElement = document.createElement("section");
        packElement.classList.add("pack");

        //for card fetch
        packElement.packData = pack;

        packElement.innerHTML = `
            <section class="pack-inner">
                <section class="pack-header" style="background-image: url('${serverNet}/${pack.header}')"></section>
                <section class="pack-body" style="background-image: url('${serverNet}/${pack.body}')"></section>
            </section>
            <section class="cards">
                    <section class="card-border"></section>
                    
            </section>
        `;

        container.appendChild(packElement);
    });

    wrapper.appendChild(container);
    packsContainer.innerHTML = '';
    packsContainer.appendChild(wrapper);

    scaleToFit();
    
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

                //fetch for the pack cards
                const query = pack.packData.query.replace("&q=", ""); // "brainrot"

                fetch(serverNet + "/cards?q=" + encodeURIComponent(query))
                    .then((res) => res.json())
                    .then((cardsData) => {
                        console.log("Cards loaded:", cardsData);
                        const cardsContainer = pack.querySelector(".cards");
                        cardsContainer.innerHTML = ''; // נקה אם כבר היו קלפים קודם
                        cardsContainer.style.display = "flex"; // תראה את המיכל
                        
                        //add cards to html
                        cardsData.forEach((card) => {
                            const cardBorder = document.createElement("section");
                            cardBorder.classList.add("card-border");
                        
                            const cardElement = document.createElement("img");
                            cardElement.src = card.image;
                            cardElement.classList.add("card");
                        
                            cardBorder.appendChild(cardElement);
                            cardsContainer.appendChild(cardBorder);
                        
                            // קליק לעוף החוצה
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
                    })
                    .catch((err) => {
                        console.error("Failed to fetch cards:", err);
                    });
                
                //animation delete othere packs
                packs.forEach((otherPack) => {
                    if (otherPack !== packChoose) {
                        otherPack.classList.add("hide-with-animation");

                        otherPack.addEventListener("animationend", () => {
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

                header.addEventListener("animationend",() => {
                    const body = pack.querySelector(".pack-body");

                    setTimeout(() => {
                    body.classList.add("fadeout");
                    }, 1000);

                    //show cards
                    const cards = pack.querySelector(".cards");
                    
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
}

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


