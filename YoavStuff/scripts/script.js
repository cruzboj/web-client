window.onload = () => {
  fetch("../globalHeader.html")
    .then((response) => response.text())
    .then((html) => {
      const headerContainer =
        document.getElementsByClassName("header-container")[0];
      headerContainer.innerHTML = html;
    })
    .catch((error) => {
      console.log("HTML file not found",error);
    });
};
