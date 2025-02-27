document
  .querySelector("#login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // To prevent the form from submitting synchronously
    const form = event.target;

    //... create your form object with the form inputs
    let formObject = {
      email: form.email.value,
      password: form.password.value,
    };

    const res = await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject), //convert JS object to JSON format
    });

    const errorDiv = document.querySelectorAll(".error");

    console.log(res);

    if (res.status === 200) {
      window.location.href = "/games/games.html";
    } else {
      errorDiv.forEach((field) => {
        field.classList.add("active");
        field.innerText = "Invalid Email or Password";
      });
    }
  });
