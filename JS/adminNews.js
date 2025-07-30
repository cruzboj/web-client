let news;
let tableContainer;
const imgPath = "https://web-server-q7kx.onrender.com";

addEventListener("DOMContentLoaded", () => {
  tableContainer = document.querySelector("#tableBody");
  fetch(serverNet + "/news")
    .then((response) => response.json())
    .then((data) => {
      news = data;
      news.sort((a,b) => b.id - a.id);
      createTable(news);
    });
});

function createTable(news) {
    let html = '';
  news.forEach((user) => {
    html += `
            <tr>
            <th scope="row">${user.title}</th>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
            <td>${user.description}</td>
            <td><img src=${imgPath}${user.img_path} style="max-width:300px;max-height:200px;"></td>
            <td><button data-id=${user.id} class="btn btn-sm btn-danger delete-btn">delete</button></td>
            </tr>
        `;
  });
  tableContainer.innerHTML = html;

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener(("click"), () => {
        const id = button.getAttribute("data-id");
        deleteItem(id);
    })
  })
}

function deleteItem(id){

}
