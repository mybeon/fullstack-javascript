export default function () {
  const csrf = document.querySelector('input[name="_csrf"]');
  const allFields = document.querySelectorAll(".form-group .form-control");
  const form = document.querySelector("#registration-form");

  //Fields
  const username = document.querySelector("#username-register");
  username.previousValue = "";
  username.isUnique = false;
  const email = document.querySelector("#email-register");
  email.previousValue = "";
  email.isUnique = false;
  const password = document.querySelector("#password-register");
  password.previousValue = "";

  // Logic
  allFields.forEach((el) => {
    el.insertAdjacentHTML("afterend", `<div class="alert alert-danger small liveValidateMessage">hello</div>`);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    usernameImmediatly();
    usernameAfterDelay();
    emailAfterDelay();
    passwordImmediatly();
    passwordAfterDelay();

    if (email.isUnique || username.isUnique || !username.errors || !email.errors || !password.errors) {
      form.submit();
    }
  });

  // Listeners
  username.addEventListener("keyup", () => {
    isDifferent(username, usernameHandler);
  });
  email.addEventListener("keyup", () => {
    isDifferent(email, emailHandler);
  });
  password.addEventListener("keyup", () => {
    console.log("pass key");
    isDifferent(password, passwordHandler);
  });

  username.addEventListener("blur", () => {
    isDifferent(username, usernameHandler);
  });
  email.addEventListener("blur", () => {
    isDifferent(email, emailHandler);
  });
  password.addEventListener("blur", () => {
    console.log("pass key");
    isDifferent(password, passwordHandler);
  });

  function isDifferent(el, handler) {
    if (el.previousValue != el.value) {
      handler();
    }
    el.previousValue = el.value;
  }

  function usernameHandler() {
    username.errors = false;
    usernameImmediatly();
    clearTimeout(username.timer);
    username.timer = setTimeout(() => usernameAfterDelay(), 800);
  }

  function usernameImmediatly() {
    if (username.value != "" && !/^([a-zA-Z0-9]+)$/.test(username.value)) {
      validationError(username, "Username must be alphanumeric");
    }
    if (username.value.length > 30) {
      validationError(username, "Username must not exceed 30 characters");
    }

    if (!username.errors) {
      hideValidationError(username);
    }
  }

  function usernameAfterDelay() {
    if (username.value.length < 3) {
      validationError(username, "Username must be more than 3 characters");
    }

    if (username.value.length >= 3 && !username.errors) {
      fetch("/doesUsernameExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrf.value,
        },
        body: JSON.stringify({ username: username.value }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.usernameExists) {
            validationError(username, "Username already taken");
            username.isUnique = false;
          } else {
            hideValidationError(username);
            username.isUnique = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function emailHandler() {
    email.errors = false;
    clearTimeout(email.timer);
    email.timer = setTimeout(() => emailAfterDelay(), 800);
  }

  function emailAfterDelay() {
    if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      validationError(email, "Must provide a valide email");
    }

    if (!email.errors) {
      hideValidationError(email);
    }

    if (!email.errors) {
      fetch("/doesEmailExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrf.value,
        },
        body: JSON.stringify({ email: email.value }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.emailExists) {
            validationError(email, "Email already taken");
            email.isUnique = false;
          } else {
            hideValidationError(email);
            email.isUnique = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function passwordHandler() {
    console.log("heee");
    password.errors = false;
    passwordImmediatly();
    clearTimeout(password.timer);
    password.timer = setTimeout(() => passwordAfterDelay(), 800);
  }

  function passwordImmediatly() {
    if (password.value.length > 30) {
      validationError(password, "Password must not exceed 30 characters");
    }

    if (!password.errors) {
      hideValidationError(password);
    }
  }

  function passwordAfterDelay() {
    if (password.value.length < 12) {
      validationError(password, "Password must at least 12 characters");
    }
  }

  function validationError(el, message) {
    el.nextElementSibling.innerText = message;
    el.nextElementSibling.classList.add("liveValidateMessage--visible");
    el.errors = true;
  }

  function hideValidationError(el) {
    el.nextElementSibling.classList.remove("liveValidateMessage--visible");
  }
}
