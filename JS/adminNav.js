const serverNet = "https://web-server-q7kx.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {
    createNav();
  });

function createNav(){
  const navbar = document.querySelector(".toolbar");
  navbar.innerHTML = `
    <!-- Sidebar -->
    <div class="sidebar">
      <h4 class="text-center">
          <img src="{url}" alt="Profile" class="rounded-circle mb-3" width="80" height="80">
      </h4>
      <a href="admin.html">Dashboard</a>
      <a href="adminData.html">User Data</a>
      <a href="#">Manage Packs</a>
      <a href="./adminNews.html">Manage News</a>
      <a href="./adminUploadNews.html">Upload News</a>
      <a href="index.html">Back to Site</a>
      <hr class="bg-light">
      <a href="#">Settings</a>
      <a href="#">Logout</a>
    </div>
  `;
}