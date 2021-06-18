const { static } = require("express");
const express = require("express");
const app = express();
const http = require("http").Server(app);
let io = require('socket.io')(http);

const WEBMANIFEST = {
    "dir": "ltr",
    "lang": "en-US",
    "name": "PRiSMFLUX",
    "short_name": "PRiSMFLUX",
    "description": "DJ PRiSMFLUX - a huge, frickin' nerd with a sense of humor",
    "icons": [{
        "src": "icon_512.png",
        "type": "image/png",
        "sizes": "512x512"
    }],
    "background_color": "#000000",
    "theme_color": "#000000",
    "start_url": "https://prismflux.de/",
    "scope": "https://prismflux.de/",
    "display": "standalone",
    "orientation": "portrait-primary"
}

app.use("/js", (req, res, next) => {
    console.log(`[DEVSERVER] Sending ${req.originalUrl}`);
    next();
}, static("build"));

app.use("/assets", (req, res, next) => {
    console.log(`[DEVSERVER] Sending Sprite ${req.originalUrl}`);
    next();
}, static("assets"));

app.use("/src", (req, res, next) => {
    console.log(`[DEVSERVER] Sending Source ${req.originalUrl}`);
    next();
}, static("src"));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname });
});

app.get("/mapper", (req, res) => {
    res.sendFile("mapper.html", { root: __dirname });
});

app.get("/manifest.webmanifest", (req, res) => {
    res.send(WEBMANIFEST);
})

io.on('connection', (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    })
});

app.listen("8080", () => {
    console.log("Dev Server running on :8080");
});