document.addEventListener("DOMContentLoaded", () => {
    injectCardCSS();
    loadCards();
    fetch_user_cards();
    handleSearch();
    
});

function loadCards(){
    document.querySelector(".cardsComponent").innerHTML = `
        <div class="container text-center">
            <div class="row">
                <div class="col">
                    <form class="d-flex gap-2 my-2">
                    <input
                        id="search_cards"
                        class="form-control"
                        type="search"
                        placeholder="Search Card"
                        aria-label="Search"
                    />
                    </form>

                    <div class="container text-center">
                        <div class="show_userCards row row-cols-5 gx-4 gy-4">
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    `;
    
    cards_placeholder = document.querySelector(".show_userCards");
    for(let i = 0 ; i < 15 ; i++){
        cards_placeholder.innerHTML +=`
            <div class="col">
                <div class="card_holder m-2">
                    <span class="placeholder_card placeholder col-12 "></span>
                </div>
            </div>
        `
    }

}

let allUserCards = []; // שמור את כל הקלפים כאן

async function fetch_user_cards() {
  const token = localStorage.getItem("token");
  if (!token) {
    openLoginModal();
    return;
  }

  const username = getUsernameFromToken();
  const user_id = await getid(username);

  if (!user_id) {
    console.error("User ID not found");
    return;
  }

    try {
      
    const res = await fetch(`${serverNet}/user/cards/${user_id}`, {
      headers: {
        Authorization: token,
      },
    });

    const data = await res.json();
    allUserCards = data; // שומר את כל הקלפים
    renderUserCards(allUserCards);
  } catch (error) {
    console.error("Failed to fetch user cards:", error);
  }
}

function renderUserCards(cards) {
  const user = document.querySelector(".show_userCards");
  user.innerHTML = "";

  cards.forEach(card => {
    const colWrapper = document.createElement("div");
    colWrapper.className = "col";

    const cardElement = document.createElement("div");
    cardElement.className = `card_holder card rare_${card.color_id} p-2`;
    cardElement.dataset.cardid = card.cardid;

    cardElement.innerHTML = `
            <section>
            <div class="container text-center xs" Style="position: absolute; bottom: 0px; z-index: 3;">
                <div class="row justify-content-center">
                    <div class="col">
                        <h1 class="card_name">${card.name}</h1>
                    </div>
                </div>
            </div>

                <p class="card_quantity rounded-pill text-bg-light">${card.quantity}X</p>
                <img src="${card.image_url}" alt="${card.name}" class="img-fluid" style="margin:10px; height:280px; border-radius: 5px;"/>
            </section>
        `;

    colWrapper.appendChild(cardElement);
    user.appendChild(colWrapper);
  });
}

function getUsernameFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = token.split('.')[1];
        const decoded = atob(payload);
        const parsed = JSON.parse(decoded);
        return parsed.username || null;
    } catch (err) {
        console.error("Failed to decode token:", err);
        return null;
    }
}

async function getid(string) {
    try {
        const res = await fetch(`${serverNet}/user/search/${string}`);
        const data = await res.json();
        console.log("userid:", data);
        return data;
    } catch (err) {
        console.error("Error fetching user ID:", err);
        return null;
    }
}

function handleSearch(){
    document.addEventListener('input', (e) => {
          if (e.target && e.target.id === "search_cards") {
          const searchText = e.target.value.toLowerCase().trim();
          const filtered = allUserCards.filter(card =>
              card.name.toLowerCase().includes(searchText)
          );
          renderUserCards(filtered);
          }
      });
}

function injectCardCSS() {
  const style = document.createElement("style");
  style.textContent = `
    .card_holder {
      height: 300px;
      border: none;
    }
  `;
  document.head.appendChild(style);
}