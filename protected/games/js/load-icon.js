export async function loadUserIcon() {
  const profileRes = await fetch(`/users/profile`);
  const userProfile = await profileRes.json();
  const userIcon = document.querySelector(".profile img");
  userIcon.src = `../assets/profile/${userProfile[0].icon}`;
}
