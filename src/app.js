const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const sessionOptions = {
  name: "taskManagerSession",
  secret: process.env.SESSION_SECRET || "development-only-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24,
  },
};

if (process.env.MONGODB_URI) {
  sessionOptions.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  });
}

app.use(session(sessionOptions));
app.use(express.static("public"));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Task Manager is running",
  });
});

app.use("/api/auth", authRoutes);

module.exports = app;
