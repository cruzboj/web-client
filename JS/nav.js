document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("header").innerHTML =  `
    <header class="p-3 mb-3 border-bottom bg-light">
      <div class="container">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
            <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">
              <use xlink:href="#bootstrap"></use>
            </svg>
          </a>
          <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li class="mx-4"><a href="#" class="nav-link px-2 link-secondary">HOME</a></li>
            <li class="mx-4"><a href="#" class="nav-link px-2 link-body-emphasis">SHOP</a></li>
            <li class="mx-4"><a href="#" class="nav-link px-2 link-body-emphasis">NEWS</a></li>
            <li class="mx-4"><a href="#" class="nav-link px-2 link-body-emphasis">BATTLE</a></li>
            <li class="mx-4"><a href="#" class="nav-link px-2 link-body-emphasis">TRADE</a></li>
            <li class="mx-4"><a href="#" class="nav-link px-2 link-body-emphasis">CARDS</a></li>
            <li class="mx-4"><a href="#" class="nav-link px-2 link-body-emphasis">CONTACT</a></li>
          </ul>
          <a href="#">
            <img src="https://imgs.search.brave.com/yZXQiGHMPQtCEPv3o0fSmq3S3svXOP3E97BaULqkdK0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNS9Vc2Vy/LVByb2ZpbGUtUE5H/LUZpbGUucG5n" alt="cart" width="50" height="50">
            Guest
          </a>
        </div>
      </div>
    </header>
    `;

    document.querySelector("header").style.fontFamily = "'Gruppo', cursive";
  });