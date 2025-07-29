document.addEventListener("DOMContentLoaded", () => {
    loadtrade(); //loading placeholder
    fetch_user_cards();
    // getid("admin");
});
function handleSearch(event) {
    event.preventDefault();
    const inputValue = document.getElementById('search_p2').value;
    console.log(inputValue);
    fetch_user2_cards(inputValue)
    // alert("חיפשת: " + inputValue);
    return false;
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
function loadtrade(){
    document.querySelector(".tradeComponent").innerHTML = `
        <div class="container-fluid text-center">
            <div class="row flex-nowrap align-items-stretch">
            <!-- USER -->
            <div class="trade col col-4">
                <form class="d-flex gap-2 my-2">
                <input
                    class="form-control"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                />
                <button class="btn btn-outline-success" type="submit">
                    Search
                </button>
                </form>
                <div class="container text-center">
                <div class="scrollable-cards">
                    <div
                    class="show_userCards row row-cols-1 row-cols-sm-5 row-cols-md-4 gy-2 gx-4"
                    >
                    <div class="card_holder col m-2">
                        <p class="placeholder-glow col-12">
                        <span class="placeholder_card placeholder col-12 "></span>
                        </p>
                    </div>
                    <div class="card_holder col m-2">
                        <p class="placeholder-glow col-12">
                        <span class="placeholder_card placeholder col-12 "></span>
                        </p>
                    </div>
                    <div class="card_holder col m-2">
                        <p class="placeholder-glow col-12">
                        <span class="placeholder_card placeholder col-12 "></span>
                        </p>
                    </div>
                    <div class="card_holder col m-2">
                        <p class="placeholder-glow col-12">
                        <span class="placeholder_card placeholder col-12 "></span>
                        </p>
                    </div>
                    <div class="card_holder col m-2">
                        <p class="placeholder-glow col-12">
                        <span class="placeholder_card placeholder col-12 "></span>
                        </p>
                    </div>
                    <div class="card_holder col m-2">
                        <p class="placeholder-glow col-12">
                        <span class="placeholder_card placeholder col-12 "></span>
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <!-- UI -->
            <div class="col col-4" style="background-color: #383838; border-radius: 10px;">
                <form>
                    <input type="hidden" name="username_p1" value="0" />
                    <input type="hidden" name="cardid_p1" value="0" />
                    <input type="hidden" name="username_p2" value="0" />
                    <input type="hidden" name="cardid_p2" value="0" />
                    <button type="button" class="btn btn-primary" style="margin-top:50px" onclick="handleTrade()">TRADE</button>   
                </form>
                <div class="container text-center" style="margin-top:70px">
                    <div class="row justify-content-between">
                        <div class="col col-5">
                            <p>you</p>
                                <div id="p1Area" class="card_holder col m-2">
                                <p class="placeholder-glow col-12">
                                <span class="placeholder_card placeholder col-12 "></span>
                                </p>
                            </div>
                        </div>
                            <div class="col col-5">
                                <p>Traded Player</p>
                                <div id="p2Area" class="card_holder col m-2">
                                <p class="placeholder-glow col-12">
                                <span class="placeholder_card placeholder col-12"></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- TRADE USER -->
                <div class="trade col col-4">
                    <form class="d-flex gap-2 my-2" onsubmit="return handleSearch(event)">
                    <input
                        id="search_p2"
                        class="form-control"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                    />
                    <button class="btn btn-outline-success" type="submit">
                        Search
                    </button>
                    </form>
                    <div class="container text-center">
                    <div class="scrollable-cards">
                        <div class="show_tradeCards row row-cols-1 row-cols-sm-5 row-cols-md-4 gy-2 gx-4">
                        <div class="card_holder col m-2">
                            <p class="placeholder-glow col-12">
                            <span class="placeholder_card placeholder col-12 "></span>
                            </p>
                        </div>
                        <div class="card_holder col m-2">
                            <p class="placeholder-glow col-12">
                            <span class="placeholder_card placeholder col-12 "></span>
                            </p>
                        </div>
                        <div class="card_holder col m-2">
                            <p class="placeholder-glow col-12">
                            <span class="placeholder_card placeholder col-12 "></span>
                            </p>
                        </div>
                        <div class="card_holder col m-2">
                            <p class="placeholder-glow col-12">
                            <span class="placeholder_card placeholder col-12 "></span>
                            </p>
                        </div>
                        <div class="card_holder col m-2">
                            <p class="placeholder-glow col-12">
                            <span class="placeholder_card placeholder col-12 "></span>
                            </p>
                        </div>
                        <div class="card_holder col m-2">
                            <p class="placeholder-glow col-12">
                            <span class="placeholder_card placeholder col-12 "></span>
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    `;
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

async function fetch_user_cards(){
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
        const res = await fetch(serverNet + `/user/cards/${user_id}`, {
            headers: {
            Authorization: token,
        },
    });
    const data = await res.json();
    console.log(data);
    
    const user = document.querySelector(".show_userCards");
    user.innerHTML = "";
        data.forEach(card => {
            const cardElement = document.createElement("section");
            cardElement.className = `card_holder col m-3 card rare_${card.color_id}`;
            cardElement.dataset.cardid = card.cardid;
            
            cardElement.innerHTML = `
                <section>
                    <h1 class="card_name">${card.name}</h1>
                    <p class="card_quantity rounded-pill text-bg-light">${card.quantity}X</p>
                    <img src="${card.image_url}" alt="${card.name}" class="img-fluid" style="margin:10px; height:110px; border-radius: 5px;"/>
                </section>
            `;
            // 👇 כאן הלחיצה
            cardElement.addEventListener("click", () => {
                addToP1(cardElement.cloneNode(true));
            });
            user.appendChild(cardElement);
            });
    } catch (error) {
        console.error("Failed to fetch user cards:", error);
    }
} 

async function addToP1(cardElement) {
    const p1Area = document.getElementById("p1Area");
    p1Area.innerHTML = ""; // מנקה קודם
    const clone = cardElement.cloneNode(true);
    clone.style.height = "300px";
    // מוסיף סטייל ישירות לתמונה שבתוך הקלון
    
    clone.querySelectorAll("h1, p").forEach(el => el.remove());
    const img = clone.querySelector("img");
    
    if (img) {
        img.style.margin = "10px";
        img.style.height = "280px";
        img.style.width = "89%";
        img.style.marginLeft = "3px";
        img.style.borderRadius = "5px";
    }
    p1Area.appendChild(clone);
    //write to form data
    const cardid = cardElement.dataset.cardid;
    const packid = cardElement.dataset.packid || 0;
    const username = getUsernameFromToken();
    const userId = await getid(username);
    document.querySelector('input[name="username_p1"]').value = userId;
    document.querySelector('input[name="cardid_p1"]').value = cardid;
}

async function fetch_user2_cards(string){
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }
    const user_id = await getid(string);
    if (!user_id) {
        console.error("User ID not found");
        return;
    }
    try {
        const res = await fetch(serverNet + `/user/cards/${user_id}`, {
            headers: {
            Authorization: token,
        },
    });
    const data = await res.json();
    console.log(data);
    
    const user = document.querySelector(".show_tradeCards");
    user.innerHTML = "";
        data.forEach(card => {
            const cardElement = document.createElement("section");
            cardElement.className = `card_holder col m-3 card rare_${card.color_id}`;
            cardElement.dataset.cardid = card.cardid;
            cardElement.innerHTML = `
                <section>
                    <h1 class="card_name">${card.name}</h1>
                    <p class="card_quantity rounded-pill text-bg-light">${card.quantity}X</p>
                    <img src="${card.image_url}" alt="${card.name}" class="img-fluid" style="margin:10px; height:110px; border-radius: 5px;"/>
                </section>
            `;
            // 👇 כאן הלחיצה
            cardElement.addEventListener("click", () => {
                addToP2(cardElement.cloneNode(true), string);
            });
            user.appendChild(cardElement);
            });
    } catch (error) {
        console.error("Failed to fetch user cards:", error);
    }
}

async function addToP2(cardElement, username) {
    const p2Area = document.getElementById("p2Area");
    p2Area.innerHTML = "";
    const clone = cardElement.cloneNode(true);
    clone.style.height = "300px";
    const img = clone.querySelector("img");
    clone.querySelectorAll("h1, p").forEach(el => el.remove());
    if (img) {
        img.style.margin = "10px";
        img.style.height = "280px";
        img.style.width = "89%";
        img.style.marginLeft = "3px";
        img.style.borderRadius = "5px";
    }
    p2Area.appendChild(clone);
    // עדכון הטופס
    const cardid = cardElement.dataset.cardid;
    const userId = await getid(username);
    const inputUser = document.querySelector('input[name="username_p2"]');
    const inputCard = document.querySelector('input[name="cardid_p2"]');
    if (inputUser && inputCard) {
        inputUser.value = userId;
        inputCard.value = cardid;
    } else {
        console.warn("inputs not found");
    }
}

function handleTrade() {
    const token = localStorage.getItem("token");

    const usernameP1 = document.querySelector('input[name="username_p1"]').value;
    const cardidP1 = document.querySelector('input[name="cardid_p1"]').value;
    const usernameP2 = document.querySelector('input[name="username_p2"]').value;
    const cardidP2 = document.querySelector('input[name="cardid_p2"]').value;
    if (
        usernameP1 === "0" ||
        cardidP1 === "0" ||
        usernameP2 === "0" ||
        cardidP2 === "0"
        )
    {
        appendAlert(`error missing parameters`, "danger");
    }
    else{
        appendAlert(`trade in prosses`, "info");
    }
    const tradeData = {
        username_p1: usernameP1,
        cardid_p1: parseInt(cardidP1),
        username_p2: usernameP2,
        cardid_p2: parseInt(cardidP2),
    };
    console.log("Sending trade data:", tradeData);

    fetch(serverNet + `/trade/create/`, {
        headers: {
            
            Authorization: token,
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            user1_id: usernameP1,
            user2_id: usernameP2,
            user1_card: cardidP1,
            user2_card: cardidP2,
        }),
        method : "POST"
    });
    // fetch(`${serverNet}/trade`, {
    //     method: "POST",
    //     headers: {
    //     "Content-Type": "application/json",
    //     Authorization: localStorage.getItem("token"),
    //     },
    //     body: JSON.stringify(tradeData),
    // })
    // .then(res => res.json())
    // .then(data => {
    //     console.log("Trade successful:", data);
    //     alert("Trade completed!");
    // })
    // .catch(err => {
    //     console.error("Trade failed:", err);
    //     alert("Error processing trade.");
    // });
}
