addEventListener("DOMContentLoaded", () => {
  const tableContainer = document.querySelector("#tableBody");
  let TempText = "";
  if (!tableContainer) {
    console.log("Error loading table body");
    return;
  }
  const token = localStorage.getItem("token");
  fetch(serverNet + "/adminTickets", {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      for (const ticket of response) {
        TempText += `
        <tr>
            <th scope="row">${ticket.ticketid}</th>
            <td>${ticket.createdat}</td>
            <td>${ticket.username}</td>
            <td>${ticket.status}</td>
            <td>
            <a href="adminTicketResponse.html?ticketid=${ticket.ticketid}" class="btn btn-primary">
            View</a></td>
          </tr>`;
      }
      tableContainer.innerHTML = TempText;
    });
});
