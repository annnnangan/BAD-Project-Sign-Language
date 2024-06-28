import { loadFriendRequests } from "./load-friend-requests.js";

document
  .querySelector("#add-friend")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;

    let formObject = {
      username: form.username.value,
    };

    const res = await fetch("/users/add-friend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });
    const messageDiv = document.querySelector(".message");

    form.reset();

    const isAddFriend = await res.json();
    console.log(isAddFriend);

    if (isAddFriend.status == "error") {
      messageDiv.style.display = "block";
      messageDiv.classList.add("error");
      messageDiv.innerText = isAddFriend.message;
    } else {
      messageDiv.style.display = "block";
      messageDiv.classList.add("success");
      messageDiv.innerText = isAddFriend.message;
    }

    loadFriendRequests();
  });
