export async function loadBookmarks() {
  const bookmarksContainer = document.querySelector(".bookmarks");
  const friendsContent = document.querySelector(".friends");

  //todo - clear the bookmarks container
  bookmarksContainer.innerHTML = "";

  //todo - fetch database
  const bookmarksRes = await fetch(`/users/bookmarks`);
  const bookmarks = await bookmarksRes.json();

  //todo - show bookmarks on the UI
  for (let i = 0; i < bookmarks.length; i++) {
    const bookmark = document.createElement("div");
    bookmark.innerHTML = `<i class="fa-solid fa-bookmark"></i>
              <img src="../assets/sign-language/${bookmarks[i].sign_language}-sign.png" alt="" />
            </div>`;
    bookmark.classList.add("bookmark");
    bookmark.setAttribute("data-alphabet", bookmarks[i].sign_language);
    bookmarksContainer.appendChild(bookmark);
  }

  const removeBookmarkButtons = document.querySelectorAll(".fa-bookmark");

  removeBookmarkButtons.forEach((bookmark, index) => {
    bookmark.addEventListener("click", async (e) => {
      const signLanguage = e.target
        .closest("[data-alphabet]")
        .getAttribute("data-alphabet");

      await fetch(`/users/bookmarks/${signLanguage}`, {
        method: "DELETE",
      });

      loadBookmarks();
    });
  });
}
