// Servidor de Express
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const cors = require("cors");

const Sockets = require("./sockets");
const Auth = require("./auth");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // Http server
    this.server = http.createServer(this.app);

    // socket configurations
    this.io = socketio(this.server, {
      /* settings */
    });

    // initialize sockets
    this.sockets = new Sockets(this.io);

    this.auth = new Auth();
  }

  middlewares() {
    // Display the public directory
    this.app.use(express.static(path.resolve(__dirname, "../public")));

    // Middleware to parse JSON bodies
    this.app.use(express.json());

    // Middleware to parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true }));

    // Configure cors
    this.app.use(cors());

    // Get last tickets
    this.app.get("/last-tickets", (req, res) => {
      res.json({
        ok: true,
        lastTickets: this.sockets.ticketList.lastTickets,
      });
    });

    this.app.get("/users-list", (req, res) => {
      res.status(this.auth.allUsers.code).json(this.auth.allUsers.value);
    });

    this.app.post("/create-user", (req, res) => {
      const newUser = req.body;

      const user = this.auth.createUser(...newUser);

      res.status(user.code).json(user.value || user.errors);
    });

    this.app.post("/login", (req, res) => {
      const { email, password } = req.body;

      const user = this.auth.login(email, password);

      res.status(user.code).json(user.value || user.errors);
    });
  }

  execute() {
    // Inicializar Middlewares
    this.middlewares();

    // Inicializar Server
    this.server.listen(this.port, () => {
      console.log("Server running on port:", this.port);
    });
  }
}

module.exports = Server;
