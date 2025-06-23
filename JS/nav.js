const local = "http://localhost:8081";
const serverNet = "https://web-server-q7kx.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const loggedUser = localStorage.getItem("loggedInUser");
  let user = "";
  if (loggedUser) {
    user = loggedUser;
  } else {
    user = "guest";
  }
  const navbar = document.querySelector(".toolbar");
  let currentView = ""; // "mobile" או "pc"

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
          <li><button class="formdropDown" id="username">${user}</button></li>
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

    if (
      (isMobile && currentView === "mobile") ||
      (!isMobile && currentView === "pc")
    ) {
      return;
    }

    if (isMobile) {
      showNavMobile();
      currentView = "mobile";
    } else {
      showNavPc();
      currentView = "pc";
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
        ${
          isExpanded
            ? `
          <li><a href="#">HOME</a></li>
          <li><a href="#">SHOP</a></li>
          <li><a href="#">NEWS</a></li>
          <li><a href="#">BATTLE</a></li>
          <li><a href="#">TRADE</a></li>
          <li><a href="#">CARDS</a></li>
          <li><a href="#">CONTACT</a></li>
        `
            : ""
        }
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
      const confirmPassword =
        document.getElementById("regConfirmPassword").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const response = await fetch(serverNet + "/db", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, email }),
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
  function onLogin(username) {
    const formContainer = document.querySelector(".formContainer");
    formContainer.classList.toggle("slide-up");

    localStorage.setItem("loggedInUser", username);
    document.getElementById("username").innerHTML = username;
    createFeedbackMsg("Login Successful", "#4CAF50");
    // const messageBox = document.createElement("div");
    // messageBox.innerText = "Login Successful";

    // // Style it
    // Object.assign(messageBox.style, {
    //   position: "fixed",
    //   top: "20px",
    //   right: "20px",
    //   padding: "12px 20px",
    //   backgroundColor: "#4CAF50",
    //   color: "white",
    //   borderRadius: "8px",
    //   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    //   zIndex: 1000,
    //   fontSize: "16px",
    //   fontFamily: "Arial, sans-serif",
    //   transition: "opacity 0.5s ease",
    //   opacity: "1",
    // });

    // document.body.appendChild(messageBox);

    // // Automatically fade out after 3 seconds
    // setTimeout(() => {
    //   messageBox.style.opacity = "0";
    //   setTimeout(() => {
    //     messageBox.remove();
    //   }, 500); // match transition time
    // }, 3000);

    const toggleBtn = document.getElementById("username");
    toggleBtn.removeEventListener("click", logInEvent);
    toggleBtn.addEventListener("click", function logOutEvent() {
      let logOutBtn = document.getElementById("logOutBtn");
      if (logOutBtn) {
        logOutBtn.remove();
        return;
      }
      logOutBtn = document.createElement("button");
      logOutBtn.innerText = "Log Out";
      logOutBtn.id = "logOutBtn";
      Object.assign(logOutBtn.style, {
        width: "200px",
        height: "50px",
        backgroundColor: "#ff3333",
        color: "white",
        fontSize: "1.5rem",
        border: "none",
        borderRadius: "20px",
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        transition: "top 0.5s ease",
        top: "-60px",
        zIndex: 1000,
      });
      logOutBtn.addEventListener("click", logOutClick);
      document.body.appendChild(logOutBtn);
      setTimeout(() => {
        logOutBtn.style.top = "15%";
      }, 50);
    });
  }

  function invalidLogin() {
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPass").value = "";
    createFeedbackMsg("Invalid Login", "#ff3333");
    // const messageBox = document.createElement("div");
    // messageBox.innerText = "Invalid Login";
    // // Style it
    // Object.assign(messageBox.style, {
    //   position: "fixed",
    //   top: "20px",
    //   right: "20px",
    //   padding: "12px 20px",
    //   backgroundColor: "#ff3333",
    //   color: "white",
    //   borderRadius: "8px",
    //   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    //   zIndex: 1000,
    //   fontSize: "16px",
    //   fontFamily: "Arial, sans-serif",
    //   transition: "opacity 0.5s ease",
    //   opacity: "1",
    // });

    // document.body.appendChild(messageBox);

    // // Automatically fade out after 3 seconds
    // setTimeout(() => {
    //   messageBox.style.opacity = "0";
    //   setTimeout(() => {
    //     messageBox.remove();
    //   }, 500); // match transition time
    // }, 3000);
  }

  // אופציונלי - טיפול ב-login, פה רק מציג alert
  function bindLoginFormSubmit() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPass").value;
      console.log(username, password);
      // פה אפשר להוסיף לוגיקה לשליחת נתוני התחברות לשרת
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
            onLogin(username);
          } else {
            invalidLogin();
          }
        })
        .catch((error) => {
          alert(`Username ${username} or Password are incorrect, ${error}`);
        });
    });
  }

  function bindFormDropdown() {
    const toggleBtn = document.querySelector(".formdropDown");
    const formContainer = document.querySelector(".formContainer");
    if (!toggleBtn || !formContainer) return;
    if (toggleBtn.innerHTML == "guest") {
      toggleBtn.addEventListener("click", logInEvent);
    } else {
      toggleBtn.addEventListener("click", logOutEvent);
    }
  }

  function logOutClick() {
    localStorage.removeItem("loggedInUser");

    const toggleBtn = document.querySelector(".formdropDown");
    toggleBtn.replaceWith(toggleBtn.cloneNode(true));
    const cleanToggleBtn = document.querySelector(".formdropDown");
    cleanToggleBtn.innerHTML = "guest";
    cleanToggleBtn.addEventListener("click", logInEvent);
    const logOutBtn = document.getElementById("logOutBtn");
    if (logOutBtn) {
      logOutBtn.remove();
    }
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPass").value = "";
    createFeedbackMsg("Logged Out", "#4CAF50");
    // const messageBox = document.createElement("div");
    // messageBox.innerText = "Logged Out";

    // // Style it
    // Object.assign(messageBox.style, {
    //   position: "fixed",
    //   top: "20px",
    //   right: "20px",
    //   padding: "12px 20px",
    //   backgroundColor: "#4CAF50",
    //   color: "white",
    //   borderRadius: "8px",
    //   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    //   zIndex: 1000,
    //   fontSize: "16px",
    //   fontFamily: "Arial, sans-serif",
    //   transition: "opacity 0.5s ease",
    //   opacity: "1",
    // });

    // document.body.appendChild(messageBox);

    // // Automatically fade out after 3 seconds
    // setTimeout(() => {
    //   messageBox.style.opacity = "0";
    //   setTimeout(() => {
    //     messageBox.remove();
    //   }, 500); // match transition time
    // }, 3000);
  }
  function logInEvent() {
    const formContainer = document.querySelector(".formContainer");
    formContainer.classList.toggle("slide-down");
    formContainer.classList.toggle("slide-up");
  }

  function logOutEvent() {
    let logOutBtn = document.getElementById("logOutBtn");
    if (logOutBtn) {
      logOutBtn.remove();
      return;
    }
    logOutBtn = document.createElement("button");
    logOutBtn.innerText = "Log Out";
    logOutBtn.id = "logOutBtn";
    Object.assign(logOutBtn.style, {
      width: "200px",
      height: "50px",
      backgroundColor: "#ff3333",
      color: "white",
      fontSize: "1.5rem",
      border: "none",
      borderRadius: "20px",
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      transition: "top 0.5s ease",
      top: "-60px",
      zIndex: 1000,
    });
    logOutBtn.addEventListener("click", logOutClick);
    document.body.appendChild(logOutBtn);
    setTimeout(() => {
      logOutBtn.style.top = "15%";
    }, 50);
  }

  function createFeedbackMsg(msg, color) {
    const messageBox = document.createElement("div");
    messageBox.innerText = msg;

    // Style it
    Object.assign(messageBox.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "12px 20px",
      backgroundColor: color,
      color: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
      fontSize: "16px",
      fontFamily: "Arial, sans-serif",
      transition: "opacity 0.5s ease",
      opacity: "1",
    });

    document.body.appendChild(messageBox);

    // Automatically fade out after 3 seconds
    setTimeout(() => {
      messageBox.style.opacity = "0";
      setTimeout(() => {
        messageBox.remove();
      }, 500); // match transition time
    }, 3000);
  }

  updateNavbar();
  window.addEventListener("resize", updateNavbar);
});
