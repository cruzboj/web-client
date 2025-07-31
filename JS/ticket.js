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

async function sendticket(description_ticket) {
  const token = localStorage.getItem("token");
  const data = await getUserInfo();
  console.log("Data:", description_ticket);
  const ticket_username = data.username;
  fetch(serverNet + "/adminTickets", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: ticket_username,
      description: description_ticket,
    }),
  }).then((response) => {
    if (response.ok) {
      appendAlert("Ticket Posted", "success");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  });
}

async function getTickets() {
  const ticketsHTML = document.querySelector(".user_tickets");
  let tempHTML = `
    <div class="container">
  `;

  const token = localStorage.getItem("token");
  const data = await getUserInfo();

  fetch(serverNet + `/adminTickets/getUser/${data.id}`, {
    headers: {
      Authorization: token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((ticketid) => {
        let response = ticketid.response ?? "Ticket is still open";

        tempHTML += `
          <div class="mb-4 d-flex justify-content-center text-center">
            <div class="bg-light p-3 rounded shadow-sm w-100" style="max-width: 600px;">
              <h5 class="text-primary">Last Update: ${new Date(
                ticketid.lastupdatedat
              ).toLocaleDateString()}</h5>
              <p class="text-dark mb-1">Ticket Description: ${
                ticketid.description
              }</p>
              <p class="text-dark mb-1">Ticket Status: ${ticketid.status}</p>
              <p class="text-muted small">Response: ${response}</p>
            </div>
          </div>
        `;
      });

      tempHTML += `
    </div> <!-- close container -->
      `;

      ticketsHTML.innerHTML = tempHTML;
    });
}
