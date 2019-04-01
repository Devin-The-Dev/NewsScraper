const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const express = require("express");
const app = express();
///
app.use(logger("dev"));
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
//
app.use(express.static(process.cwd() + "/public"));
//Handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
///Mongoose
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news_scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to Mongoose!");
});
//Path
const routes = require("./controllers/controller.js")
app.us("/", routes);
///Heroku || Localhost
let port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Listening on PORT " + port);
});