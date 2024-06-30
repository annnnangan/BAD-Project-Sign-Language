const input = document.querySelector("input");
const nickname = document.getElementById("nickname");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm_password");

const inputControlDiv = document.querySelectorAll(".input-control");
const emailInputDiv = document.querySelector(".input-control-email");
const emailErrorContainer = document.querySelector(
  ".input-control-email .error"
);
const usernameInputDiv = document.querySelector(".input-control-username");
const usernameErrorContainer = document.querySelector(
  ".input-control-username .error"
);

const loadingIcon = document.querySelector(".loading");
const submitBtn = document.querySelector('input[type="submit"]');

document
  .querySelector("#register-form")
  .addEventListener("submit", async (event) => {
    submitBtn.style.display = "none";
    loadingIcon.style.display = "block";

    let formError = false;
    event.preventDefault();

    setTimeout(async () => {
      submitBtn.style.display = "block";
      loadingIcon.style.display = "none";
      validateInputs();

      //Validate input data from frontend

      inputControlDiv.forEach((field) => {
        if (field.classList.contains("error")) {
          formError = true;
        }
      });

      if (formError) {
        return;
      }

      //Register Accounts
      const form = event.target;

      let formObject = {
        nickname: form.nickname.value,
        username: form.username.value,
        email: form.email.value,
        password: form.password.value,
        icon: form.icon.value,
      };

      const res = await fetch("/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const result = await res.json();

      if (result.status === "success") {
        form.reset();
        window.location.href = "/profile/profile.html";
      } else {
        result.message.forEach((error) => {
          if (error.errorFields === "username") {
            usernameInputDiv.classList.add("error");
            usernameErrorContainer.classList.add("active");
            usernameErrorContainer.innerText = `${error.message}`;
          }

          if (error.errorFields === "email") {
            emailInputDiv.classList.add("error");
            emailErrorContainer.classList.add("active");
            emailErrorContainer.innerText = `${error.message}`;
          }
        });
      }
    }, 2000);
  });

// Display Error Message when error
const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");
  const errorActive = errorDisplay.classList.add("active");

  errorDisplay.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${message}`;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

// Remove Error Message when no issue
const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");
  const errorActive = errorDisplay.classList.remove("active");

  errorDisplay.innerHTML = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

// Regular expression to validate Email
const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Regular expression to validate Password
const isValidPassword = (password) => {
  const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  return re.test(password);
};

// Function to set rules to validate user input value
const validateInputs = () => {
  //Removes whitespace from both sides of user input
  const nicknameValue = nickname.value.trim();
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const confirmPasswordValue = confirmPassword.value.trim();

  if (nicknameValue === "") {
    setError(nickname, "Nickname is required.");
  } else {
    setSuccess(nickname);
  }

  if (usernameValue === "") {
    setError(username, "Username is required.");
  } else {
    setSuccess(username);
  }

  if (emailValue === "") {
    setError(email, "Email is required.");
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address");
  } else {
    setSuccess(email);
  }

  if (passwordValue === "") {
    setError(password, "Password is required.");
  } else if (!isValidPassword(passwordValue)) {
    setError(
      password,
      "Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
    );
  } else {
    setSuccess(password);
  }

  if (confirmPasswordValue === "") {
    setError(confirmPassword, "Password confirm your password.");
  } else if (confirmPasswordValue !== passwordValue) {
    setError(confirmPassword, "Passwords do not match");
  } else {
    setSuccess(confirmPassword);
  }
};
