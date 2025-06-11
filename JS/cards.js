fetch('data/card_items.json')
  .then(response => response.json())
  .then(data => {
    allitems = data;
    drawCard(data);
  })
  .catch(error => {
    console.error("Error loading JSON:", error);
    document.getElementById("errorContainer").textContent = "Failed to load items. Please try again later";
  });

function drawCard(data) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("section");
    card.className = "col";

    card.innerHTML = `
        <section class="card">
            <section class="card-img-container">
            <img src="${item.image}" alt="${item.name}" width="200">
            <h1>${item.name}</h1>
            <p>${item.description}</p>
            </section>
        </section>
    `;

    container.appendChild(card);
  });
}
