import { loadBookmarks } from "./js/load-bookmarks.js";
import { loadRank } from "./js/load-rank.js";
import { loadUserProfile } from "./js/load-user-profile.js";
import { loadFriendRequests } from "./js/load-friend-requests.js";
import "./js/add-friends.js";

window.addEventListener("load", async () => {
  const bookmarksTab = document.querySelector(".tab-bookmark");
  const friendsTab = document.querySelector(".tab-friends-request");
  const bookmarksContainer = document.querySelector(".bookmarks");
  const friendsContent = document.querySelector(".friends-request");
  const noRankAddFriendsBtn = document.querySelector(
    ".no-data .add-friends-btn"
  );

  let bookmarksTabActive = true;
  loadUserProfile();
  loadBookmarks();
  loadRank();

  noRankAddFriendsBtn.addEventListener("click", async () => {
    bookmarksTabActive = false;
    activeTab();
    loadFriendRequests();
  });

  bookmarksTab.addEventListener("click", async () => {
    bookmarksTabActive = true;
    activeTab();
    loadBookmarks();
  });

  friendsTab.addEventListener("click", () => {
    bookmarksTabActive = false;
    activeTab();
    loadFriendRequests();
  });

  function activeTab() {
    if (bookmarksTabActive) {
      bookmarksContainer.style.display = "flex";
      friendsContent.style.display = "none";
      bookmarksTab.classList.add("active");
      friendsTab.classList.remove("active");
    } else {
      bookmarksContainer.style.display = "none";
      friendsContent.style.display = "block";
      bookmarksTab.classList.remove("active");
      friendsTab.classList.add("active");
    }
  }
});
