const serverNet = "https://web-server-q7kx.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {
    createNav();
  });

function createNav(){
  const navbar = document.querySelector(".toolbar");
  navbar.innerHTML = `
    <!-- Sidebar -->
    <div class="sidebar">
      <a href="admin.html">Dashboard</a>
      <a href="adminData.html">User Data</a>
      <a href="./adminManagePacks.html">Manage Packs</a>
      <a href="./adminNews.html">Manage News</a>
      <a href="./adminUploadNews.html">Upload News</a>
      <a href="index.html">Back to Site</a>
      <hr class="bg-light">
    </div>
  `;
}