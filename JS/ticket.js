document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ticket");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
        const description_ticket = document.getElementById("description").value;
        // console.log(description_ticket);
        sendticket(description_ticket);
    });

    getTickets();
});


async function sendticket(description_ticket){
    const token = localStorage.getItem("token");
    const data = await getUserInfo();
    console.log("Data:", description_ticket);
    const ticket_username = data.username;
    fetch(serverNet + "/adminTickets" , {
        method : "POST",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username : ticket_username, description : description_ticket})
    })
}

async function getTickets() {
  const ticketsHTML = document.querySelector(".user_tickets");
  ticketsHTML.innerHTML = `
    <div class="container text-center">
      <div class="row justify-content-center">
  `;

  const token = localStorage.getItem("token");
  const data = await getUserInfo();

  fetch(serverNet + `/adminTickets/getUser/${data.id}`, {
    headers: {
      Authorization: token,
    },
  })
    .then(res => res.json())
    .then(data => {
      data.forEach(ticketid => {
        let response = ticketid.response ?? "ticket still open";

        ticketsHTML.innerHTML += `
          <div class="col-md-4 d-flex justify-content-center mb-4">
            <div class="bg-light p-3 rounded shadow-sm h-100 w-100" style="max-width: 350px;">
              <h5 class="text-primary">${new Date(ticketid.lastupdatedat).toLocaleDateString()}</h5>
              <p class="text-dark mb-1">${ticketid.description}</p>
              <p class="text-dark mb-1">${ticketid.status}</p>
              <p class="text-muted small">Response: ${response}</p>
            </div>
          </div>
        `;
      });

      // ✅ סוגר את ה־row וה־container
      ticketsHTML.innerHTML += `
        </div> <!-- close row -->
      </div> <!-- close container -->
      `;
    });
}