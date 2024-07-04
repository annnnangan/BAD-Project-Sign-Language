import { loadFriendRequests } from "./load-friend-requests.js";

export async function responseFriendRequests() {
  const acceptButtons = document.querySelectorAll(".received-requests .accept");
  const rejectButtons = document.querySelectorAll(".received-requests .reject");

  acceptButtons.forEach((request) => {
    request.addEventListener("click", async (event) => {
      //capture the accepted friends' username
      const requesterUsername =
        event.target.closest("[data-user]").dataset.user;

      //fetch the API
      const res = await fetch("/users/accept-friend", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requesterUsername: requesterUsername }),
      });
      //load again friend requests
      loadFriendRequests();
    });
  });

  rejectButtons.forEach((request) => {
    request.addEventListener("click", async (event) => {
      //capture the accepted friends' username
      const requesterUsername =
        event.target.closest("[data-user]").dataset.user;
      console.log(requesterUsername);
      //fetch the API
      const res = await fetch("/users/reject-friend", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requesterUsername: requesterUsername }),
      });
      //load again friend requests
      loadFriendRequests();
    });
  });
}
