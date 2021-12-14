import { sanitize } from "dompurify";

export default function () {
  let user;
  let socket;
  const openBtn = document.querySelector(".header-chat-icon");
  const chatWrapper = document.querySelector("#chat-wrapper");
  let openedYet = false;
  chatWrapper.innerHTML = `
    <div class="chat-title-bar">Chat <span class="chat-title-bar-close"><i class="fas fa-times-circle"></i></span></div>
    <div id="chat" class="chat-log"></div>
    <form id="chatForm" class="chat-form border-top">
        <input type="text" class="chat-field" id="chatField" placeholder="Type a message…" autocomplete="off">
    </form>
  `;

  const closeBtn = document.querySelector(".chat-title-bar-close");
  const inputMessage = document.querySelector("#chatField");
  const form = document.querySelector("#chatForm");
  const chatLog = document.querySelector(".chat-log");

  openBtn.addEventListener("click", () => {
    if (!openedYet) {
      openconnection();
    }
    openedYet = true;
    chatWrapper.classList.add("chat--visible");
    inputMessage.focus();
  });

  closeBtn.addEventListener("click", () => {
    chatWrapper.classList.remove("chat--visible");
  });

  function openconnection() {
    socket = io();
    socket.on("welcome", (data) => (user = data));
    socket.on("messageFromServer", (data) => {
      chatLog.insertAdjacentHTML(
        "beforeend",
        sanitize(`
        <div class="chat-other">
          <a href="/profile/${data.username}"><img class="avatar-tiny" src="${data.avatar}"></a>
          <div class="chat-message"><div class="chat-message-inner">
            <a href="/profile/${data.username}"><strong>${data.username}:</strong></a>
            ${data.message}
          </div></div>
        </div>
        `)
      );
      chatLog.scrollTop = chatLog.scrollHeight;
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (inputMessage.value.trim() == "") {
      return;
    }
    socket.emit("messageFromBrowser", { message: inputMessage.value });
    chatLog.insertAdjacentHTML(
      "beforeend",
      sanitize(`
      <div class="chat-self">
          <div class="chat-message">
            <div class="chat-message-inner">
              ${inputMessage.value}
            </div>
          </div>
          <img class="chat-avatar avatar-tiny" src="${user.avatar}">
        </div>
      `)
    );
    chatLog.scrollTop = chatLog.scrollHeight;
    inputMessage.value = "";
    inputMessage.focus();
  });
}
