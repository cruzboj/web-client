addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketID = urlParams.get("ticketid");
    const token = localStorage.getItem("token");
    fetch(serverNet + `/adminTickets/${ticketID}`, {
        headers : {
            Authorization: token
        }
    })
    .then((response) => response.json())
    .then((response) => {
        console.log(response);
    })
});
