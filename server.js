//const expressStatic = require("express").static;
//import { express } from 'express';
//const express = require("express");
//const app = express();
//const http = require("http").Server(app);
//import http_ from 'http';
//const http = http_.createServer(app);

//let io = require('socket.io')(http);
//const MultiplayerServer = require(path.join(__dirname, "./build/lib/Server/ServerMain.js"));
import { MultiplayerServer } from './lib/Server/ServerMain.ts';
//const server = new MultiplayerServer();
//const MultiplayerServer = require(;

const WEBMANIFEST = {
    "dir": "ltr",
    "lang": "en-US",
    "name": "schrottimon",
    "short_name": "schrottimon",
    "description": "schrottimon",
    "icons": [{
        "src": "/assets/icon_512.png",
        "type": "image/png",
        "sizes": "512x512"
    }],
    "background_color": "#000000",
    "theme_color": "#000000",
    "display": "standalone",
    "orientation": "landscape-primary"
}

app.use("/js", (req, res, next) => {
    console.log(`[DEVSERVER] Sending ${req.originalUrl}`);
    next();
}, Static("build_ts"));

app.get("/main.js", (req, res, next) => {
    console.log("[DEVSERVER] Sending main module");
    res.sendFile("/dist/main.bundle.js", { root: __dirname });
});

app.use("/assets", (req, res, next) => {
    console.log(`[DEVSERVER] Sending Sprite ${req.originalUrl}`);
    next();
}, expresStatic("assets"));

app.use("/src", (req, res, next) => {
    console.log(`[DEVSERVER] Sending Source ${req.originalUrl}`);
    next();
}, expresStatic("src"));

app.get("/", (req, res) => {
    res.sendFile("/devassets/index.html", { root: __dirname });
});

app.get("/mapper", (req, res) => {
    res.sendFile("/devassets/mapper.html", { root: __dirname });
});

app.get("/manifest.webmanifest", (req, res) => {
    res.send(WEBMANIFEST);
});

/*app.listen("8080", () => {
    console.log("Dev Server running on :8080");
});*/