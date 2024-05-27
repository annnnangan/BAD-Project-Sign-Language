const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const snap = document.getElementById("snap");
const upload = document.getElementById("upload");
const answer = document.getElementById("user-answer");

const constraints = {
  audio: false,
  video: {
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 576, ideal: 720, max: 1080 },
  },
};

async function startWebCam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    window.stream = stream;
  } catch (e) {
    console.log(e.toString());
  }
}

var context = canvas.getContext("2d");

snap.addEventListener("click", async () => {
  context.drawImage(video, 0, 0, 1280, 720);
  // get image data as string
  const imageString = canvas.toDataURL();

  // send image to server
  const response = await fetch("/upload", {
    method: "POST",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageString: imageString,
    }),
  });

  const results = (await response.json()).data;

  console.log(results);
  answer.innerHTML = `<h1>The detected sign language is ${results}</h1>`;
});

startWebCam();
