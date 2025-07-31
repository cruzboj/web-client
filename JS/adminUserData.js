let data;
const token = localStorage.getItem("token");
let errorContainer;
let allCards;

addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userID = urlParams.get("userid");
  const token = localStorage.getItem("token");
  errorContainer = document.querySelector(".error-container");
  injectCardCSS();
  loadCards();
  handleSearch();
  fetchAllCards();

  fetch(serverNet + `/user/searchID/${userID}`, {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((userDetails) => {
      data = userDetails;
      showData(data);
    });
});

async function showData(userData) {
  const html = `
            <tr>
            <th style="border-style:none;">${userData.id}</th>
            <td style="border-style:none;">${userData.username}</td>
            <td style="border-style:none;">${userData.password}</td>
            <td style="border-style:none;">${userData.email}</td>
            <td style="border-style:none;">${userData.isadmin}</td>
            <td style="border-style:none;">${userData.coins}</td>
            </tr>
        `;
  tableBody.innerHTML = html;
  const user_id = userData.id;

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
    allUserCards.sort((a, b) => a.packid - b.packid);
    renderUserCards(allUserCards);
  } catch (error) {
    console.error("Failed to fetch user cards:", error);
  }
}

function loadCards() {
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
  for (let i = 0; i < 15; i++) {
    cards_placeholder.innerHTML += `
            <div class="col">
                <div class="card_holder m-2">
                    <span class="placeholder_card placeholder col-12 "></span>
                </div>
            </div>
        `;
  }
}

let allUserCards = []; // שמור את כל הקלפים כאן

function renderUserCards(cards) {
  const user = document.querySelector(".show_userCards");
  user.innerHTML = "";

  cards.forEach((card) => {
    const colWrapper = document.createElement("div");
    colWrapper.className = "col";

    const cardElement = document.createElement("div");
    cardElement.className = `card_holder card rare_${card.color_id} p-2`;
    cardElement.dataset.cardid = card.cardid;
    cardElement.style.cursor = "pointer";

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
    cardElement.addEventListener("click", () => {
      if (confirm(`Delete ${card.name} from ${data.username}`)) {
        deleteCardFromUser(card.cardid);
      }
    });

    colWrapper.appendChild(cardElement);
    user.appendChild(colWrapper);
  });
}

function handleSearch() {
  document.addEventListener("input", (e) => {
    if (e.target && e.target.id === "search_cards") {
      const searchText = e.target.value.toLowerCase().trim();
      const filtered = allUserCards.filter((card) =>
        card.name.toLowerCase().includes(searchText)
      );
      renderUserCards(filtered);
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target && e.target.id === "search_new_cards") {
      const searchText = e.target.value.toLowerCase().trim();
      const filtered = allCards.filter((card) =>
        card.name.toLowerCase().includes(searchText)
      );
      loadAllCards(filtered);
    }
  });
}

function injectCardCSS() {
  const style = document.createElement("style");
  style.textContent = `
    .card_holder {
      height: 300px;
      border: none;
      width:100%;
    }
  `;
  document.head.appendChild(style);
}

function deleteCardFromUser(cardID) {
  fetch(serverNet + "/user/cards/remove", {
    method: "PATCH",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userid: data.id,
      cardid: cardID,
    }),
  }).then((response) => {
    if (response.ok) {
      errorContainer.innerHTML = `<div class="bg-success text-white px-3 py-2 d-inline-block rounded"> 
            Card Deleted Succesfully
            </div>`;
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      errorContainer.innerHTML = `<div class="bg-danger text-white px-3 py-2 d-inline-block rounded"> 
            Error Deleting Card
            </div>`;
    }
  });
}

async function fetchAllCards() {
  const response = await fetch(serverNet + "/cards");
  allCards = await response.json();
  document.querySelector(".newCardsContainer").innerHTML = `
        <div class="container text-center">
            <div class="row">
                <div class="col">
                    <form class="d-flex gap-2 my-2">
                    <input
                        id="search_new_cards"
                        class="form-control"
                        type="search"
                        placeholder="Search Card"
                        aria-label="Search"
                    />
                    </form>

                    <div class="container text-center">
                        <div class="show_newCards row row-cols-5 gx-4 gy-4">
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    `;
  cards_placeholder = document.querySelector(".show_newCards");
  for (let i = 0; i < 15; i++) {
    cards_placeholder.innerHTML += `
            <div class="col">
                <div class="card_holder m-2">
                    <span class="placeholder_card placeholder col-12 "></span>
                </div>
            </div>
        `;
  }
        setTimeout(() => {
        loadAllCards(allCards);
      }, 2000);
}

function loadAllCards(cards) {
  cards.sort((a, b) => a.packid - b.packid);
  const user = document.querySelector(".show_newCards");
  user.innerHTML = "";

  cards.forEach((card) => {
    const colWrapper = document.createElement("div");
    colWrapper.className = "col";

    const cardElement = document.createElement("div");
    cardElement.className = `card_holder card rare_${card.color_id} p-2`;
    cardElement.dataset.cardid = card.id;
    // cardElement.style.cursor = "pointer";

    cardElement.innerHTML = `
            <section>
            <div class="container text-center xs" Style="position: absolute; bottom: 0px; z-index: 3;">
                <div class="row justify-content-center">
                    <div class="col">
                        <h1 class="card_name">${card.name}</h1>
                    </div>
                </div>
            </div>

                <p class="card_quantity rounded-pill text-bg-light">+1</p>
                <img src="${card.image_url}" alt="${
      card.name
    }" class="img-fluid" style="margin:10px; height:280px; border-radius: 5px;"/>
            </section>
        `;
    cardElement.addEventListener("click", () => {
      if (confirm(`Add ${card.name} to ${data.username}`)) {
        addCardToUser(card.id);
      }
    });

    colWrapper.appendChild(cardElement);
    user.appendChild(colWrapper);
  });
}

function addCardToUser(cardID) {
  fetch(serverNet + "/pack/insertCard", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cardid: cardID, userid: data.id }),
  }).then((response) => {
    if (!response.ok) {
      errorContainer.innerHTML = `<div class="bg-danger text-white px-3 py-2 d-inline-block rounded"> 
            Error Inserting card
            </div>`;
    } else {
      errorContainer.innerHTML = `<div class="bg-success text-white px-3 py-2 d-inline-block rounded"> 
            Card Added Succesfully
            </div>`;
      setTimeout(() => {
        window.location.reload();
      }, 0);
    }
  });
}
