//Configuration
import express from "express";
import fetch from "cross-fetch";
import fs from "fs";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.post("/upload", async (req, res) => {
  const userImage = req.body.imageString;

  // Remove header
  let base64Image = userImage.split(";base64,").pop();
  let timestamp = Date.now();

  fs.writeFile(
    `snapshot/${timestamp}.png`,
    base64Image,
    { encoding: "base64" },
    function (err) {
      console.log("File created");
    }
  );

  const result = await fetch("http://localhost:8000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(`snapshot/${timestamp}.png`),
  });

  const output = await result.json();

  //Delete the image after prediction
  fs.unlink(`snapshot/${timestamp}.png`, (err) => {
    if (err) {
      throw err;
    }

    console.log("Delete File successfully.");
  });
  console.log(output);
  res.json(output);
});

// app.post("/predict", async (req, res) => {
//   const userInput = req.body.data;

//   //fetch the python server
//   const result = await fetch("http://localhost:8000", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(userInput),
//   });

//   const output = await result.json();

//   res.json(output);
// });

app.use(express.static("public"));

//Port Listener
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
