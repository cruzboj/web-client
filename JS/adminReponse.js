addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ticketID = urlParams.get("ticketid");
  const token = localStorage.getItem("token");
  const tableBody = document.querySelector("#tableBody");
  const DescriptionContainer = document.querySelector("#description_box");
  const ticketDescription = document.querySelector("#ticket_description");
  if (!tableBody) {
    return;
  }
  fetch(serverNet + `/adminTickets/${ticketID}`, {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      const createdAt = formatDate(response.createdat);
      const updatedAt = formatDate(response.lastupdatedat);
      console.log(createdAt);
      const text = `
        <tr>
            <td style="border-style:none;">${response.ticketid}</th>
            <td style="border-style:none;">${createdAt}</th>
            <td style="border-style:none;">${response.username}</th>
            <td style="border-style:none;">${updatedAt}</th>
            <td style="border-style:none;">${response.status}</th>
        </tr>
        `;
      tableBody.innerHTML = text;
      ticketDescription.innerHTML += `
      <p>
      ${response.description}
      </p
      `;
      DescriptionContainer.innerHTML += `
        <div class="input-group">
            <span class="input-group-text">Admin Response</span>
            <textarea id="adminResponse" class="form-control" aria-label="adminResponse"></textarea>
        </div>
        <div class="d-flex justify-content-center align-items-center gap-3 mt-3 flex-wrap">
        <div class="btn-group" role="group" aria-label="Radio options">
            <input type="radio" class="btn-check" name="options" id="option1" value="In-progress" autocomplete="off" checked>
            <label class="btn btn-secondary" for="option1">In-progress</label>

            <input type="radio" class="btn-check" name="options" id="option2" value="Closed" autocomplete="off">
            <label class="btn btn-secondary" for="option2">Closed</label>
        </div>

        <button id="submitResponse" class="btn btn-primary">Submit</button>
        </div>

        `;
      if (response.response != null) {
        document.querySelector("#adminResponse").value = response.response;
      }
      document
        .querySelector("#submitResponse")
        .addEventListener("click", () => {
          const responseText = document.querySelector("#adminResponse").value;
          const selectedStatus = document.querySelector('input[name="options"]:checked').value;
          const token = localStorage.getItem("token");
          fetch(serverNet + "/adminTickets", {
            method: "PATCH",
            headers: {
              Authorization: token,
            },
            body: JSON.stringify({
              ticketid: ticketID,
              adminResponse: responseText,
              status:selectedStatus
            }),
          }).then((response) => {
            if (response.ok) {
              window.location.href = "./admin.html";
            }
          });
        });
    });
});

function formatDate(myDate) {
  const date = new Date(myDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  //   return `${day}/${month}/${year} ${hours}:${minutes}`;
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}
