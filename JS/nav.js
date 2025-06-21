const local = "http://localhost:8081";
const serverNet = "https://web-server-q7kx.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  let user = 'guest';
  const navbar = document.querySelector(".toolbar");
  let currentView = ''; // "mobile" או "pc"

  function showNavPc() {
    navbar.innerHTML = `
      <ul class="web-nav">
          <li><a href="/client/index.html">HOME</a></li>
          <li><a href="#">SHOP</a></li>
          <li><a href="/client/news.html">NEWS</a></li>
          <li><a href="#">BATTLE</a></li>
          <li><a href="#">TRADE</a></li>
          <li><a href="#">CARDS</a></li>
          <li><a href="/client/contact.html">CONTACT</a></li>
          <li><button class="formdropDown">${user}</button></li>
      </ul>
      <section class="formContainer slide-up"></section>
    `;
    bindFormDropdown();
    showLoginForm();
  }

  function showNavMobile() {
    navbar.innerHTML = `
      <ul class="mobile-nav">
          <li><button class="mobile-menu"><i class="fa-solid fa-bars"></i></button></li>
      </ul>
      <section class="formContainer slide-up"></section>
    `;
    bindFormDropdown();
    bindMobileMenu();
    showLoginForm();
  }

  function updateNavbar() {
    const isMobile = window.innerWidth <= 769;

    if ((isMobile && currentView === 'mobile') || (!isMobile && currentView === 'pc')) {
      return;
    }

    if (isMobile) {
      showNavMobile();
      currentView = 'mobile';
    } else {
      showNavPc();
      currentView = 'pc';
    }
  }

  function bindMobileMenu() {
    const menuBtn = document.querySelector(".mobile-menu");
    const navList = document.querySelector(".mobile-nav");
    if (!menuBtn || !navList) return;

    menuBtn.addEventListener("click", () => {
      const isExpanded = navList.classList.toggle("expanded");
      navList.innerHTML = `
        <button class="mobile-menu"><i class="fa-solid fa-bars"></i></button>
        ${isExpanded ? `
          <li><a href="#">HOME</a></li>
          <li><a href="#">SHOP</a></li>
          <li><a href="#">NEWS</a></li>
          <li><a href="#">BATTLE</a></li>
          <li><a href="#">TRADE</a></li>
          <li><a href="#">CARDS</a></li>
          <li><a href="#">CONTACT</a></li>
        ` : ""}
      `;
      bindMobileMenu(); // לחבר מחדש את הכפתור
    });
  }

  function showLoginForm() {
    const formContainer = document.querySelector(".formContainer");
    if (!formContainer) return;

    formContainer.innerHTML = `
      <section class="changeform">
          <button id="login">LOGIN</button>
          <button id="register">REGISTER</button>
      </section>
      <section class="formDisplay">
          <form class="mainForm" id="loginForm">
            <i class="fa-solid fa-user"></i>
            <input type="text" id="loginUsername" placeholder="User" required />
            <i class="fa-solid fa-lock"></i>
            <input type="password" id="loginPass" placeholder="Password" required />
            <input type="submit" value="Login" />
          </form>
      </section>
    `;
    bindFormButtons();
    bindLoginFormSubmit();
  }

  function bindFormButtons() {
    const formDisplay = document.querySelector(".formDisplay");
    const loginBtn = document.getElementById("login");
    const registerBtn = document.getElementById("register");
    if (!formDisplay || !loginBtn || !registerBtn) return;

    loginBtn.addEventListener("click", () => {
      formDisplay.innerHTML = `
        <form class="mainForm" id="loginForm">
          <h1>Login information</h1>
          <i class="fa-solid fa-user"></i>
          <input type="text" id="loginUsername" placeholder="User" required />
          <i class="fa-solid fa-lock"></i>
          <input type="password" id="loginPass" placeholder="Password" required />
          <input type="submit" value="Login" />
        </form>
      `;
      bindLoginFormSubmit();
    });

    registerBtn.addEventListener("click", () => {
      formDisplay.innerHTML = `
        <form id="registerForm" class="mainForm">
          <h1>Create Account</h1>
          <i class="fa-solid fa-user"></i>
          <input type="text" id="regUsername" placeholder="User" required />
          <i class="fa-solid fa-envelope"></i>
          <input type="email" id="regEmail" placeholder="Email" required />
          <i class="fa-solid fa-lock"></i>
          <input type="password" id="regPassword" placeholder="Password" required />
          <i class="fa-solid fa-key"></i>
          <input type="password" id="regConfirmPassword" placeholder="Confirm Password" required />
          <input type="submit" value="Register" />
        </form>
      `;
      bindRegisterFormSubmit();
    });
  }

  // טיפול ב-submit של טופס ההרשמה ושליחה לשרת
  function bindRegisterFormSubmit() {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("regUsername").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value;
      const confirmPassword = document.getElementById("regConfirmPassword").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const response = await fetch(serverNet+"/db", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password, email })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unknown error");
        }

        alert("User registered successfully!");
        registerForm.reset();
      } catch (err) {
        alert("Registration failed: " + err.message);
        console.error("Registration error:", err);
      }
    });
  }

  // אופציונלי - טיפול ב-login, פה רק מציג alert
  function bindLoginFormSubmit() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPass").value;
      alert(`Login attempted for user: ${username}`);
      // פה אפשר להוסיף לוגיקה לשליחת נתוני התחברות לשרת
    });
  }

  function bindFormDropdown() {
    const toggleBtn = document.querySelector(".formdropDown");
    const formContainer = document.querySelector(".formContainer");
    if (!toggleBtn || !formContainer) return;
    toggleBtn.addEventListener("click", () => {
      formContainer.classList.toggle("slide-down");
      formContainer.classList.toggle("slide-up");
    });
  }

  updateNavbar();
  window.addEventListener("resize", updateNavbar);
});
