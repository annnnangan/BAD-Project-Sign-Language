export async function loadIcons() {
  const IconsContainer = document.querySelector(".select-icon");

  IconsContainer.innerHTML = "";

  //todo - fetch database
  const IconsRes = await fetch(`/users/icons`);
  const icons = await IconsRes.json();

  console.log(icons);

  icons.forEach((image, index) => {
    const imageWithoutFileType = image.icon.replace(".png", "");

    if (index == 0) {
      IconsContainer.innerHTML += `<input
        checked
        id="${imageWithoutFileType}"
        type="radio"
        name="icon"
        value="${imageWithoutFileType}"
      />
      <label class="icon ${imageWithoutFileType}" for="${imageWithoutFileType}"></label>
   `;
    } else {
      IconsContainer.innerHTML += `<input
                id="${imageWithoutFileType}"
                type="radio"
                name="icon"
                value="${image.icon}"
              />
              <label class="icon ${imageWithoutFileType}" for="${imageWithoutFileType}"></label>
           `;
    }

    document.querySelector(
      `.${imageWithoutFileType}`
    ).style.backgroundImage = `url('./assets/profile/${image.icon}')`;
  });
}
