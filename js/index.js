import search from "./modules/search";
import main from "./modules/main";
import chat from "./modules/chat";
import registration from "./modules/registration";
import uploadImage from "./modules/uploadImage";

if (document.querySelector("#registration-form")) {
  registration();
}

let url = window.location.href;
let urlArray = url.split("/");

if (urlArray[3] == "profile") {
  main();
}

if (document.querySelector(".search-overlay")) {
  search();
}

if (document.querySelector("#chat-wrapper")) {
  chat();
}

if (document.querySelector(".profile-up")) {
  uploadImage();
}
