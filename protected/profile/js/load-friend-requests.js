export async function loadFriendRequests() {
  const receivedRequestsContainer =
    document.querySelector(".received-requests");
  const sentRequestsContainer = document.querySelector(".sent-requests");

  //set original layout
  receivedRequestsContainer.innerHTML = `<h4>Pending Received Requests</h4>`;
  sentRequestsContainer.innerHTML = `<h4>Sent Requests</h4>`;

  //fetch database
  const receivedFriendRequestsRes = await fetch(
    `/users/received-friend-requests`
  );
  const sentFriendRequestsRes = await fetch(`/users/sent-friend-requests`);

  const receivedFriendRequests = await receivedFriendRequestsRes.json();
  const sentFriendRequests = await sentFriendRequestsRes.json();

  //determine the layout
  if (receivedFriendRequests.length == 0) {
    receivedRequestsContainer.innerHTML += `<div class="message"><p>No Friend Requests</p></div>`;
  } else {
    receivedFriendRequests.forEach((request) => {
      receivedRequestsContainer.innerHTML += `<div class="request">
                    <div class="user-info" data-user=${request.requester_id}>
                      <div class="user-icon">
                        <img src="../assets/profile/${request.icon}" alt="" />
                      </div>
                      <div>
                        <div class="name">${request.nickname}</div>
                        <div class="username">@${request.username}</div>
                      </div>
                    </div>
    
                    <div class="buttons">
                      <button class="accept">Accept</button>
                      <button class="reject">Reject</button>
                    </div>
                  </div>`;
    });
  }

  if (sentFriendRequests.length == 0) {
    sentRequestsContainer.innerHTML += `<div class="message"><p>No Sent Friend Requests</p></div>`;
  } else {
    sentFriendRequests.forEach((request) => {
      sentRequestsContainer.innerHTML += `<div class="request">
                <div class="user-info">
                  <div class="user-icon">
                    <img src="../assets/profile/${request.icon}" alt="" />
                  </div>
                  <div>
                    <div class="name">${request.nickname}</div>
                    <div class="username">@${request.username}</div>
                  </div>
                </div>

                <div class="status">
                  <p class="${request.status.toLowerCase()}">${
        request.status
      }</p>
                </div>
              </div>`;
    });
  }
}
