const API_BASE = "https://web-server-q7kx.onrender.com";
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
  // console.log("entered here");
  console.log(newsArr);
  for (let news of newsArr) {
    const newDiv = document.createElement("section");
    newDiv.classList.add("news-container");
    const imgDir = API_BASE + "/" + news.img_path;
    console.log(news.img_path);
    console.log(imgDir);
    newDiv.innerHTML = `
    <section class="text">
        <h2>${news.title}</h2>
        <p>${news.description}</p>
    </section>
    <section class="news-img-container">
        <img src=${imgDir}>
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