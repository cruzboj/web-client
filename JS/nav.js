const local = "http://localhost:8082";
const serverNet = "https://web-server-q7kx.onrender.com/api";

const socket = io("https://web-server-q7kx.onrender.com");
let tradeData;

socket.on("connect", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  socket.emit("token", token);
});
socket.on("trade_offer", (trade_details) => {
  tradeData = trade_details;
  tradeAlert(trade_details, "warning");
});
socket.on("trade_accepted", (msg) => {
  appendAlert(msg, "success");
  setTimeout(() => {
    location.reload();
  }, 3000);
});

let currentView = ""; //change nav from pc/moblie

document.addEventListener("DOMContentLoaded", () => {
  let navbar = loadHtml();

  updateNavbar(navbar);
  //needes to be at the end line (navbar resize update)
  window.addEventListener("resize", () => {
    updateNavbar(navbar);
  });

  const token = localStorage.getItem("token");
  const socketTest = document.querySelector("#testButton");
  if (!socketTest) {
    return;
  }
  socketTest.addEventListener("click", () => {
    fetch(serverNet + "/trade/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        user1_id: 1,
        user2_id: 1,
        user1_card: 5,
        user2_card: 3,
      }),
    });
  });
});

function handleLogout(e) {
  if (e.target && e.target.id === "logoutBtn") {
    onLogout();
    appendAlert("user logout", "info");
  }
}

//events
function setupDynamicListeners() {
  //register
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault(); 
      handleRegister();
    });
  }

  //login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleLogin();
    });
  }

  // //logout
  document.body.removeEventListener("click", handleLogoutClick);
  document.body.addEventListener("click", handleLogoutClick);
}

function handleLogoutClick(e) {
  if (e.target && e.target.id === "logoutBtn") {
    onLogout();
  }
}

async function getUserInfo() {
  const token = localStorage.getItem("token");
  if (!token) {
    username = "guest";
    coins = "0";
    return { username, coins };
  }
  try {
    const response = await fetch(serverNet + "/user", {
      headers: {
        Authorization: token,
      },
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    const username = data.username || "guest";
    const coins = data.coins || "0";
    const isadmin = data.isadmin;
    const email = data.email || "null";
    const password = data.password || "null";
    const id = data.id;
    return { id, username, email ,coins, isadmin , password };
  } catch (error) {
    return null;
  }
}

function loadProfile() {
  getUserInfo().then((data) => {
    const imgUser =
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740";

    if (data.username !== "guest") {
      if (currentView === "pc") {
        if (data.isadmin === false) {
          document.querySelector(".profile_container").innerHTML = `
                <section class="profile_container">
                <section class="profile">
                    <img src="${imgUser}" alt="Profile" class="rounded-circle mt-1 mx-auto" width="50" height="50">
                    <div class="btn-group">
                        <button type="button" class="profile_Btn btn dropdown-toggle text-light" data-bs-toggle="dropdown" aria-expanded="false">${data.username}</button>
                        <ul class="dropdown-menu">
                            <li><button type="button" class="btn btn-light w-100" data-bs-toggle="modal" data-bs-target="#settingsModal">Settings</button></li>
                            <li><button type="button" class="btn btn-light w-100" id="logoutBtn">Logout</button></li>
                        </ul>
                    </div>
                </section>
                <section class="coinsUI rounded-pill d-inline-flex align-items-center px-5 py-1" style="height: 30px;">
                <i class="fa-solid fa-coins text-warning me-2"></i>
                <p class="text-light m-0 ">${data.coins}</p>
                </section>
            </section>
            `;
          document.querySelector(".forms-container").innerHTML += settingsFormHTML(data);
        } else {
          document.querySelector(".profile_container").innerHTML = `
                <section class="profile_container">
                <section class="profile">
                    <img src="${imgUser}" alt="Profile" class="rounded-circle mt-1 mx-auto" width="50" height="50">
                    <div class="btn-group">
                        <button type="button" class="profile_Btn btn dropdown-toggle text-light" data-bs-toggle="dropdown" aria-expanded="false">${data.username}</button>
                        <ul class="dropdown-menu">
                            <li><button type="button" class="btn btn-light w-100" data-bs-toggle="modal" data-bs-target="#settingsModal">settings</button></li>
                            <li><button type="button" class="btn btn-light w-100" id="logoutBtn">Logout</button></li>
                            <li><button type="button" class="btn btn-light w-100" id="adminBtn">Admin Panel</button></li>
                        </ul>
                    </div>
                </section>
                <section class="coinsUI rounded-pill d-inline-flex align-items-center px-5 py-1" style="height: 30px;">
                <i class="fa-solid fa-coins text-warning me-2"></i>
                <p class="text-light m-0 ">${data.coins}</p>
                </section>
            </section>
            `;
          document.querySelector(".forms-container").innerHTML += settingsFormHTML(data);
        }
      } else if (currentView === "mobile") {
        document.querySelector(".coinsUI").innerHTML = ` 
          <section class="coinsUI rounded-pill d-inline-flex align-items-center px-3 py-1 position-absolute top-0 start-50 translate-middle" style="height: 30px;">
              <i class="fa-solid fa-coins text-warning me-2"></i>
              <p class="text-light m-0 ">${data.coins}</p>
          </section>
          `;
      }
    }
    const adminBtn = document.querySelector("#adminBtn");
    if (adminBtn) {
      adminBtn.addEventListener("click", () => {
        window.location.href = "./admin.html";
      });
    }
  });
}

//default "guest" navbar
function loadHtml() {
  const imgUser =
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740";

  const navbar = document.querySelector(".toolbar");

  navbar.innerHTML = `
    <section class="profile_container">
        <section class="profile">
            <img src="${imgUser}" alt="Profile" class="rounded-circle mt-1 mx-auto" width="50" height="50">
            <div class="btn-group">
                <button type="button" class="profile_Btn btn dropdown-toggle text-light" data-bs-toggle="dropdown" aria-expanded="false">guest</button>
                <ul class="dropdown-menu">
                        <li><button type="button" class="btn btn-light w-100" data-bs-toggle="modal" data-bs-target="#login">Login</button></li>
                        <li><button type="button" class="btn btn-light w-100" data-bs-toggle="modal" data-bs-target="#Register">Register</button></li>
                </ul>
            </div>
        </section>
        <section class="coinsUI rounded-pill d-inline-flex align-items-center px-5 py-1" style="height: 30px;">
        <i class="fa-solid fa-coins text-warning me-2"></i>
        <p class="text-light m-0 ">0</p>
        </section>
    </section>

    <div class="container text-center p-2">
      
        <div class="container text-center">
            <div class="row flex-nowrap">
                <div class="col col-lg-6"><a href="index.html">HOME</a></div>
                <div class="col-md-auto d-flex justify-content-center align-items-center"><a href="shop.html">SHOP<br><i class="fa-solid fa-bag-shopping"></i></a></div>
                <div class="col-md-auto d-flex justify-content-center align-items-center"><a href="news.html">NEWS<br><i class="fa-solid fa-newspaper"></i></a></div>
                <div class="col-md-auto d-flex justify-content-center align-items-center"><a href="trade.html">TRADE<br><i class="fa-solid fa-arrows-rotate"></i></a></div>
                <div class="col-md-auto d-flex justify-content-center align-items-center"><a href="cards.html">CARDS<br><i class="fa-solid fa-rug"></i></a></div>
                <div class="col-md-auto d-flex justify-content-center align-items-center"><a href="contact.html">CONTACT<br><i class="fa-solid fa-headset"></i></a></div>
            </div>
        </div>

  <section class="forms-container">
  ${registerFormHTML()}
  ${loginformHTML()}
  <section>
  `;

  loadProfile();
  setupDynamicListeners();
  return navbar;
}
//dropdown guest/user HTML
async function getUserMenu() {
  const userInfo = await getUserInfo();
  if (userInfo.username != "guest") {
    return `
      <li><button type="button" class="btn btn-light w-100" data-bs-toggle="modal" data-bs-target="#settingsModal">Settings</button></li>
      <li><button type="button" class="btn btn-light w-100" id="logoutBtn">Logout</button></li>
      `;
  } else {
    return `
      <li><button type="button" class="btn btn-light w-100" data-bs-toggle="modal" data-bs-target="#login">Login</button></li>
      <li><button type="button" class="btn btn-light w-100" data-bs-toggle="modal" data-bs-target="#Register">Register</button></li>
      `;
  }
}
//--------------------------------------------------------------------------------------------
//register - logic
//--------------------------------------------------------------------------------------------
function handleRegister() {
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  fetch(serverNet + "/db", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    })
    .then((data) => {
      alert("Registration successful!");
      document.getElementById("registerForm").reset();
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

function registerFormHTML() {
  return `
  <!-- Register Form -->
  <div class="modal fade" id="Register" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
          
          <form id="registerForm" class="mainForm">
              <h1>Create Account</h1>
              <div class="row align-items-center">
                  <i class="fa-solid fa-user text-warning"></i>
                  <input type="text" id="regUsername" placeholder="User" required autocomplete="username"/>
                  <i class="fa-solid fa-envelope text-warning"></i>
                  <input type="email" id="regEmail" placeholder="Email" required autocomplete="email"/>
                  <i class="fa-solid fa-lock text-warning"></i>
                  <input type="password" id="regPassword" placeholder="Password" required autocomplete="new-password" />
                  <i class="fa-solid fa-key text-warning"></i>
                  <input type="password" id="regConfirmPassword" placeholder="Confirm Password" required autocomplete="new-password" />
              </div>

              <div class="modal-footer">
                  <input type="submit" value="Register" />
              </div>

          </form>

          </div>
      </div>
      </div>
  </div>
  `;
}
//--------------------------------------------------------------------------------------------
//login - logic
//--------------------------------------------------------------------------------------------
function handleLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPass").value;

  fetch(serverNet + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          const token = data.token;
          onLogin(token);
        });
      } else {
        invalidLogin();
      }
    })
    .catch((error) => {
      alert(`Username ${username} or Password are incorrect, ${error}`);
    });
}

function invalidLogin() {
  document.getElementById("loginUsername").value = "";
  document.getElementById("loginPass").value = "";
  appendAlert("Invalid login", "danger");
}

async function onLogin(token) {
  localStorage.setItem("token", token);
  appendAlert("login success", "success");
  loadHtml(); 

  const modal = bootstrap.Modal.getInstance(document.getElementById("login"));
  if (modal) modal.hide();

  document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
  document.body.classList.remove("modal-open");
  document.body.style = "";
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

function onLogout() {
  localStorage.removeItem("token");
  appendAlert("You Have Logged Out", "info");

  setTimeout(() => {
    location.reload();
  }, 1000);
}

function loginformHTML() {
  return `
  <!-- Login Form -->
  <div class="modal fade" id="login" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">

              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

          <form class="mainForm" id="loginForm">
              <h1>Login information</h1>
              <i class="fa-solid fa-user text-info"></i>
              <input type="text" id="loginUsername" placeholder="User" required autocomplete="username"/>
              <i class="fa-solid fa-lock text-warning"></i>
              <input type="password" id="loginPass" placeholder="Password" required autocomplete="current-password" />
              
              <div class="modal-footer">
              <div class="g-recaptcha" data-sitekey="6LcZVpArAAAAAGgkHJbdQqrMTQ5ECEsJADJjHwqZ"></div>
                  <input type="submit" value="Login" />
              </div>
          </form>

          </div>
      </div>
      </div>
  </div>
  `;
}
//--------------------------------------------------------------------------------------------
//resolution logic = pc/mobile
//--------------------------------------------------------------------------------------------
function updateNavbar(navbar) {
  const isMobile = window.innerWidth <= 1200;

  if (
    (isMobile && currentView === "mobile") ||
    (!isMobile && currentView === "pc")
  ) {
    return;
  }

  if (isMobile) {
    mobileNav(navbar);
    currentView = "mobile";
  } else {
    pcNav(navbar);
    currentView = "pc";
  }
}

function pcNav(navbar) {
  loadHtml();
}

function mobileNav(navbar) {
  getUserMenu().then((userMenu) => {
    navbar.innerHTML = `
      <div>
          <button id="mobileMenuBtn" class="btn" aria-expanded="false" aria-controls="mobileMenu">
            <img src="./src/burger_icon.png" alt="Logo" class="logo" width="100" height="100">
          </button>
          
          <section class="coinsUI rounded-pill d-inline-flex align-items-center px-3 py-1 position-absolute top-0 start-50 translate-middle" style="height: 30px;">
              <i class="fa-solid fa-coins text-warning me-2"></i>
              <p class="text-light m-0 ">0</p>
          </section>
          
          <ul id="mobileMenu" class="list-unstyled m-0 collapse">
              <li><a href="index.html" class="btn btn-link">HOME</a></li>
              <li><a href="shop.html" class="btn btn-link">SHOP</a></li>
              <li><a href="news.html" class="btn btn-link">NEWS</a></li>
              <li><a href="trade.html" class="btn btn-link">TRADE</a></li>
              <li><a href="cards.html" class="btn btn-link">CARDS</a></li>
              <li><a href="contact.html" class="btn btn-link">CONTACT</a></li>
              <li><hr></li>
              ${userMenu}
          </ul>
      </div>

      ${registerFormHTML()}
      ${loginformHTML()}

    `;

    const btn = document.getElementById("mobileMenuBtn");
    const menu = document.getElementById("mobileMenu");
    btn.addEventListener("click", () => {
      menu.classList.toggle("show");
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
    });

    setupDynamicListeners();
    loadProfile(); 
  });
}

function openLoginModal() {
  const loginModalEl = document.getElementById("login");
  if (loginModalEl) {
    const loginModal = new bootstrap.Modal(loginModalEl);
    loginModal.show();
  }
}

function appendAlert(message, type) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  if (!alertPlaceholder) return;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show text-center" role="alert">
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  const alertElement = wrapper.firstElementChild;
  alertPlaceholder.append(alertElement);

  setTimeout(() => {
    alertElement.classList.remove("show");
    alertElement.addEventListener("transitionend", () => alertElement.remove());
  }, 9000);
}

async function tradeAlert(trade_details, type) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  if (!alertPlaceholder) return;

  const player2 = await getNameFromID(trade_details.p1_id);
  if (!player2) {
    return;
  }

  const card_p2 = await getCardformid(trade_details.p1_card);
  if (!card_p2) {
    return;
  }

  const card_p1 = await getCardformid(trade_details.p2_card);
  if (!card_p1) {
    return;
  }

  const wrapper = document.createElement("section");
  wrapper.innerHTML = `
    <section class="alert alert-${type} alert-dismissible fade show" role="alert" style="padding: 30px; Width:100%; background-color:rgba(20, 20, 20, 0.49); color: rgba(255, 238, 5, 1);">
      <div class="container-fluid text-center">
        <div class="row flex-nowrap align-items-center justify-content-center gx-3">

          <div class="col-auto">
            <span>${player2} wants to trade their:</span>
          </div>

          <div class="col-auto">
            <div class="card rare_${card_p2.color_id}" style="padding: 3px; border: none; background-color: rgba(0, 0, 0, 0)">
              <img src="${card_p2.image_url}" width="100" height="180" style="margin: 10px; border-radius: 5px;">
            </div>
          </div>

          <div class="col-auto">
            <span>for your:</span>
          </div>

          <div class="col-auto">
            <div class="card rare_${card_p1.color_id}" style="padding: 3px; border: none; background-color: rgba(0, 0, 0, 0)">
              <img src="${card_p1.image_url}" width="100" height="180" style="margin: 10px; border-radius: 5px;">
            </div>
          </div>

          <div class="col-auto">
            <button type="button" class="btn btn-success" data-bs-dismiss="alert" onclick="acceptTrade()" aria-label="Close">
              <i class="fas fa-check"></i>
            </button>
          </div>

          <div class="col-auto">
            <button type="button" class="btn btn-danger" data-bs-dismiss="alert" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>


        </div>
      </div>
    </section>
  `;

  const alertElement = wrapper.firstElementChild;
  alertPlaceholder.append(alertElement);
}

async function getNameFromID(id) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(serverNet + `/user/searchID/${id}`, {
      headers: { Authorization: token },
    });
    const data = await res.json();
    return data.username; // או data["username"]
  } catch (error) {
    return null;
  }
}

async function getCardformid(id) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(serverNet + `/cards/search/${id}`, {
      headers: { Authorization: token },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    appendAlert("Failed to fetch card:", "danger");
    return null;
  }
}

function acceptTrade() {
  const token = localStorage.getItem("token");

  fetch(serverNet + `/trade/accept`, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user1_id: tradeData.p1_id,
      user2_id: tradeData.p2_id,
      user1_card: tradeData.p1_card,
      user2_card: tradeData.p2_card,
    }),
    method: "POST",
  })
    .then((data) => {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    })
    .catch((error) => {
      appendAlert("Failed to fetch trade","danger");
      return null;
    });
}


function settingsFormHTML(data) {
  
  return `
  <!-- settings Form -->
<div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <form id="settingsForm">
          <h1 class="modal-title fs-5 text-light bg-primary" id="exampleModalLabel">Change Account Information</h1>
          <div class="row align-items-center">
            <input type="hidden" name="setID" value="${data.id}">
            <i class="fa-solid fa-user text-warning"></i>
            <input type="text" id="setUsername" value="${data.username}" required autocomplete="username"/>
            <i class="fa-solid fa-envelope text-warning"></i>
            <input type="email" id="setEmail" value="${data.email}" required autocomplete="email"/>
            <i class="fa-solid fa-lock text-warning"></i>
            <input type="password" id="setPassword" value="${data.password}" required autocomplete="new-password" />
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick="updateUserinfo()">Save changes</button>
      </div>
    </div>
  </div>
</div>
  `;
}

function updateUserinfo() {
  const token = localStorage.getItem("token");
  const form = document.getElementById("settingsForm");
  if (!form || !token) return;

  const setID = form.querySelector("input[name='setID']").value;
  const username = form.querySelector("#setUsername").value;
  const email = form.querySelector("#setEmail").value;
  const password = form.querySelector("#setPassword").value;

  const body = { id: setID, username, email, password };

  fetch(serverNet + "/user", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          throw new Error(data.error || "Unknown error");
        });
      }
      return res.json();
    })
    .then((data) => {
      bootstrap.Modal.getInstance(document.getElementById("settingsModal"))?.hide();
      appendAlert("User info updated successfully", "success");
    })
    .catch((error) => {
      appendAlert("Update failed: " + error.message, "danger");
    });
}