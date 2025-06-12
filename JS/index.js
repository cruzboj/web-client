window.onload = () => {
    serverResponse();
}

let serverResponse = () => {
    fetch('localhost:8080')
        .then(response => response.json())
}