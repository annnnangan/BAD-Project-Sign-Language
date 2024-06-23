const bookmarksTab = document.querySelector(".tab-bookmark");
const friendsTab = document.querySelector(".tab-friends");
const bookmarksContent = document.querySelector(".bookmarks");
const friendsContent = document.querySelector(".friends");

let bookmarksTabActive = true;

bookmarksTab.addEventListener("click", () => {
  bookmarksTabActive = true;
  activeTab();
});

friendsTab.addEventListener("click", () => {
  bookmarksTabActive = false;
  activeTab();
});

function activeTab() {
  if (bookmarksTabActive) {
    bookmarksContent.style.display = "flex";
    friendsContent.style.display = "none";
    bookmarksTab.classList.add("active");
    friendsTab.classList.remove("active");
  } else {
    bookmarksContent.style.display = "none";
    friendsContent.style.display = "block";
    bookmarksTab.classList.remove("active");
    friendsTab.classList.add("active");
  }
}
