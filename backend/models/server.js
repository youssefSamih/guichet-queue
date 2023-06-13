// Servidor de Express
const express = require("express");
const session = require("express-session");
const socketio = require("socket.io");
const passport = require("passport");
const http = require("http");
const path = require("path");
const cors = require("cors");
const LocalStrategy = require("passport-local").Strategy;

const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const Sockets = require("./sockets");
const Auth = require("./auth");
const User = require("./user");

const mongoString = "mongodb://localhost:27017/guichet";
mongoose.connect(mongoString);

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.secret = process.env.SECRET_KEY;
    this.db = mongoose.connection;

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

    this.app.use(
      session({
        secret: this.secret,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongoUrl: this.db.client.s.url }),
        cookie: { maxAge: new Date(Date.now() + 10 * 60 * 60 * 1000) },
      })
    );

    const strategy = new LocalStrategy(User.authenticate());
    passport.use(strategy);
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    this.app.use(passport.initialize());
    this.app.use(passport.session());

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

    this.app.get("/users-list", async (req, res) => {
      const userList = await this.auth.allUsers();

      res.status(userList.code).json(userList.value);
    });

    this.app.post("/create-user", async (req, res) => {
      const newUser = req.body;

      const user = await this.auth.createUser(
        newUser.username,
        newUser.logName,
        newUser.password
      );

      res.status(user.code).json(user.value || user.errors);
    });

    this.app.get("/profile", (req, res) => {
      const loggedUser = this.auth.getAuthenticatedUser(
        req.user,
        req.isAuthenticated()
      );

      return res
        .status(loggedUser.code)
        .json(loggedUser.value || loggedUser.errors);
    });

    this.app.post(
      "/login",
      passport.authenticate("local", {
        failureRedirect: "/login-failure",
        successRedirect: "/login-success",
      }),
      (err, req, res, next) => {
        next();
      }
    );

    this.app.get("/login-failure", (req, res, next) => {
      const errorRes = this.auth.loginFailed();

      return res.status(errorRes.code).json(errorRes.errors);
    });

    this.app.get("/login-success", (req, res, next) => {
      const userLogged = this.auth.login(req.user);

      return res.status(userLogged.code).json(userLogged.value);
    });

    this.app.get("/user/:id", async (req, res) => {
      const user = await this.auth.getUser(req.params.id);

      res.status(user.code).json(user.value || user.errors);
    });

    this.app.delete("/user/:id", async (req, res) => {
      const user = await this.auth.deleteUser(req.params.id);

      res.status(user.code).json(user.value || user.errors);
    });

    this.app.put("/user", async (req, res) => {
      const user = await this.auth.updateUser(req.body);

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
