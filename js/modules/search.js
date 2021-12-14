import { sanitize } from "dompurify";

export default function () {
  const csrf = document.querySelector('input[name="_csrf"]');
  const searchBtn = document.querySelector(".header-search-icon");
  const searchOverlay = document.querySelector(".search-overlay");
  const input = searchOverlay.querySelector("#live-search-field");
  const closeBtn = searchOverlay.querySelector(".close-live-search");
  const searchResult = searchOverlay.querySelector(".live-search-results");
  const loader = searchOverlay.querySelector(".circle-loader");
  let waitTimer;
  let previousValue = "";

  function showLoader(bool) {
    if (bool) {
      loader.classList.add("circle-loader--visible");
    } else {
      loader.classList.remove("circle-loader--visible");
    }
  }

  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchOverlay.classList.add("search-overlay--visible");
    setTimeout(() => input.focus(), 50);
  });
  closeBtn.addEventListener("click", () => searchOverlay.classList.remove("search-overlay--visible"));

  input.addEventListener("keyup", () => {
    let value = input.value;
    if (value != "" && value != previousValue) {
      clearTimeout(waitTimer);
      searchResult.innerHTML = "";
      showLoader(true);
      waitTimer = setTimeout(() => sendRequest(value), 750);
    } else if (value == "") {
      clearTimeout(waitTimer);
      searchResult.innerHTML = "";
      showLoader(false);
    }
    previousValue = value;
  });

  function sendRequest(searchTerm) {
    fetch("/search", { method: "POST", headers: { "Content-Type": "application/json", "CSRF-Token": csrf.value }, body: JSON.stringify({ searchTerm }) })
      .then((result) => result.json())
      .then((data) => {
        if (data.length) {
          searchResult.innerHTML = sanitize(`
          <div class="list-group shadow-sm">
          <div class="list-group-item active"><strong>Search Results</strong> (${data.length > 1 ? `${data.length} items found` : "1 item found"})</div>
          ${data
            .map((post) => {
              let postDate = new Date(post.createdAt);
              return `<a href="/post/${post._id}" class="list-group-item list-group-item-action">
              <img class="avatar-tiny" src="${post.author.avatar}"> <strong>${post.title}</strong>
              <span class="text-muted small">by ${post.author.username} on ${postDate.getMonth() + 1}/${postDate.getDate()}/${postDate.getFullYear()}</span>
            </a>`;
            })
            .join("")}
          </div>
          `);
        } else {
          searchResult.innerHTML = '<p class="alert alert-danger shadow-sm text-center">Sorry, we coudn\'t find any result.</p>';
        }
        showLoader(false);
      })
      .catch(() => {
        showLoader(false);
        searchResult.innerHTML = '<p class="text-center">Internal error, please try again later.</p>';
      });
  }
}
