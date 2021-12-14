export default function () {
  const navLinks = document.querySelectorAll(".profile-nav-link");
  let urlArray = window.location.href.split("/");
  navLinks.forEach((link) => {
    let linkArray = link.innerText.split(": ");
    if (urlArray[5] == linkArray[0].toLowerCase()) {
      link.className = "profile-nav-link nav-item nav-link active";
    }
    if (typeof urlArray[5] == "undefined") {
      navLinks[0].className = "profile-nav-link nav-item nav-link active";
    }
  });
}
