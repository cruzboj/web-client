document.addEventListener("DOMContentLoaded", () => {
  let user = 'guest';
  const navbar = document.querySelector(".toolbar");
  let currentView = ''; // "mobile" או "pc"

  function showNavPc() {
    navbar.innerHTML = `
      <ul class="web-nav">
          <li><a href="#">HOME</a></li>
          <li><a href="#">SHOP</a></li>
          <li><a href="#">NEWS</a></li>
          <li><a href="#">BATTLE</a></li>
          <li><a href="#">TRADE</a></li>
          <li><a href="#">CARDS</a></li>
          <li><a href="#">CONTACT</a></li>
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
          <form class="mainForm">
            <i class="fa-solid fa-user"></i>
            <input type="text" id="username" placeholder="User" required />
            <i class="fa-solid fa-lock"></i>
            <input type="password" id="pass" placeholder="Password" required />
            <input type="submit" value="Login" />
          </form>
      </section>
    `;
    bindFormButtons();
  }

  function bindFormButtons() {
    const formDisplay = document.querySelector(".formDisplay");
    const loginBtn = document.getElementById("login");
    const registerBtn = document.getElementById("register");
    if (!formDisplay || !loginBtn || !registerBtn) return;

    loginBtn.addEventListener("click", () => {
      formDisplay.innerHTML = `
        <form class="mainForm">
          <h1>Login information</h1>
          <i class="fa-solid fa-user"></i>
          <input type="text" id="username" placeholder="User" required />
          <i class="fa-solid fa-lock"></i>
          <input type="password" id="pass" placeholder="Password" required />
          <input type="submit" value="Login" />
        </form>
      `;
    });

    registerBtn.addEventListener("click", () => {
      formDisplay.innerHTML = `
        <form class="mainForm">
          <h1>Create Account</h1>
          <i class="fa-solid fa-user"></i>
          <input type="text" placeholder="User" required />
          <i class="fa-solid fa-envelope"></i>
          <input type="email" placeholder="Email" required />
          <i class="fa-solid fa-lock"></i>
          <input type="password" placeholder="Password" required />
          <i class="fa-solid fa-key"></i>
          <input type="password" placeholder="Confirm Password" required />
          <input type="submit" value="Register" />
        </form>
      `;
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
