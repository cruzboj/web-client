document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("header").innerHTML = `
  <header class="p-3 mb-3 border-bottom bg-light">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between w-100">
        <a href="/" class="d-flex align-items-center link-body-emphasis text-decoration-none">
          <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">
            <use xlink:href="#bootstrap"></use>
          </svg>
        </a>
        
        <ul class="nav d-flex justify-content-center mb-0">
          <li class="mx-3"><a href="#" class="nav-link px-2 link-secondary">HOME</a></li>
          <li class="mx-3"><a href="#" class="nav-link px-2 link-body-emphasis">SHOP</a></li>
          <li class="mx-3"><a href="#" class="nav-link px-2 link-body-emphasis">NEWS</a></li>
          <li class="mx-3"><a href="#" class="nav-link px-2 link-body-emphasis">BATTLE</a></li>
          <li class="mx-3"><a href="#" class="nav-link px-2 link-body-emphasis">TRADE</a></li>
          <li class="mx-3"><a href="#" class="nav-link px-2 link-body-emphasis">CARDS</a></li>
          <li class="mx-3"><a href="#" class="nav-link px-2 link-body-emphasis">CONTACT</a></li>
        </ul>

        <a href="#" class="d-flex align-items-center" style="text-decoration: none; color: black;">
          <img src="https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTExXzEucG5n.png" alt="cart" width="50" height="50" class="me-2">
          Guest
        </a>

      </div>
    </div>
  </header>
  `;

  document.querySelector("header").style.fontFamily = "'Gruppo', cursive";
  document.querySelector("header").style.fontWeight = "bold";
  document.querySelector("header").style.position = "relative";
  document.querySelector("header").style.zIndex = "10";
});