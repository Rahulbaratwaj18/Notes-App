require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");

const expressLayout = require("express-ejs-layouts");

const session = require("express-session")

const passport= require("passport");

const methodOverride= require("method-override");

const MongoStore = require("connect-mongo");


const connectDB = require("./server/database/db.js");


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// app.use(session({
//   secret: 'Rahul Baratwaj',
//   resave: false,
//   saveUninitialized: true,
//   store:MongoStore.create({
//     mongoUrl : process.env.MONGODB_URI
//   })
// }))


app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      // Provide one of the following options:
      // 1. mongoUrl: 'mongodb://localhost:27017/your-database-name'
      // 2. clientPromise: MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
      // 3. client: Your existing MongoClient instance
      mongoUrl: process.env.MONGODB_URI, // Change this with your MongoDB connection URL
      // Other optional configurations can be added here
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connection to Database

connectDB();

//Static Files

app.use(express.static("public"));

//Templating

app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

//Routes

app.use("/", require("./server/routes/index.js"));
app.use("/", require("./server/routes/auth.js"));

app.get("*", (req, res) => {
  res.status(404).send("Error 404 Page not found..");
});

app.listen(3000, (req, res) => {
  console.log("Server is running on port 3000");
});
