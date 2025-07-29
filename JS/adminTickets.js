import { formatDate } from "./dateFormatter.js";

let Tickets = [];
let tableContainer;
let searchForm;

addEventListener("DOMContentLoaded", () => {
  tableContainer = document.querySelector("#tableBody");
  searchForm = document.querySelector("form[role='search']");

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
      Tickets = response;
      renderTable(Tickets);
    });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const filtered = filterTickets(Tickets);
    renderTable(filtered);
  });
});

function renderTable(data) {
  data.sort((a,b) => a.ticketid - b.ticketid);
  tableContainer.innerHTML = data
    .map((ticket) => {
      const formattedDate = formatDate(ticket.createdat);
      return `
    <tr>
          <th scope="row">${ticket.ticketid}</th>
          <td>${formattedDate}</td>
          <td>${ticket.username}</td>
          <td>${ticket.status}</td>
          <td>
            <a href="adminTicketResponse.html?ticketid=${ticket.ticketid}" class="btn btn-primary">View</a>
          </td>
        </tr>
    `;
    })
    .join("");
}

function filterTickets(tickets) {
  console.log("tickets:", tickets);

  const ticketIdInput = searchForm.querySelector("input[placeholder='Search Ticket ID']").value.trim().toLowerCase();
  const dateInput = searchForm.querySelector("input[type='date']").value;
  const nameInput = searchForm.querySelector("input[placeholder='Search by name']").value.trim().toLowerCase();
  let statusInput = searchForm.querySelector("select").value;

  console.log({ ticketIdInput, dateInput, nameInput, statusInput });
  if (statusInput === "Search by status"){
    statusInput = null;
  }

  return tickets.filter((ticket) => {
    const matchesId = !ticketIdInput || ticket.ticketid.toString().toLowerCase().includes(ticketIdInput);
    const matchesDate = !dateInput || ticket.createdat.slice(0, 10) === dateInput;
    const matchesName = !nameInput || ticket.username.toLowerCase().includes(nameInput);
    const matchesStatus = !statusInput || ticket.status.toLowerCase() === statusInput.toLowerCase();

    console.log(`checking ticket ${ticket.ticketid}:`, { matchesId, matchesDate, matchesName, matchesStatus });

    return matchesId && matchesDate && matchesName && matchesStatus;
  });
}

// function formatDate(myDate) {
//   const date = new Date(myDate);
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
//   const year = date.getFullYear();
//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   return `${hours}:${minutes} ${day}/${month}/${year}`;
// }
