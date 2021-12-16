export default function () {
  const inputFile = document.querySelector('input[type="file"]');
  const fileBtn = document.querySelector(".input-btn");
  const csrf = document.querySelector('input[name="_csrf"]');

  fileBtn.addEventListener("click", () => {
    inputFile.click();
  });

  inputFile.addEventListener("change", () => {
    const formdata = new FormData();
    formdata.append("img", inputFile.files[0]);
    let img = formdata.get("img");
    console.log(img);
    if (img.type == "image/jpeg" || img.type == "image/png") {
      fetch("/upload/profileImg", {
        method: "POST",
        headers: {
          "CSRF-Token": csrf.value,
        },
        body: formdata,
      })
        .then((res) => res.json())
        .then((data) => location.reload())
        .catch((err) => console.log(err));
    } else {
      alert("File not allowed");
    }
  });
}
