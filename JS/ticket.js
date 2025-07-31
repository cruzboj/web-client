document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ticket");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
        const description_ticket = document.getElementById("description").value;
        // console.log(description_ticket);
        sendticket(description_ticket);
    });
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