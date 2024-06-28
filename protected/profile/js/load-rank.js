export async function loadRank() {
  const rankRes = await fetch(`/users/rank`);
  const rank = await rankRes.json();

  const upperListContainer = document.querySelector(".upper-list");
  const downListContainer = document.querySelector(".down-list");

  upperListContainer.innerHTML = "";
  downListContainer.innerHTML = "";

  let medal = ["gold", "silver", "bronze"];

  let upperListLoopTimes;
  let downListLoopTimes;

  if (rank.length < 3) {
    upperListLoopTimes = rank.length;
  } else {
    upperListLoopTimes = 3;
  }

  for (let i = 0; i < upperListLoopTimes; i++) {
    upperListContainer.innerHTML += `<div class="user" data-rank="${i + 1}">
            <div class="rank-user">
              <div class="medal">
                <img src="../assets/medal/${medal[i]}-medal.png" alt="" />
              </div>

              <div class="user-icon">
                <img src="../assets/profile/${rank[i].icon}" alt="" />
              </div>
            </div>

            <div class="rank-info">
              <div class="user-info">
                <p class="name">${rank[i].nickname}</p>
                <p class="username">@${rank[i].username}</p>
              </div>

              <div class="score">
                <p>Score: <span>${rank[i].total_score}</span></p>
              </div>
            </div>
          </div>`;
  }

  for (let i = 3; i < rank.length; i++) {
    downListContainer.innerHTML += `<div class="user" data-rank="${i + 1}">
            <div class="rank-user">
              <h3 class="rank">${i + 1}</h3>
              <div class="user-icon">
                <img src="../assets/profile/${rank[i].icon}" alt="" />
              </div>
            </div>

            <div class="rank-info">
              <div class="user-info">
                <p class="name">${rank[i].nickname}</p>
                <p class="username">@${rank[i].username}</p>
              </div>

              <div class="score">
                <p>Score: <span>${rank[i].total_score}</span></p>
              </div>
            </div>
          </div>`;
  }
}
