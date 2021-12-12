# testRPG
A small experiment by me with the aim to create a MMO-Game in the style of Nintendo Games

## Festures
- Tiled integration
- written in typescript

## How to start development?
Run `npm start` and `node .`. You are now set to develop

## How to run with docker?
1. Install Docker and Docker Compose
2. Run `npm run build` and `docker-compose build`
3. Run `docker-compose up`

## Run using Docker Only:
### Server
To build the server:
```docker build -t thallosaurus/schrottimon-server -f Dockerfile.server .```

To run the server:
```docker run --name backend --network <network_name> thallosaurus/schrottimon-server```

### Client
To build the client:
```docker build -t thallosaurus/schrottimon-client -f Dockerfile.client .```

To run the client:
```docker run --name schrottimon --network <network_name> thallosaurus/schrottimon-client```