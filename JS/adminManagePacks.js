const API_KEY = "nJ0ypZg0zYl1Xaqe1Xndxq7vHptaNIEc";
const token = localStorage.getItem("token");

function shortenUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname + "/…/" + u.pathname.split("/").pop();
  } catch {
    return url;
  }
}

function searchGifs() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&limit=10`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";

      data.data.forEach((gif) => {
        const imgUrl = gif.images.original.url;

        const container = document.createElement("div");
        container.className = "gif-box m-2 text-center";

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = gif.title;
        img.classList.add("img-fluid");

        const urlText = document.createElement("div");
        urlText.className = "gif-url text-white";
        urlText.textContent = shortenUrl(imgUrl);
        urlText.style.cursor = "pointer";

        urlText.addEventListener("click", () => {
          const input = document.createElement("input");
          input.type = "text";
          input.value = imgUrl;
          input.className = "form-control mt-1";

          urlText.replaceWith(input);
          input.focus();

          input.addEventListener("blur", () => {
            const newUrl = input.value;
            const newDiv = document.createElement("div");
            newDiv.className = "gif-url text-white";
            newDiv.textContent = shortenUrl(newUrl);
            newDiv.style.cursor = "pointer";

            newDiv.addEventListener("click", () => {
              input.value = newUrl;
              newDiv.replaceWith(input);
              input.focus();
            });

            input.replaceWith(newDiv);
          });
        });

        container.appendChild(img);
        container.appendChild(urlText);
        resultsDiv.appendChild(container);
      });
    })
    .catch((error) => {
      console.error("Error fetching GIFs:", error);
    });
}
document.addEventListener("DOMContentLoaded", () => {
  // gifsearch();

  createPacksTable();
});

function handleAddpack(e) {
  e.preventDefault();
  const packName = document.getElementById("packName").value;
  const packPrice = document.getElementById("packPrice").value;

  console.log(e);

  fetch(servernet + "/admin/createPack", {
    method: "POST",
    headers: { "Content-Type": "application/json",Authorization:token },
    body: JSON.stringify({ name: packName, cost: packPrice }),
  })
    .then(async (res) => {
      // const data = await res.json();
      if (res.ok) {
        console.log("Pack added:", packName);
        createPacksTable();
      } else {
        console.error("Failed:", packName);
      }
    })
    .catch((err) => {
      console.log("fetch error:" + err);
    });
}

function handleAddcard(e) {
  e.preventDefault();
  const cardName = document.getElementById("cardName").value;
  const packID = document.getElementById("cardPack_id").value;
  const colorID = document.getElementById("color_id").value;
  const url = document.getElementById("card_url").value;
  fetch(servernet + "/admin/createCard", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({
      name: cardName,
      packid: packID,
      color_id: colorID,
      image_url: url,
    }),
  })
    .then(async (res) => {
      // const data = await res.json();
      if (res.ok) {
        console.log("Card added:", cardName);
        // createPacksTable();
        showpack(packID);
      } else {
        console.error("Failed:", cardName);
      }
    })
    .catch((err) => {
      console.log("fetch error:", err);
    });
}

function createPacksTable() {
  const packTable = document.querySelector(".packsTable");
  packTable.innerHTML = "";

  let html = `
            <table class="table table-bordered table-striped mt-3">
            <thead>
                <tr>
                    <th scope="col">#id</th>
                    <th scope="col">pack name</th>
                    <th scope="col">cost</th>
                    <th scope="col">show</th>
                    <th scope="col">delete</th>
                </tr>
            </thead>
            <tbody>
        `;

  fetch(servernet + "/admin/packs")
    .then((response) => response.json())
    .then((data) => {
      for (const pack of data) {
        // console.log(pack);
        html += `
                        <tr>
                        <td>${pack.packid}</td>
                        <td>${pack.name}</td>
                        <td>${pack.cost}</td>
                        <td><button class="btn" onclick="showpack(${pack.packid})">🔍</button></td>
                        <th><button class="btn bg-danger"><i class="fa-solid fa-minus text-white"></i></button></th>
                        </tr>
                    `;
      }
      html += `
                <form id="addpack" onsubmit="handleAddpack(event)"></form>
                <tr>
                <td>NEW</td>
                <td>
                    <input type="text" id="packName" class="form-control form-control-sm" placeholder="name" required />
                </td>
                <td>
                    <input type="text" id="packPrice" class="form-control form-control-sm" placeholder="cost" required />
                </td>
                <td>
                    <button type="submit" class="btn btn-primary btn-sm" form="addpack">
                    <i class="fa-solid fa-plus text-white"></i>
                    </button>
                </td>
                </tr>
                `;
      html += `</tbody></table>`;
      packTable.innerHTML = html;
    });
}

const servernet = "https://web-server-q7kx.onrender.com/api";

function showpack(packId) {
  const cardTable = document.getElementById("packCards");
  cardTable.innerHTML = ""; //reset html

  let html = `
            <table class="table table-bordered table-striped mt-3">
            <thead>
                <tr>
                    <th>#id</th>
                    <th>card name</th>
                    <th>pack_id</th>
                    <th>rarity</th>
                    <th>image/gif</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
        `;

  fetch(servernet + "/admin/cards/" + packId)
    .then((response) => response.json())
    .then((data) => {
      for (const card of data) {
        console.log(card);
        html += `
                <tr>
                    <td>${card.id}</td>
                    <td>${card.name}</td>
                    <td>${card.packid}</td>
                    <td>${card.color_id}</td>
                    <td>
                        <div class="input-group input-group-sm mb-3">
                            <span class="input-group-text" id="inputGroup-sizing-sm">url</span>
                            <input type="text" class="form-control" value="${card.image_url}" aria-label="URL input" aria-describedby="inputGroup-sizing-sm">
                        </div>
                    </td>
                    <td><button class="btn bg-danger"><i class="fa-solid fa-minus text-white"></i></button></td>
                </tr>
                `;
      }
      html += `
            <form id="addcard" onsubmit="handleAddcard(event)"></form>
            <tr>
                <td>new</td>
                <td><input type="text" class="form-control" id="cardName" placeholder="Name" aria-label="Place Name"></td>
                <td><input type="text" class="form-control" id="cardPack_id" placeholder="Pack id" aria-label="Pack number"></td>
                <td><input type="text" class="form-control" id="color_id" placeholder="Color id" aria-label="color id"></td>
                <td>
                    <div class="input-group input-group-sm mb-3">
                        <span class="input-group-text" id="inputGroup-sizing-sm">url</span>
                        <input type="text" class="form-control" id="card_url" placeholder="place_url" aria-label="Place URL">
                    </div>
                </td>
                <td>
                    <button type="submit" class="btn btn-primary btn-sm" form="addcard">
                    <i class="fa-solid fa-plus text-white"></i>
                    </button>
                </td>
            </tr>
            `;

      html += `</tbody></table>`;
      cardTable.innerHTML = html;
    })
    .catch((error) => {
      console.log("no cards for this pack\n", error);
      html += `
            <form id="addcard" onsubmit="handleAddcard(event)"></form>
            <tr>
                <td>new</td>
                <td><input type="text" class="form-control" id="cardName" placeholder="Name" aria-label="Place Name"></td>
                <td><input type="text" class="form-control" id="cardPack_id" placeholder="Pack id" aria-label="Pack number"></td>
                <td><input type="text" class="form-control" id="color_id" placeholder="Color id" aria-label="color id"></td>
                <td>
                    <div class="input-group input-group-sm mb-3">
                        <span class="input-group-text" id="inputGroup-sizing-sm">url</span>
                        <input type="text" class="form-control" id="card_url" placeholder="place_url" aria-label="Place URL">
                    </div>
                </td>
                <td>
                    <button type="submit" class="btn btn-primary btn-sm" form="addcard">
                    <i class="fa-solid fa-plus text-white"></i>
                    </button>
                </td>
            </tr>
            </tbody></table>
            <p>No cards for this pack</p>
            `;
      cardTable.innerHTML = html;
    });
}
