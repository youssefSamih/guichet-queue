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

const upload = require("./storage");
const Sockets = require("./sockets");
const Auth = require("./auth");
const User = require("./user");
const Photos = require("./photos");

const mongoString = process.env.DB;

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.secret = process.env.SECRET_KEY;
    this.db = mongoose.connection;
    this.photos = new Photos();

    // Http server
    this.server = http.createServer(this.app);

    // socket configurations
    this.io = socketio(this.server, {
      origin: (origin, callback) => {
        // Get the local IP address of the machine
        const ipAddress = this.server.address().address;

        // Set the allowed origins based on the local IP address or "localhost"
        const allowedOrigins = [
          `http://${ipAddress}:3000`,
          process.env.ORIGIN_CLIENT,
        ];

        // Check if the request's origin is allowed
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback("Not allowed by Socket.IO");
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
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

    const dynamicCors = (req, res, next) => {
      // Get the local IP address of the machine
      const ipAddress = req.connection.localAddress;

      // Set the allowed origin based on the local IP address
      const allowedOrigin = [
        `http://${ipAddress}:3000`,
        process.env.ORIGIN_CLIENT,
      ];

      // Check if the request's origin is allowed
      const requestOrigin = req.headers.origin;
      if (allowedOrigin.includes(requestOrigin)) {
        // Set the Access-Control-Allow-Origin header
        res.header("Access-Control-Allow-Origin", requestOrigin);
      }

      // Continue to the next middleware
      next();
    };

    // Add the dynamic CORS middleware
    this.app.use(dynamicCors);

    // Configure cors
    this.app.use(
      cors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
      })
    );

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

      const user = await this.auth.createUser({
        username: newUser.username,
        logName: newUser.logName,
        password: newUser.password,
        imgProfile: newUser.imgProfile,
      });

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
        if (err) next(err);
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

    this.app.post("/logout", (req, res) => {
      this.auth.logout(req.user_id);

      req.logout((err) => {
        if (err) return next(err);

        req.session.destroy((err) => {
          if (err) {
            res.status(500).json({ message: "Error logging out" });
          } else {
            res.status(200).json({ message: "Logged out successfully" });
          }
        });
      });
    });

    this.app.post("/upload", upload.single("file"), async (req, res) => {
      const uploadedFile = await this.photos.uploadImage(
        req.file,
        req.connection.localAddress
      );

      return res
        .status(uploadedFile.code)
        .send(uploadedFile.errors || uploadedFile.value);
    });

    this.app.get("/file/:id", async (req, res) => {
      const image = await this.photos.getImage(req.params.id);

      image.errors && res.status(image.code).json(image.errors);

      image.value &&
        res
          .status(image.code)
          .sendFile(path.join(__dirname, `../${image.value.path}`));
    });

    this.app.delete("/file/:id", async (req, res) => {
      const file = await this.photos.deleteImage(req.params.id);

      res.status(file.code).json(file.errors || file.value);
    });
  }

  async createAdminUser() {
    try {
      const adminUser = await User.findByUsername(process.env.ADMIN_EMAIL);

      if (!adminUser) {
        await this.auth.createUser(
          process.env.ADMIN_EMAIL,
          process.env.ADMIN_LOG_NAME,
          process.env.ADMIN_PASSWORD,
          "admin"
        );
      }

      if (adminUser?._doc?.role === "agent") {
        await User.findByIdAndUpdate(adminUser._id, {
          ...adminUser._doc,
          role: "admin",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  execute() {
    // Initialize Middlewares
    this.middlewares();

    // Initialize Server
    this.server.listen(this.port, async () => {
      await mongoose.connect(mongoString, async () => {
        await this.createAdminUser();

        console.log("Server running on port:", this.port);
      });
    });
  }
}

module.exports = Server;
