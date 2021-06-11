const { static } = require("express");
const express = require("express");
const app = express();

app.use("/js", (req, res, next) => {
    console.log(`[DEVSERVER] Sending ${req.originalUrl}`);
    next();
}, static("build"));

app.use("/assets", (req, res, next) => {
    console.log(`[DEVSERVER] Sending Sprite ${req.originalUrl}`);
    next();
},static("assets"));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname });
});

app.listen("8080", () => {
    console.log("Dev Server running on :8080");
});