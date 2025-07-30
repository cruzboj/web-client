const API_BASE = "https://web-server-q7kx.onrender.com/api";
const IMG_BASE = "https://web-server-q7kx.onrender.com";
let newsContainer;

window.onload = () => {
  newsContainer = document.getElementById("news-section");
  fetch(API_BASE + "/news")
    .then((response) => response.json())
    .then((response) => {
      renderNews(response);
    })
    .catch("Unable to receive News");
};

renderNews = (newsArr) => {
  newsArr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  // console.log("entered here");
  console.log(newsArr);
  for (let news of newsArr) {
    const newDiv = document.createElement("section");
    newDiv.classList.add("news-container");
    newDiv.innerHTML = `
    <section class="text">
        <h2>${news.title}</h2>
        <h6>${formatDateTime(news.created_at)}</h6>
        <p>${news.description}</p>
    </section>
    <section class="news-img-container">
        <img src=${news.img_path}>
    </section>
    
    `;
    newDiv.style.backgroundColor = `rgb(${getRandomBackgroundColor()},${getRandomBackgroundColor()},${getRandomBackgroundColor()})`;
    newsContainer.appendChild(newDiv);
  }
};

function getRandomBackgroundColor() {
  const randInt = Math.random() * 255;
  return randInt;
}

function formatDateTime(originalDate) {
  const date = new Date(originalDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
