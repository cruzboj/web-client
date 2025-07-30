addEventListener("DOMContentLoaded", () => {
  fileInput = document.getElementById("file");
  preview = document.getElementById("preview");
  newsForm = document.querySelector("#submitNews");
  cancelBtn = document.querySelector("#cancelBtn");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      preview.style.display = "none";
      preview.src = "";
    }
  });
  newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitForm();
  });
  cancelBtn.addEventListener("click", () => {
    window.location.href = "./adminNews.html";
  })
});

function submitForm() {
    const token = localStorage.getItem("token");
  const title = document.querySelector("#title").value;
  const description = document.querySelector("#description").value;
  const img = document.querySelector("#file").files[0];
    const color = 1;

    const formData = new FormData();
    formData.append("title",title);
    formData.append("description",description);
    formData.append("color",color);
    formData.append("image",img);

    fetch(serverNet+ "/news", {
        method:"POST",
        headers:{
        Authorization: token
        },
        body:formData
    })
    .then((response) => {
        if(response.ok){
            window.location.href="./adminNews.html";
        }
    })
}
