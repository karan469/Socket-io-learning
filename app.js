var express = require("express"),
	http = require("http"),
	socketIo = require("socket.io"),
	axios = require("axios"),
	app = express();

const port = process.env.PORT || 4001;
const index = require("./routes/index");

app.use(index);

const server = http.createServer(app);

let interval;
const io = socketIo(server);
io.on("connection", socket => {
	console.log("New client connected");
	if(interval){
		clearInterval(interval);
	}
	interval = setInterval(() => getApiAndEmit(socket),1000);
	socket.on("disconnect", () => {
		console.log("Client Disconnected");
	});
});

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "https://api.darksky.net/forecast/ac2bb2c0f48e4fe48c28a446a1789b5e/37.8267,-122.4233"
    ); // Getting the data from DarkSky
    socket.emit("FromAPI", res.data.currently.temperature); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

server.listen(port, () => console.log("Listening on port " +port));