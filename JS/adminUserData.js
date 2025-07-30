let data;
addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userID = urlParams.get("userid");
  const token = localStorage.getItem("token");
  const tableBody = document.querySelector("#tableBody");

  fetch(serverNet + `/user/searchID/${userID}`, {
    headers: {
      Authorization: token,
    },
  })
  .then((response) => response.json())
  .then((userDetails) => {
    data = userDetails
    showData(data);
  })
});

function showData(userData) {
  const html = `
            <tr>
            <th style="border-style:none;">${userData.id}</th>
            <td style="border-style:none;">${userData.username}</td>
            <td style="border-style:none;">${userData.password}</td>
            <td style="border-style:none;">${userData.email}</td>
            <td style="border-style:none;">${userData.isadmin}</td>
            <td style="border-style:none;">${userData.coins}</td>
            </tr>
        `;
    tableBody.innerHTML = html;
}
