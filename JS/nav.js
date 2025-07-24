const local = "http://localhost:8081";
const serverNet = "https://web-server-q7kx.onrender.com/api";

let currentView = ""; //change nav from pc/moblie

document.addEventListener("DOMContentLoaded", () => {
  let navbar = loadHtml();
  // setupDynamicListeners();

  //first refresh
  updateNavbar(navbar);
  //needes to be at the end line (navbar resize update)
  window.addEventListener("resize", () => {
      updateNavbar(navbar);
  });
});

//events
function setupDynamicListeners() {
  //register
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
          e.preventDefault(); //default disable submit 
          handleRegister();
      });
  }

  //login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
          e.preventDefault(); //default disable submit 
          handleLogin();
      });
  }

  //logout
  document.body.addEventListener("click", (e) => {
      if (e.target && e.target.id === "logoutBtn") {
          onLogout();
      }
  });
}

function getUserInfo() {
  const loggedUser = localStorage.getItem("loggedInUser");
  const userName = loggedUser || "guest";
  const coins = parseInt(localStorage.getItem("coins") || "0");
  return { userName, coins };
}

function loadHtml(){
  const { userName, coins } = getUserInfo();
  const imgUser = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740";

  const navbar = document.querySelector(".toolbar");
  
    navbar.innerHTML = `
    <section class="profile">
        <img src="${imgUser}" alt="Profile" class="rounded-circle mt-1 mx-auto" width="50" height="50">
        <div class="btn-group">
            <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">${userName}</button>
            <ul class="dropdown-menu">
                ${getUserMenu()}
            </ul>
        </div>
    </section>

    <section class="coinsUI rounded-pill d-inline-flex align-items-center px-5 py-1" style="height: 30px;">
      <i class="fa-solid fa-coins text-warning me-2"></i>
      <p class="text-light m-0 ">${coins}</p>
    </section>

    <div class="container text-center p-2">
      
        <div class="container text-center">
            <div class="row flex-nowrap">
                <div class="col col-lg-6"><a href="/client/index.html">HOME</a></div>
                <div class="col-md-auto d-flex justify-content-center align-items-center"><a href="/client/shop.html">SHOP<br><i class="fa-solid fa-bag-shopping"></i></a></div>
                <div class="col-md-auto d-flex justify-content-center align-items-center"><a href="/client/news.html">NEWS<br><i class="fa-solid fa-newspaper"></i></a></div>
                <div class="col-md-auto d-flex justify-content-center align-items-center"><a href="/client/#.html">BATTLE<br><i class="fa-solid fa-trophy"></i></a></div>
                <div class="col-md-auto d-flex justify-content-center align-items-center"><a href="/client/#.html">TRADE<br><i class="fa-solid fa-arrows-rotate"></i></a></div>
                <div class="col-md-auto d-flex justify-content-center align-items-center"><a href="/client/#.html">CARDS<br><i class="fa-solid fa-rug"></i></a></div>
                <div class="col-md-auto d-flex justify-content-center align-items-center"><a href="/client/contact.html">CONTACT<br><i class="fa-solid fa-headset"></i></a></div>
            </div>
        </div>

  ${registerFormHTML()}
  ${loginformHTML()}
  `;
  
  setupDynamicListeners();
  return navbar;
}
//dropdown guest/user HTML
function getUserMenu(){
  const loggedUser = localStorage.getItem("loggedInUser");
  if (loggedUser) {
      return `
      <li><button type="button" class="btn btn-light w-100" data-bs-toggle="modal" data-bs-target="#Settings">Settings</button></li>
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
  // console.log(username, email, password , confirmPassword);

  if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
  }

  fetch(serverNet + '/db', {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error("Registration failed");
      }
      return response.json();
  })
  .then(data => {
      alert("Registration successful!");
      document.getElementById("registerForm").reset();
  })
  .catch(error => {
      alert("Error: " + error.message);
      console.error(error);
  });
}

function registerFormHTML(){
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
                  <i class="fa-solid fa-user"></i>
                  <input type="text" id="regUsername" placeholder="User" required autocomplete="username"/>
                  <i class="fa-solid fa-envelope"></i>
                  <input type="email" id="regEmail" placeholder="Email" required autocomplete="email"/>
                  <i class="fa-solid fa-lock"></i>
                  <input type="password" id="regPassword" placeholder="Password" required autocomplete="new-password" />
                  <i class="fa-solid fa-key"></i>
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
function handleLogin(){
  const loginForm = document.getElementById("loginForm");
      if (!loginForm) return;

      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPass").value;
      // console.log(username, password);

      fetch(serverNet+'/login', {
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
              onLogin(username);
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
  console.log("Invalid login");
}

function onLogin(username) {
  localStorage.setItem("loggedInUser", username);
  console.log("login success");
  loadHtml();  // טען מחדש את הניווט, שהוא מתבסס על localStorage
  
  // סגור את המודל
  const modal = bootstrap.Modal.getInstance(document.getElementById("login"));
  if (modal) modal.hide();

  // פתרון: הסר רקע שחור ושאריות של modal
  document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  document.body.classList.remove('modal-open');
  document.body.style = '';
}

function onLogout() {
  localStorage.removeItem("loggedInUser");
  console.log("Logged out");
  location.reload();
}

function loginformHTML(){
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
              <i class="fa-solid fa-user"></i>
              <input type="text" id="loginUsername" placeholder="User" required autocomplete="username"/>
              <i class="fa-solid fa-lock"></i>
              <input type="password" id="loginPass" placeholder="Password" required autocomplete="current-password" />
              
              <div class="modal-footer">
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
function updateNavbar(navbar){
  const isMobile = window.innerWidth <= 1200;

  if ((isMobile && currentView === "mobile") || (!isMobile && currentView === "pc")) {
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

function pcNav(navbar){
  loadHtml();
}

function mobileNav(navbar) {
  const { userName, coins } = getUserInfo();
    
  navbar.innerHTML = `
      <div>
          <button id="mobileMenuBtn" class="btn" aria-expanded="false" aria-controls="mobileMenu">
            <img src="./src/burger_icon.png" alt="Logo" class="logo" width="100" height="100">
          </button>

          <section class="coinsUI rounded-pill d-inline-flex align-items-center px-3 py-1 position-absolute top-0 start-50 translate-middle" style="height: 30px;">
              <i class="fa-solid fa-coins text-warning me-2"></i>
              <p class="text-light m-0 ">${coins}</p>
          </section>
          
          <ul id="mobileMenu" class="list-unstyled m-0 collapse">
              <li><a href="/client/index.html" class="btn btn-link">HOME</a></li>
              <li><a href="#" class="btn btn-link">SHOP</a></li>
              <li><a href="/client/news.html" class="btn btn-link">NEWS</a></li>
              <li><a href="#" class="btn btn-link">BATTLE</a></li>
              <li><a href="#" class="btn btn-link">TRADE</a></li>
              <li><a href="#" class="btn btn-link">CARDS</a></li>
              <li><a href="/client/contact.html" class="btn btn-link">CONTACT</a></li>
              <li><hr></li>
              ${getUserMenu()}
          </ul>
      </div>

      ${registerFormHTML()}
      ${loginformHTML()}
  `;

  // הוספת מאזין לאירוע לחיצה שיפתח/יסגור את התפריט
  const btn = document.getElementById("mobileMenuBtn");
  const menu = document.getElementById("mobileMenu");

  btn.addEventListener("click", () => {
      // Toggle bootstrap collapse class
      menu.classList.toggle("show");

      // לשנות את aria-expanded כדי לעמוד בנגישות
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
  });
}

