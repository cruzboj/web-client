const API_BASE = "https://web-server-q7kx.onrender.com";
let newsContainer;

window.onload = () => {
  newsContainer = document.getElementById("news-section");
  let newsArr = [];
  fetch(API_BASE + "/news")
    .then((response) => response.json())
    .then((response) => {
      renderNews(response);
    })
    .catch("Unable to receive News");
};

renderNews = (newsArr) => {
    // console.log("entered here");
    console.log(newsArr);
  for (let news of newsArr) {
    const newDiv = document.createElement("section");
    newDiv.classList.add("news-container");
    newDiv.innerHTML = `
    <h2>${news.title}</h2>
    <p>${news.description}</p>
    `
    newsContainer.appendChild(newDiv);
  }
};
