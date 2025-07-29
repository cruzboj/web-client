let data = [];
let searchForm;

document.addEventListener("DOMContentLoaded", () => {
  searchForm = document.querySelector("#searchFilter");
  Init();
});

function Init() {
  fetch(serverNet + "/admin/db", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.json())
    .then((users) => {
      data = users;
      createTable(users);
    });
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const filtered = filterTickets(data);
    createTable(filtered);
  });
}

function createTable(users) {
  const table = document.querySelector(".table");

  // התחלה של תוכן הטבלה
  let html = `
        <thead>
            <tr>
            <th scope="col">User ID</th>
            <th scope="col">UserName</th>
            <th scope="col">Email</th>
            <th scope="col">Created Date</th>
            <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
        `;

  // עבור כל משתמש – הוסף שורה
  users.forEach((user) => {
    html += `
            <tr>
            <th scope="row">${user.id}</th>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
            <td><button class="btn btn-sm btn-info">info</button></td>
            </tr>
        `;
  });

  html += `</tbody>`;
  table.innerHTML = html;
}

function filterTickets(users) {
  console.log("users:", users);

  const userIdInput = searchForm
    .querySelector("input[placeholder='User ID']")
    .value.trim()
    .toLowerCase();
  const dateInput = searchForm.querySelector("input[type='date']").value;
  const nameInput = searchForm.querySelector("input[placeholder='Search by name']").value.trim().toLowerCase();
  const emailInput = searchForm.querySelector("input[placeholder='Search by email']").value;
  console.log({ userIdInput, dateInput, nameInput, emailInput });

  return users.filter((user) => {
    console.log(user);
    const matchesId =
      !userIdInput ||
      user.ticketid.toString().toLowerCase().includes(userIdInput);
    const matchesDate = !dateInput || user.created_at.slice(0, 10) === dateInput;
    const matchesName =
      !nameInput || user.username.toLowerCase().includes(nameInput);
    const matchesEmail =
      !emailInput || user.email.toLowerCase().includes(emailInput);

    console.log({
      matchesId,
      matchesDate,
      matchesName,
      matchesEmail,
    });

    return matchesId && matchesDate && matchesName && matchesEmail;
  });
}
