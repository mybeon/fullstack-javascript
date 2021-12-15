require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const router = require("./router");
const flash = require("connect-flash");
const markdown = require("marked");
const sanitizeHTML = require("sanitize-html");
const csrf = require("csurf");
const apiRouter = require("./api-router");
const { Console } = require("console");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", apiRouter);

const store = new MongoStore({
  uri: process.env.MONGO_URI,
  collection: "express-sessions",
});

let sessionOptions = session({
  secret: "CApp-session-data",
  resave: false,
  store,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

app.use(flash());
app.use(sessionOptions);

app.use(function (req, res, next) {
  // markdown available
  res.locals.markdownHtml = function (content) {
    return markdown.marked(content);
  };
  // making flash messages available in all templates
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");

  // Visitor id
  if (req.session.user) {
    req.visitorId = req.session.user._id;
  } else {
    req.visitorId = 0;
  }
  // Making user info available in all templates
  res.locals.user = req.session.user;
  next();
});

app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");

app.use(csrf());

app.use((req, res, next) => {
  res.locals.csrf = req.csrfToken();
  next();
});

app.use("/", router);

app.use((err, req, res, next) => {
  if (err) {
    req.flash("errors", err.message);
    req.session.save(() => {
      res.redirect("/");
    });
  } else {
    next();
  }
});

const server = http.createServer(app);
const io = require("socket.io")(server);

io.use((socket, next) => {
  sessionOptions(socket.request, socket.request.res, next);
});

io.on("connection", (socket) => {
  if (socket.request.session.user) {
    let user = socket.request.session.user;
    socket.emit("welcome", { username: user.username, avatar: user.avatar });
    socket.on("messageFromBrowser", (data) => {
      let sendMessage = {
        message: sanitizeHTML(data.message, { allowedTags: [], allowedAttributes: {} }),
        username: socket.request.session.user.username,
        avatar: socket.request.session.user.avatar,
      };
      socket.broadcast.emit("messageFromServer", sendMessage);
    });
  }
});

module.exports = server;
